import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ShiftLog from '../models/ShiftLog.js';
import Equipment from '../models/Equipment.js';
import FaultChecklist from '../models/FaultChecklist.js';
import FaultDecisionTree from '../models/FaultDecisionTree.js';
import ChatSession from '../models/ChatSession.js';

dotenv.config();

const seedCompleteData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear all collections
    await ShiftLog.deleteMany({});
    await Equipment.deleteMany({});
    await FaultChecklist.deleteMany({});
    await FaultDecisionTree.deleteMany({});
    await ChatSession.deleteMany({});
    console.log('✓ Cleared existing data\n');

    // ============ SEED EQUIPMENT ============
    const equipment = await Equipment.insertMany([
      {
        name: '200 MVA T/F-1 (BHEL)',
        type: 'Transformer',
        thresholds: { otiAlarm: 85, otiTrip: 95, wtiAlarm: 90, wtiTrip: 100 }
      },
      {
        name: '200 MVA T/F-2 (BHEL)',
        type: 'Transformer',
        thresholds: { otiAlarm: 85, otiTrip: 95, wtiAlarm: 90, wtiTrip: 100 }
      },
      {
        name: '40 MVA T/F',
        type: 'Transformer',
        thresholds: { otiAlarm: 85, otiTrip: 95, wtiAlarm: 90, wtiTrip: 100 }
      },
      { name: '220 kV Busbar', type: 'Busbar', thresholds: { min: 209, max: 231 } },
      { name: '132 kV Busbar', type: 'Busbar', thresholds: { min: 125.4, max: 138.6 } },
      { name: 'Banda Town Feeder', type: 'Feeder', thresholds: {} },
      { name: 'Atarra Feeder', type: 'Feeder', thresholds: {} },
      { name: 'Baberu Feeder', type: 'Feeder', thresholds: {} },
      { name: 'Pailani Feeder', type: 'Feeder', thresholds: {} },
      { name: 'Augasi Feeder', type: 'Feeder', thresholds: {} },
      { name: 'Karvi/Rajapur Feeder', type: 'Feeder', thresholds: {} },
      { name: 'DC Battery Bank', type: 'Battery', thresholds: { min: 120, max: 126 } }
    ]);;
    console.log(`✓ Seeded ${equipment.length} equipment records\n`);

    // ============ SEED FAULT CHECKLISTS ============
    const faultChecklists = await FaultChecklist.insertMany([
      {
        faultId: 'TF_OVERHEAT_001',
        faultTitle: 'Transformer Overheating',
        severity: 'Critical',
        immediateActions: [
          'Reduce load if possible',
          'Ensure cooling fans are running',
          'Notify control room',
          'Prepare for shutdown if temp continues rising'
        ],
        checklist: [
          { step: 1, action: 'Check OTI & WTI readings', component: 'Transformer', safetyNote: 'High temperature risk' },
          { step: 2, action: 'Verify cooling fan operation', component: 'Cooling Fan', safetyNote: 'Ensure proper ventilation' },
          { step: 3, action: 'Check for oil leaks', component: 'Transformer Body', safetyNote: 'Risk of spill' },
          { step: 4, action: 'Measure ambient temperature', component: 'Environment', safetyNote: 'Baseline for analysis' },
          { step: 5, action: 'Review loading on transformer', component: 'Transformer', safetyNote: 'Overload risk' },
          { step: 6, action: 'Check for blocked ventilation', component: 'Cooling System', safetyNote: 'Blockage hazard' }
        ]
      },
      {
        faultId: 'BREAKER_SF6_LOW_001',
        faultTitle: 'SF6 Breaker Pressure Low',
        severity: 'High',
        immediateActions: [
          'Alert operation control',
          'Prepare isolation procedure',
          'Schedule breaker maintenance',
          'Monitor pressure continuously'
        ],
        checklist: [
          { step: 1, action: 'Record current pressure & temperature', component: 'SF6 Breaker', safetyNote: 'Accurate reading needed' },
          { step: 2, action: 'Apply temperature correction formula', component: 'SF6 System', safetyNote: 'Critical for accuracy' },
          { step: 3, action: 'Check for visible leaks around breaker', component: 'Breaker Housing', safetyNote: 'Gas hazard' },
          { step: 4, action: 'Inspect breaker maintenance history', component: 'Documentation', safetyNote: 'Historical data' },
          { step: 5, action: 'Verify pressure gauge calibration', component: 'Gauge', safetyNote: 'Instrumentation check' },
          { step: 6, action: 'Plan for SF6 gas refilling', component: 'SF6 System', safetyNote: 'Environmental safety' }
        ]
      },
      {
        faultId: 'BUS_VOLTAGE_OOR_001',
        faultTitle: 'Bus Voltage Out of Range',
        severity: 'High',
        immediateActions: [
          'Check tap changer position',
          'Notify grid operator',
          'Adjust OLTC if voltage is low',
          'Monitor voltage trend'
        ],
        checklist: [
          { step: 1, action: 'Record voltage on all phases', component: 'Bus', safetyNote: 'Phase imbalance risk' },
          { step: 2, action: 'Check frequency reading', component: 'System Frequency', safetyNote: 'Stability indicator' },
          { step: 3, action: 'Verify voltage transformer connections', component: 'VT', safetyNote: 'Secondary circuit risk' },
          { step: 4, action: 'Check for loose connections', component: 'Bus Connection', safetyNote: 'Arc hazard' },
          { step: 5, action: 'Review recent switching operations', component: 'Switchyard', safetyNote: 'Switching impact' },
          { step: 6, action: 'Contact grid control center', component: 'SCADA', safetyNote: 'Coordination needed' }
        ]
      },
      {
        faultId: 'BATTERY_VOLTAGE_ABNORMAL_001',
        faultTitle: 'Battery Float Voltage Abnormal',
        severity: 'Medium',
        immediateActions: [
          'Adjust charger voltage if needed',
          'Clean battery terminals',
          'Test battery load capability',
          'Schedule battery service'
        ],
        checklist: [
          { step: 1, action: 'Check charger output voltage setting', component: 'Charger', safetyNote: 'Overvoltage risk' },
          { step: 2, action: 'Measure individual cell voltages', component: 'Battery Cells', safetyNote: 'Low voltage hazard' },
          { step: 3, action: 'Check charger current output', component: 'Charger', safetyNote: 'Thermal risk' },
          { step: 4, action: 'Inspect battery terminal connections', component: 'Battery Terminals', safetyNote: 'Corrosion hazard' },
          { step: 5, action: 'Check specific gravity of cells', component: 'Battery', safetyNote: 'Health indicator' },
          { step: 6, action: 'Review battery maintenance log', component: 'Documentation', safetyNote: 'Historical analysis' }
        ]
      }
    ]);;
    console.log(`✓ Seeded ${faultChecklists.length} fault checklists\n`);

    // ============ SEED DECISION TREE ============
    const decisionTree = await FaultDecisionTree.insertMany([
      {
        questionId: 'Q1',
        questionText: 'Which protection element has operated?',
        options: [
          { label: 'Buchholz Relay', nextQuestionId: 'Q2_BUCHHOLZ' },
          { label: 'Differential Protection (87T)', nextQuestionId: 'Q2_DIFF' },
          { label: 'SF6 Breaker Alarm/Trip', nextQuestionId: 'Q2_SF6' },
          { label: 'Overvoltage Relay', nextQuestionId: 'Q2_OVERVOLTAGE' },
          { label: 'Battery Voltage Abnormal', nextQuestionId: 'Q2_BATTERY' }
        ]
      },
      {
        questionId: 'Q2_BUCHHOLZ',
        questionText: 'What type of Buchholz alarm/trip occurred?',
        options: [
          { label: 'Trip (sudden oil surge)', nextQuestionId: 'Q3_BUCHHOLZ_TRIP' },
          { label: 'Alarm (gradual oil level drop)', nextQuestionId: 'Q3_BUCHHOLZ_ALARM' }
        ]
      },
      {
        questionId: 'Q2_DIFF',
        questionText: 'What was the differential current value when it tripped?',
        options: [
          { label: 'Very high (> 5x pickup)', nextQuestionId: 'Q3_DIFF_HIGH' },
          { label: 'Moderate (2-5x pickup)', nextQuestionId: 'Q3_DIFF_MOD' }
        ]
      },
      {
        questionId: 'Q2_SF6',
        questionText: 'What type of SF6 breaker alarm occurred?',
        options: [
          { label: 'Low SF6 pressure alarm', nextQuestionId: 'Q3_SF6_PRESSURE' },
          { label: 'Breaker failed to close/open', nextQuestionId: 'Q3_SF6_OPERATION' }
        ]
      },
      {
        questionId: 'Q2_OVERVOLTAGE',
        questionText: 'On which voltage level was overvoltage detected?',
        options: [
          { label: '220 kV bus', nextQuestionId: 'Q3_OVERVOLTAGE_CHECK' },
          { label: '132 kV bus', nextQuestionId: 'Q3_OVERVOLTAGE_CHECK' }
        ]
      },
      {
        questionId: 'Q2_BATTERY',
        questionText: 'What is the current battery float voltage?',
        options: [
          { label: 'Too high (> 126 V)', nextQuestionId: 'Q3_BATTERY_HIGH' },
          { label: 'Too low (< 120 V)', nextQuestionId: 'Q3_BATTERY_LOW' }
        ]
      },
      {
        questionId: 'Q3_BUCHHOLZ_TRIP',
        questionText: 'Is there evidence of external pressure surge (e.g., pump malfunction)?',
        options: [
          { label: 'Yes, pump appears faulty', resolvedFaultId: 'TF_OVERHEAT_001' },
          { label: 'No, looks like internal fault', resolvedFaultId: 'TF_OVERHEAT_001' }
        ]
      },
      {
        questionId: 'Q3_BUCHHOLZ_ALARM',
        questionText: 'Is the transformer still operating normally (temperatures, currents)?',
        options: [
          { label: 'Yes, all parameters normal', resolvedFaultId: 'TF_OVERHEAT_001' },
          { label: 'No, abnormal temperatures/currents', resolvedFaultId: 'TF_OVERHEAT_001' }
        ]
      },
      {
        questionId: 'Q3_DIFF_HIGH',
        questionText: 'Are there visible signs of damage (scorching, burning smell)?',
        options: [
          { label: 'Yes, severe damage detected', resolvedFaultId: 'TF_OVERHEAT_001' },
          { label: 'No visible damage', resolvedFaultId: 'TF_OVERHEAT_001' }
        ]
      },
      {
        questionId: 'Q3_DIFF_MOD',
        questionText: 'Are CT ratios and connections verified as correct?',
        options: [
          { label: 'Yes, all verified correct', resolvedFaultId: 'TF_OVERHEAT_001' },
          { label: 'No, discrepancies found', resolvedFaultId: 'TF_OVERHEAT_001' }
        ]
      },
      {
        questionId: 'Q3_SF6_PRESSURE',
        questionText: 'What is the SF6 pressure reading (corrected for temperature)?',
        options: [
          { label: 'Below 80% of nominal', resolvedFaultId: 'BREAKER_SF6_LOW_001' },
          { label: 'Between 80-90%', resolvedFaultId: 'BREAKER_SF6_LOW_001' },
          { label: 'Above 90%', resolvedFaultId: 'BREAKER_SF6_LOW_001' }
        ]
      },
      {
        questionId: 'Q3_SF6_OPERATION',
        questionText: 'Did the breaker eventually operate after multiple attempts?',
        options: [
          { label: 'Yes, operated after retries', resolvedFaultId: 'BREAKER_SF6_LOW_001' },
          { label: 'No, completely failed', resolvedFaultId: 'BREAKER_SF6_LOW_001' }
        ]
      },
      {
        questionId: 'Q3_OVERVOLTAGE_CHECK',
        questionText: 'What is the system frequency?',
        options: [
          { label: 'Within normal range (49.5-50.5 Hz)', resolvedFaultId: 'BUS_VOLTAGE_OOR_001' },
          { label: 'Low frequency (< 49.5 Hz)', resolvedFaultId: 'BUS_VOLTAGE_OOR_001' }
        ]
      },
      {
        questionId: 'Q3_BATTERY_HIGH',
        questionText: 'Is the charger output voltage adjustable and set correctly?',
        options: [
          { label: 'Yes, adjust immediately', resolvedFaultId: 'BATTERY_VOLTAGE_ABNORMAL_001' },
          { label: 'No, charger needs repair', resolvedFaultId: 'BATTERY_VOLTAGE_ABNORMAL_001' }
        ]
      },
      {
        questionId: 'Q3_BATTERY_LOW',
        questionText: 'Are there active DC loads drawing current?',
        options: [
          { label: 'Yes, significant load detected', resolvedFaultId: 'BATTERY_VOLTAGE_ABNORMAL_001' },
          { label: 'No, load appears minimal', resolvedFaultId: 'BATTERY_VOLTAGE_ABNORMAL_001' }
        ]
      }
    ]);
    console.log(`✓ Seeded ${decisionTree.length} decision tree nodes\n`);

    // ============ SEED SHIFT LOGS ============
    const operators = ['user1', 'user2', 'user3'];
    const shiftTypes = ['Morning', 'Afternoon', 'Night'];
    const feeders = ['Banda Town', 'Atarra', 'Baberu', 'Pailani', 'Augasi', 'Karvi/Rajapur'];
    const oilLevels = ['Normal', 'Low', 'High'];
    const coolingModes = ['Auto', 'Manual-On', 'Off'];
    const feederStatus = ['Energised', 'On-Maintenance', 'Tripped'];

    const shiftLogs = [];
    const baseDate = new Date('2026-04-13'); // Start from 7 days ago

    for (let day = 0; day < 7; day++) {
      for (let shiftIdx = 0; shiftIdx < 3; shiftIdx++) {
        const shiftDate = new Date(baseDate);
        shiftDate.setDate(shiftDate.getDate() + day);

        // Realistic values with some variations
        const baseTemp = 55 + Math.random() * 15; // 55-70°C
        const busVoltage220 = 220 + (Math.random() - 0.5) * 10; // ±5
        const busVoltage132 = 132 + (Math.random() - 0.5) * 6; // ±3
        const frequency = 50 + (Math.random() - 0.5) * 0.8; // 49.6-50.4 Hz

        const shiftLog = {
          operator: operators[Math.floor(Math.random() * operators.length)],
          shiftType: shiftTypes[shiftIdx],
          date: shiftDate,

          // Bus Readings
          busReadings: {
            bus220kV: busVoltage220,
            bus132kV: busVoltage132,
            frequency: frequency
          },

          // Transformers
          transformers: [
            {
              name: '200 MVA T/F-1 (BHEL)',
              OTI: baseTemp,
              WTI: baseTemp - 5 + Math.random() * 8,
              oilLevel: oilLevels[Math.floor(Math.random() * oilLevels.length)],
              OLTCPosition: Math.floor(Math.random() * 33) - 16,
              OLTCOperationCount: Math.floor(Math.random() * 5),
              coolingFanStatus: coolingModes[Math.floor(Math.random() * coolingModes.length)],
              remarks: 'Operating normally'
            },
            {
              name: '200 MVA T/F-2 (BHEL)',
              OTI: baseTemp + 2,
              WTI: baseTemp - 3 + Math.random() * 8,
              oilLevel: oilLevels[Math.floor(Math.random() * oilLevels.length)],
              OLTCPosition: Math.floor(Math.random() * 33) - 16,
              OLTCOperationCount: Math.floor(Math.random() * 3),
              coolingFanStatus: coolingModes[Math.floor(Math.random() * coolingModes.length)],
              remarks: 'Normal operation'
            },
            {
              name: '40 MVA T/F',
              OTI: baseTemp - 3,
              WTI: baseTemp - 8 + Math.random() * 8,
              oilLevel: oilLevels[Math.floor(Math.random() * oilLevels.length)],
              OLTCPosition: Math.floor(Math.random() * 33) - 16,
              OLTCOperationCount: Math.floor(Math.random() * 2),
              coolingFanStatus: coolingModes[Math.floor(Math.random() * coolingModes.length)],
              remarks: 'Steady state'
            }
          ],

          // SF6 Breakers
          breakers: [
            {
              name: '220 kV T/F Bay - Feeder 1',
              SF6Pressure: 5.5 + Math.random() * 0.5,
              ambientTemp: 25 + Math.random() * 10,
              SF6CorrectedStatus: 'Normal'
            },
            {
              name: '220 kV T/F Bay - Feeder 2',
              SF6Pressure: 5.4 + Math.random() * 0.6,
              ambientTemp: 26 + Math.random() * 8,
              SF6CorrectedStatus: 'Normal'
            },
            {
              name: '132 kV Incoming',
              SF6Pressure: 5.3 + Math.random() * 0.7,
              ambientTemp: 24 + Math.random() * 12,
              SF6CorrectedStatus: 'Normal'
            }
          ],

          // Feeders
          feeders: feeders.map((feederName) => ({
            name: feederName,
            MW: Math.random() * 80 + 10,
            MVAR: Math.random() * 30 + 5,
            status: feederStatus[Math.floor(Math.random() * feederStatus.length)]
          })),

          // Battery Bank
          battery: {
            floatVoltage: 122 + Math.random() * 2.5,
            floatCurrent: Math.random() * 4 + 1,
            remarks: 'Battery bank performing well'
          },

          // Anomalies
          anomalies: [],
          generalRemarks: 'Shift log recorded successfully'
        };

        // Add some realistic anomalies to certain logs
        if (day === 2 && shiftIdx === 1 && shiftLog.transformers[0].OTI > 85) {
          shiftLog.anomalies.push(
            'Transformer OTI Alarm: 200 MVA T/F-1 (BHEL) OTI exceeds 85°C threshold'
          );
        }

        shiftLogs.push(shiftLog);
      }
    }

    const inserted = await ShiftLog.insertMany(shiftLogs);
    console.log(`✓ Seeded ${inserted.length} shift log entries across 7 days\n`);

    console.log('📊 DATA SUMMARY:');
    console.log(`  ✓ Equipment: ${equipment.length} records`);
    console.log(`  ✓ Fault Checklists: ${faultChecklists.length} fault types`);
    console.log(`  ✓ Decision Tree: ${decisionTree.length} nodes`);
    console.log(`  ✓ Shift Logs: ${inserted.length} entries`);
    console.log(`  ✓ Operators: ${operators.length} (${operators.join(', ')})`);
    console.log(`  ✓ Date Range: ${baseDate.toLocaleDateString()} - ${new Date(baseDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
    console.log('\n✅ Complete data seeding successful!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
};

seedCompleteData();
