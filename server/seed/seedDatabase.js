import mongoose from 'mongoose';
import ShiftLog from '../models/ShiftLog.js';
import Equipment from '../models/Equipment.js';
import FaultChecklist from '../models/FaultChecklist.js';
import ChatSession from '../models/ChatSession.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear all collections
    console.log('Clearing existing data...');
    await ShiftLog.deleteMany({});
    await Equipment.deleteMany({});
    await FaultChecklist.deleteMany({});
    await ChatSession.deleteMany({});
    console.log('✓ All collections cleared');

    // Seed Equipment
    console.log('Seeding equipment...');
    const equipment = [
      {
        name: '200 MVA T/F-1 (BHEL)',
        type: 'Transformer',
        thresholds: {
          OTI_alarm: 85,
          OTI_trip: 95,
          WTI_alarm: 90,
          WTI_trip: 100,
        },
        manufacturer: 'BHEL',
        rating: '200 MVA',
        voltageRatio: '220/132 kV',
        isActive: true,
      },
      {
        name: '200 MVA T/F-2 (BHEL)',
        type: 'Transformer',
        thresholds: {
          OTI_alarm: 85,
          OTI_trip: 95,
          WTI_alarm: 90,
          WTI_trip: 100,
        },
        manufacturer: 'BHEL',
        rating: '200 MVA',
        voltageRatio: '220/132 kV',
        isActive: true,
      },
      {
        name: '40 MVA T/F',
        type: 'Transformer',
        thresholds: {
          OTI_alarm: 85,
          OTI_trip: 95,
          WTI_alarm: 90,
          WTI_trip: 100,
        },
        rating: '40 MVA',
        isActive: true,
      },
      {
        name: '110V DC Battery Bank (Exide OPzS 300P, 55 cells)',
        type: 'Battery',
        thresholds: {
          floatVoltage_min: 120,
          floatVoltage_max: 126,
          cellVoltage_nominal: 2.23,
          SG_healthy_min: 1.19,
          SG_healthy_max: 1.215,
        },
        isActive: true,
      },
      {
        name: '220 kV Bus',
        type: 'Busbar',
        thresholds: {
          voltage_min: 209,
          voltage_max: 231,
        },
        isActive: true,
      },
      {
        name: '132 kV Bus',
        type: 'Busbar',
        thresholds: {
          voltage_min: 125.4,
          voltage_max: 138.6,
        },
        isActive: true,
      },
      { name: 'Banda Town', type: 'Feeder', isActive: true },
      { name: 'Atarra', type: 'Feeder', isActive: true },
      { name: 'Baberu', type: 'Feeder', isActive: true },
      { name: 'Pailani', type: 'Feeder', isActive: true },
      { name: 'Augasi', type: 'Feeder', isActive: true },
      { name: 'Karvi/Rajapur', type: 'Feeder', isActive: true },
    ];

    await Equipment.insertMany(equipment);
    console.log('✓ Equipment seeded');

    // Seed Fault Checklists
    console.log('Seeding fault checklists...');
    const faultChecklists = [
      {
        faultId: 'TF_OVERHEAT_001',
        faultTitle: 'Transformer Overheating',
        severity: 'Critical',
        triggerPath: ['transformers', 'OTI', '>85'],
        immediateActions: [
          'Alert shift in-charge immediately',
          'Reduce load on transformer if possible',
          'Activate cooling fan if not already on',
          'Monitor temperature every 15 minutes',
        ],
        checklist: [
          {
            step: 1,
            action: 'Check OTI temperature reading on gauges',
            component: 'Transformer Temperature Indicator',
            safetyNote: 'Do not touch gauges if temperature is too high',
          },
          {
            step: 2,
            action: 'Verify cooling fan is running (both fans if dual)',
            component: 'Cooling Fan Motor',
            safetyNote: 'Do not attempt to stop fan manually',
          },
          {
            step: 3,
            action: 'Check oil circulation pump status',
            component: 'Oil Circulation Pump',
            safetyNote: 'Pump operation is critical for cooling',
          },
          {
            step: 4,
            action: 'Inspect radiator/cooler for blockages or dirt',
            component: 'Oil Cooler',
            safetyNote: 'Do not clean while transformer is energized',
          },
          {
            step: 5,
            action: 'Monitor WTI reading for correlation',
            component: 'Winding Temperature Indicator',
            safetyNote: 'WTI indicates actual winding temperature',
          },
          {
            step: 6,
            action: 'Contact maintenance if temp does not reduce in 30 min',
            component: 'N/A',
            safetyNote: 'Do not operate above trip temperature',
          },
        ],
        basedOnIncident: 'High ambient temperature during peak demand',
      },
      {
        faultId: 'BREAKER_SF6_LOW_001',
        faultTitle: 'SF6 Breaker Pressure Low',
        severity: 'High',
        triggerPath: ['breakers', 'SF6Pressure', '<4.0'],
        immediateActions: [
          'Alert shift in-charge about low SF6 pressure',
          'Monitor breaker operation closely',
          'Avoid tripping if possible to prevent SF6 loss',
          'Calculate corrected pressure based on temperature',
        ],
        checklist: [
          {
            step: 1,
            action: 'Read SF6 pressure from breaker gauge',
            component: 'Breaker Pressure Gauge',
            safetyNote: 'Gauge must be read perpendicular to view',
          },
          {
            step: 2,
            action: 'Note ambient temperature for correction',
            component: 'Thermometer',
            safetyNote: 'Temperature affects SF6 density',
          },
          {
            step: 3,
            action: 'Calculate corrected pressure using tables',
            component: 'Pressure Correction Table',
            safetyNote: 'Refer to breaker manual for correction formula',
          },
          {
            step: 4,
            action: 'Visually inspect for obvious leaks',
            component: 'Breaker Body',
            safetyNote: 'SF6 is colorless and odorless gas',
          },
          {
            step: 5,
            action: 'Schedule maintenance immediately if below 80%',
            component: 'N/A',
            safetyNote: 'Low pressure affects breaker performance',
          },
          {
            step: 6,
            action: 'Document reading and trend in log',
            component: 'Operation Log',
            safetyNote: 'Trending helps identify slow leaks',
          },
        ],
        basedOnIncident: 'Micro-leak in breaker connection',
      },
      {
        faultId: 'BUS_VOLTAGE_OOR_001',
        faultTitle: 'Bus Voltage Out of Range',
        severity: 'High',
        triggerPath: ['busReadings', 'voltage', 'outOfRange'],
        immediateActions: [
          'Verify reading from multiple sources if available',
          'Notify grid operator immediately',
          'Check SCADA system for confirmation',
          'Monitor for load changes',
        ],
        checklist: [
          {
            step: 1,
            action: 'Verify voltage reading from instrument panel',
            component: 'Voltage Indicator',
            safetyNote: 'Cross-check with alternate source if available',
          },
          {
            step: 2,
            action: 'Check tap changer position and count taps',
            component: 'OLTC Control Relay',
            safetyNote: 'Do not manually operate OLTC',
          },
          {
            step: 3,
            action: 'Monitor voltage fluctuations over 5 minutes',
            component: 'Voltage Gauge',
            safetyNote: 'Transient fluctuations are normal',
          },
          {
            step: 4,
            action: 'Analyze connected load variations',
            component: 'Feeder Loading Display',
            safetyNote: 'High loads cause voltage sag',
          },
          {
            step: 5,
            action: 'Verify system frequency is within limits',
            component: 'Frequency Meter',
            safetyNote: 'Frequency directly affects voltage regulation',
          },
          {
            step: 6,
            action: 'Contact shift engineer for load adjustment',
            component: 'N/A',
            safetyNote: 'Load adjustment is most effective remedy',
          },
        ],
        basedOnIncident: 'High load causing voltage depression',
      },
      {
        faultId: 'BATTERY_VOLTAGE_ABNORMAL_001',
        faultTitle: 'Battery Float Voltage Abnormal',
        severity: 'Medium',
        triggerPath: ['battery', 'floatVoltage', 'outOfRange'],
        immediateActions: [
          'Check charger output immediately',
          'Verify no load is connected to battery',
          'Monitor voltage continuously',
          'Be prepared to switch to standby charger if needed',
        ],
        checklist: [
          {
            step: 1,
            action: 'Read battery float voltage from indicator',
            component: 'Float Voltage Indicator',
            safetyNote: 'Normal range is 120-126V for 110V system',
          },
          {
            step: 2,
            action: 'Verify charger output voltage settings',
            component: 'Battery Charger Control Panel',
            safetyNote: 'Do not adjust without authorization',
          },
          {
            step: 3,
            action: 'Check for active DC load from trip circuits',
            component: 'DC Load Display',
            safetyNote: 'Trip operations consume DC battery',
          },
          {
            step: 4,
            action: 'Measure individual cell voltages if available',
            component: 'Battery Cell Monitoring System',
            safetyNote: 'All cells should be approximately equal',
          },
          {
            step: 5,
            action: 'Check specific gravity of sample cells',
            component: 'Hydrometer',
            safetyNote: 'Use safety precautions when handling acid',
          },
          {
            step: 6,
            action: 'Contact maintenance for charger service',
            component: 'N/A',
            safetyNote: 'Charger may need calibration or repair',
          },
        ],
        basedOnIncident: 'Charger calibration drift',
      },
    ];

    await FaultChecklist.insertMany(faultChecklists);
    console.log('✓ Fault checklists seeded');

    // Seed Shift Logs with realistic data
    console.log('Seeding shift logs...');
    const shiftLogs = [];
    const operators = ['user1', 'user2', 'user3'];
    const shiftTypes = ['Morning', 'Afternoon', 'Night'];
    const today = new Date();

    // Generate data for last 7 days
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);

      for (let shiftIdx = 0; shiftIdx < 3; shiftIdx++) {
        const operator = operators[shiftIdx];
        const shiftType = shiftTypes[shiftIdx];

        // Generate realistic values with some variations
        const busReadings = {
          bus220kV: 220 + (Math.random() - 0.5) * 10,
          bus132kV: 132 + (Math.random() - 0.5) * 6,
          frequency: 50 + (Math.random() - 0.5) * 0.3,
        };

        const transformers = [
          {
            name: '200 MVA T/F-1 (BHEL)',
            OTI: 65 + Math.random() * 20,
            WTI: 60 + Math.random() * 20,
            oilLevel: 'Normal',
            OLTCPosition: Math.floor(Math.random() * 33),
            OLTCOperationCount: Math.floor(Math.random() * 5),
            coolingFanStatus: 'Auto',
            remarks: 'Operating normally',
          },
          {
            name: '200 MVA T/F-2 (BHEL)',
            OTI: 68 + Math.random() * 18,
            WTI: 62 + Math.random() * 18,
            oilLevel: 'Normal',
            OLTCPosition: Math.floor(Math.random() * 33),
            OLTCOperationCount: Math.floor(Math.random() * 3),
            coolingFanStatus: 'Auto',
            remarks: 'Operating normally',
          },
          {
            name: '40 MVA T/F',
            OTI: 55 + Math.random() * 25,
            WTI: 50 + Math.random() * 25,
            oilLevel: 'Normal',
            OLTCPosition: Math.floor(Math.random() * 33),
            OLTCOperationCount: 0,
            coolingFanStatus: 'Auto',
            remarks: 'Good condition',
          },
        ];

        const breakers = [
          {
            name: '220kV Incoming - 1',
            SF6Pressure: 4.5 + Math.random() * 0.8,
            ambientTemp: 28 + Math.random() * 8,
            SF6CorrectedStatus: 'Normal',
          },
          {
            name: '220kV Incoming - 2',
            SF6Pressure: 4.4 + Math.random() * 0.8,
            ambientTemp: 27 + Math.random() * 8,
            SF6CorrectedStatus: 'Normal',
          },
          {
            name: '132kV T/F-1 Breaker',
            SF6Pressure: 4.3 + Math.random() * 0.8,
            ambientTemp: 26 + Math.random() * 8,
            SF6CorrectedStatus: 'Normal',
          },
          {
            name: '132kV T/F-2 Breaker',
            SF6Pressure: 4.2 + Math.random() * 0.8,
            ambientTemp: 26 + Math.random() * 8,
            SF6CorrectedStatus: 'Normal',
          },
        ];

        const feeders = [
          {
            name: 'Banda Town',
            MW: 45 + Math.random() * 30,
            MVAR: 20 + Math.random() * 20,
            status: 'Energised',
          },
          {
            name: 'Atarra',
            MW: 38 + Math.random() * 25,
            MVAR: 15 + Math.random() * 18,
            status: 'Energised',
          },
          {
            name: 'Baberu',
            MW: 32 + Math.random() * 22,
            MVAR: 12 + Math.random() * 16,
            status: 'Energised',
          },
          {
            name: 'Pailani',
            MW: 28 + Math.random() * 20,
            MVAR: 10 + Math.random() * 14,
            status: 'Energised',
          },
          {
            name: 'Augasi',
            MW: 25 + Math.random() * 18,
            MVAR: 8 + Math.random() * 12,
            status: 'Energised',
          },
          {
            name: 'Karvi/Rajapur',
            MW: 22 + Math.random() * 16,
            MVAR: 6 + Math.random() * 10,
            status: 'Energised',
          },
        ];

        const battery = {
          floatVoltage: 122 + Math.random() * 3,
          floatCurrent: 2 + Math.random() * 4,
          remarks: 'All cells healthy',
        };

        // Generate anomalies based on some conditions
        const anomalies = [];
        if (transformers[0].OTI > 85) anomalies.push(`High OTI on T/F-1: ${transformers[0].OTI.toFixed(1)}°C`);
        if (transformers[1].OTI > 85) anomalies.push(`High OTI on T/F-2: ${transformers[1].OTI.toFixed(1)}°C`);
        if (busReadings.bus220kV < 209 || busReadings.bus220kV > 231) anomalies.push(`220kV Bus voltage out of range: ${busReadings.bus220kV.toFixed(1)}kV`);

        shiftLogs.push({
          operator,
          shiftType,
          date,
          busReadings,
          transformers,
          breakers,
          feeders,
          battery,
          anomalies,
          generalRemarks: `${shiftType} shift report for ${date.toDateString()}. All systems operational.`,
        });
      }
    }

    await ShiftLog.insertMany(shiftLogs);
    console.log(`✓ Shift logs seeded (${shiftLogs.length} entries)`);

    console.log('');
    console.log('✅ Database seeding complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Equipment: ${equipment.length} items`);
    console.log(`   - Fault Checklists: ${faultChecklists.length} items`);
    console.log(`   - Shift Logs: ${shiftLogs.length} entries (7 days, 3 shifts/day)`);
    console.log(`   - Operators: ${operators.join(', ')}`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
