import { sf6TempCorrection } from './sf6TempCorrection.js';

// Client-side anomaly detector (for display purposes, real detection happens on server)
export const detectClientAnomalies = (shiftData) => {
  const anomalies = [];

  if (!shiftData) return anomalies;

  // Check transformer thresholds
  if (shiftData.transformers && Array.isArray(shiftData.transformers)) {
    shiftData.transformers.forEach((transformer) => {
      if (transformer.OTI >= 95) {
        anomalies.push({ type: 'critical', equipment: transformer.name, param: 'OTI', value: transformer.OTI });
      } else if (transformer.OTI >= 85) {
        anomalies.push({ type: 'warning', equipment: transformer.name, param: 'OTI', value: transformer.OTI });
      }

      if (transformer.WTI >= 100) {
        anomalies.push({ type: 'critical', equipment: transformer.name, param: 'WTI', value: transformer.WTI });
      } else if (transformer.WTI >= 90) {
        anomalies.push({ type: 'warning', equipment: transformer.name, param: 'WTI', value: transformer.WTI });
      }
    });
  }

  // Check SF6 breaker pressure with temperature correction
  if (shiftData.breakers && Array.isArray(shiftData.breakers)) {
    shiftData.breakers.forEach((breaker) => {
      if (breaker.SF6Pressure && breaker.ambientTemp) {
        const correctedPressure = sf6TempCorrection(breaker.SF6Pressure, breaker.ambientTemp);
        if (correctedPressure < 4.8) {
          anomalies.push({ type: 'critical', equipment: breaker.name, param: 'SF6', value: correctedPressure });
        } else if (correctedPressure < 5.2) {
          anomalies.push({ type: 'warning', equipment: breaker.name, param: 'SF6', value: correctedPressure });
        }
      }
    });
  }

  // Check battery voltage
  if (shiftData.battery) {
    if (shiftData.battery.floatVoltage > 126) {
      anomalies.push({ type: 'warning', equipment: 'Battery', param: 'Float Voltage', value: shiftData.battery.floatVoltage });
    } else if (shiftData.battery.floatVoltage < 120) {
      anomalies.push({ type: 'critical', equipment: 'Battery', param: 'Float Voltage', value: shiftData.battery.floatVoltage });
    }
  }

  // Check bus voltages
  if (shiftData.busReadings) {
    if (shiftData.busReadings.bus220kV < 209 || shiftData.busReadings.bus220kV > 231) {
      anomalies.push({ type: 'warning', equipment: '220 kV Bus', param: 'Voltage', value: shiftData.busReadings.bus220kV });
    }
    if (shiftData.busReadings.bus132kV < 125.4 || shiftData.busReadings.bus132kV > 138.6) {
      anomalies.push({ type: 'warning', equipment: '132 kV Bus', param: 'Voltage', value: shiftData.busReadings.bus132kV });
    }
    if (shiftData.busReadings.frequency < 49.5 || shiftData.busReadings.frequency > 50.5) {
      anomalies.push({ type: 'warning', equipment: 'Grid', param: 'Frequency', value: shiftData.busReadings.frequency });
    }
  }

  return anomalies;
};

// Check if a value exceeds threshold
export const isAnomalous = (equipmentType, parameter, value) => {
  const thresholds = {
    OTI_alarm: 85,
    OTI_trip: 95,
    WTI_alarm: 90,
    WTI_trip: 100,
    SF6_alarm: 5.2,
    SF6_lockout: 4.8,
    battery_min: 120,
    battery_max: 126,
    bus220_min: 209,
    bus220_max: 231,
    bus132_min: 125.4,
    bus132_max: 138.6,
    frequency_min: 49.5,
    frequency_max: 50.5,
  };

  // Implementation depends on equipment type
  return false;
};
