import ShiftLog from '../models/ShiftLog.js';

export const getAnalytics = async (req, res) => {
  try {
    const { equipment, parameter, days = 7 } = req.query;

    if (!equipment || !parameter) {
      return res.status(400).json({
        message: 'Both equipment and parameter query parameters are required',
      });
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    let matchFilter = {
      date: { $gte: daysAgo },
    };

    let projectionField = null;

    // Determine field to project based on equipment and parameter
    if (
      equipment === '200 MVA T/F-1 (BHEL)' ||
      equipment === '200 MVA T/F-2 (BHEL)' ||
      equipment === '40 MVA T/F'
    ) {
      // Transformer
      if (parameter === 'OTI') {
        projectionField = 'transformers.OTI';
      } else if (parameter === 'WTI') {
        projectionField = 'transformers.WTI';
      }
    } else if (
      [
        'Banda Town',
        'Atarra',
        'Baberu',
        'Pailani',
        'Augasi',
        'Karvi/Rajapur',
      ].includes(equipment)
    ) {
      // Feeder
      if (parameter === 'MW') {
        projectionField = 'feeders.MW';
      } else if (parameter === 'MVAR') {
        projectionField = 'feeders.MVAR';
      }
    } else if (equipment === '110V DC Battery Bank (Exide OPzS 300P, 55 cells)') {
      // Battery
      if (parameter === 'floatVoltage') {
        projectionField = 'battery.floatVoltage';
      } else if (parameter === 'floatCurrent') {
        projectionField = 'battery.floatCurrent';
      }
    } else if (equipment === '220 kV Bus' || equipment === '132 kV Bus') {
      // Bus
      if (parameter === 'Voltage') {
        if (equipment === '220 kV Bus') {
          projectionField = 'busReadings.bus220kV';
        } else {
          projectionField = 'busReadings.bus132kV';
        }
      }
    }

    if (!projectionField) {
      return res
        .status(400)
        .json({ message: 'Invalid equipment or parameter combination' });
    }

    let shiftLogs = await ShiftLog.find(matchFilter).sort({ date: 1 });

    // Extract values based on equipment
    let dataPoints = [];

    if (
      equipment === '200 MVA T/F-1 (BHEL)' ||
      equipment === '200 MVA T/F-2 (BHEL)' ||
      equipment === '40 MVA T/F'
    ) {
      // Transformer
      shiftLogs.forEach((log) => {
        const transformer = log.transformers.find((t) => t.name === equipment);
        if (transformer) {
          const value =
            parameter === 'OTI' ? transformer.OTI : transformer.WTI;
          if (value !== undefined && value !== null) {
            dataPoints.push({
              date: log.date.toISOString().split('T')[0],
              shift: log.shiftType,
              value: value,
              threshold:
                parameter === 'OTI'
                  ? 85
                  : 90, /* alarm thresholds */
            });
          }
        }
      });
    } else if (
      [
        'Banda Town',
        'Atarra',
        'Baberu',
        'Pailani',
        'Augasi',
        'Karvi/Rajapur',
      ].includes(equipment)
    ) {
      // Feeder
      shiftLogs.forEach((log) => {
        const feeder = log.feeders.find((f) => f.name === equipment);
        if (feeder) {
          const value = parameter === 'MW' ? feeder.MW : feeder.MVAR;
          if (value !== undefined && value !== null) {
            dataPoints.push({
              date: log.date.toISOString().split('T')[0],
              shift: log.shiftType,
              value: value,
              threshold: parameter === 'MW' ? 150 : 100, /* generic thresholds */
            });
          }
        }
      });
    } else if (
      equipment === '110V DC Battery Bank (Exide OPzS 300P, 55 cells)'
    ) {
      // Battery
      shiftLogs.forEach((log) => {
        const batteryValue =
          parameter === 'floatVoltage'
            ? log.battery.floatVoltage
            : log.battery.floatCurrent;
        if (batteryValue !== undefined && batteryValue !== null) {
          dataPoints.push({
            date: log.date.toISOString().split('T')[0],
            shift: log.shiftType,
            value: batteryValue,
            threshold:
              parameter === 'floatVoltage' ? 122.65 : 0, /* nominal float voltage */
          });
        }
      });
    } else if (equipment === '220 kV Bus' || equipment === '132 kV Bus') {
      // Bus
      shiftLogs.forEach((log) => {
        const voltage =
          equipment === '220 kV Bus'
            ? log.busReadings.bus220kV
            : log.busReadings.bus132kV;
        if (voltage !== undefined && voltage !== null) {
          dataPoints.push({
            date: log.date.toISOString().split('T')[0],
            shift: log.shiftType,
            value: voltage,
            threshold:
              equipment === '220 kV Bus' ? 220 : 132, /* nominal voltages */
          });
        }
      });
    }

    res.status(200).json(dataPoints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
