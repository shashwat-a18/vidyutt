import mongoose from 'mongoose';
import FaultDecisionTree from '../models/FaultDecisionTree.js';
import dotenv from 'dotenv';

dotenv.config();

const seedFaultDecisionTree = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing decision tree
    await FaultDecisionTree.deleteMany({});
    console.log('✓ Cleared existing decision tree');

    const decisionTree = [
      {
        questionId: 'Q1',
        question: 'Which protection element has operated?',
        questionText: 'Which protection element has operated?',
        options: [
          {
            optionId: 'Q1_A1',
            label: 'Buchholz Relay',
            nextQuestionId: 'Q2_BUCHHOLZ',
            resolvedFaultId: null,
          },
          {
            optionId: 'Q1_A2',
            label: 'Differential Protection (87T)',
            nextQuestionId: 'Q2_DIFF',
            resolvedFaultId: null,
          },
          {
            optionId: 'Q1_A3',
            label: 'SF6 Breaker Alarm/Trip',
            nextQuestionId: 'Q2_SF6',
            resolvedFaultId: null,
          },
          {
            optionId: 'Q1_A4',
            label: 'Overvoltage Relay',
            nextQuestionId: 'Q2_OVERVOLTAGE',
            resolvedFaultId: null,
          },
          {
            optionId: 'Q1_A5',
            label: 'Battery Voltage Abnormal',
            nextQuestionId: 'Q2_BATTERY',
            resolvedFaultId: null,
          },
        ],
      },

      // Buchholz Relay Path
      {
        questionId: 'Q2_BUCHHOLZ',
        question: 'What type of Buchholz alarm/trip occurred?',
        questionText: 'What type of Buchholz alarm/trip occurred?',
        options: [
          {
            optionId: 'Q2_B_A1',
            label: 'Trip (sudden oil surge)',
            nextQuestionId: 'Q3_BUCHHOLZ_TRIP',
            resolvedFaultId: null,
          },
          {
            optionId: 'Q2_B_A2',
            label: 'Alarm (gradual oil level drop)',
            nextQuestionId: 'Q3_BUCHHOLZ_ALARM',
            resolvedFaultId: null,
          },
        ],
      },
      {
        questionId: 'Q3_BUCHHOLZ_TRIP',
        question: 'Is there evidence of external pressure surge (e.g., pump malfunction)?',
        questionText: 'Is there evidence of external pressure surge (e.g., pump malfunction)?',
        options: [
          {
            optionId: 'Q3_BT_A1',
            label: 'Yes, pump appears faulty',
            resolvedFaultId: 'TF_OVERHEAT_001',
          },
          {
            optionId: 'Q3_BT_A2',
            label: 'No, looks like internal fault',
            resolvedFaultId: 'TF_OVERHEAT_001',
          },
        ],
      },
      {
        questionId: 'Q3_BUCHHOLZ_ALARM',
        question: 'Is the transformer still operating normally (temperatures, currents)?',
        questionText: 'Is the transformer still operating normally (temperatures, currents)?',
        options: [
          {
            optionId: 'Q3_BA_A1',
            label: 'Yes, all parameters normal',
            resolvedFaultId: 'TF_OVERHEAT_001',
          },
          {
            optionId: 'Q3_BA_A2',
            label: 'No, abnormal temperatures/currents',
            resolvedFaultId: 'TF_OVERHEAT_001',
          },
        ],
      },

      // Differential Protection Path
      {
        questionId: 'Q2_DIFF',
        question: 'What was the differential current value when it tripped?',
        questionText: 'What was the differential current value when it tripped?',
        options: [
          {
            optionId: 'Q2_D_A1',
            label: 'Very high (> 5x pickup)',
            nextQuestionId: 'Q3_DIFF_HIGH',
            resolvedFaultId: null,
          },
          {
            optionId: 'Q2_D_A2',
            label: 'Moderate (2-5x pickup)',
            nextQuestionId: 'Q3_DIFF_MOD',
            resolvedFaultId: null,
          },
        ],
      },
      {
        questionId: 'Q3_DIFF_HIGH',
        question: 'Are there visible signs of damage (scorching, burning smell)?',
        questionText: 'Are there visible signs of damage (scorching, burning smell)?',
        options: [
          {
            optionId: 'Q3_DH_A1',
            label: 'Yes, severe damage detected',
            resolvedFaultId: 'TF_OVERHEAT_001',
          },
          {
            optionId: 'Q3_DH_A2',
            label: 'No visible damage',
            resolvedFaultId: 'TF_OVERHEAT_001',
          },
        ],
      },
      {
        questionId: 'Q3_DIFF_MOD',
        question: 'Are CT ratios and connections verified as correct?',
        questionText: 'Are CT ratios and connections verified as correct?',
        options: [
          {
            optionId: 'Q3_DM_A1',
            label: 'Yes, all verified correct',
            resolvedFaultId: 'TF_OVERHEAT_001',
          },
          {
            optionId: 'Q3_DM_A2',
            label: 'No, discrepancies found',
            resolvedFaultId: 'TF_OVERHEAT_001',
          },
        ],
      },

      // SF6 Breaker Path
      {
        questionId: 'Q2_SF6',
        question: 'What type of SF6 breaker alarm occurred?',
        questionText: 'What type of SF6 breaker alarm occurred?',
        options: [
          {
            optionId: 'Q2_S_A1',
            label: 'Low SF6 pressure alarm',
            nextQuestionId: 'Q3_SF6_PRESSURE',
            resolvedFaultId: null,
          },
          {
            optionId: 'Q2_S_A2',
            label: 'Breaker failed to close/open',
            nextQuestionId: 'Q3_SF6_OPERATION',
            resolvedFaultId: null,
          },
        ],
      },
      {
        questionId: 'Q3_SF6_PRESSURE',
        question: 'What is the SF6 pressure reading (corrected for temperature)?',
        questionText: 'What is the SF6 pressure reading (corrected for temperature)?',
        options: [
          {
            optionId: 'Q3_SP_A1',
            label: 'Below 80% of nominal',
            resolvedFaultId: 'BREAKER_SF6_LOW_001',
          },
          {
            optionId: 'Q3_SP_A2',
            label: 'Between 80-90%',
            resolvedFaultId: 'BREAKER_SF6_LOW_001',
          },
          {
            optionId: 'Q3_SP_A3',
            label: 'Above 90%',
            resolvedFaultId: 'BREAKER_SF6_LOW_001',
          },
        ],
      },
      {
        questionId: 'Q3_SF6_OPERATION',
        question: 'Did the breaker eventually operate after multiple attempts?',
        questionText: 'Did the breaker eventually operate after multiple attempts?',
        options: [
          {
            optionId: 'Q3_SO_A1',
            label: 'Yes, operated after retries',
            resolvedFaultId: 'BREAKER_SF6_LOW_001',
          },
          {
            optionId: 'Q3_SO_A2',
            label: 'No, completely failed',
            resolvedFaultId: 'BREAKER_SF6_LOW_001',
          },
        ],
      },

      // Overvoltage Relay Path
      {
        questionId: 'Q2_OVERVOLTAGE',
        question: 'On which voltage level was overvoltage detected?',
        questionText: 'On which voltage level was overvoltage detected?',
        options: [
          {
            optionId: 'Q2_O_A1',
            label: '220 kV bus',
            nextQuestionId: 'Q3_OVERVOLTAGE_CHECK',
            resolvedFaultId: null,
          },
          {
            optionId: 'Q2_O_A2',
            label: '132 kV bus',
            nextQuestionId: 'Q3_OVERVOLTAGE_CHECK',
            resolvedFaultId: null,
          },
        ],
      },
      {
        questionId: 'Q3_OVERVOLTAGE_CHECK',
        question: 'What is the system frequency?',
        questionText: 'What is the system frequency?',
        options: [
          {
            optionId: 'Q3_OC_A1',
            label: 'Within normal range (49.5-50.5 Hz)',
            resolvedFaultId: 'BUS_VOLTAGE_OOR_001',
          },
          {
            optionId: 'Q3_OC_A2',
            label: 'Low frequency (< 49.5 Hz)',
            resolvedFaultId: 'BUS_VOLTAGE_OOR_001',
          },
        ],
      },

      // Battery Path
      {
        questionId: 'Q2_BATTERY',
        question: 'What is the current battery float voltage?',
        questionText: 'What is the current battery float voltage?',
        options: [
          {
            optionId: 'Q2_BAT_A1',
            label: 'Too high (> 126 V)',
            nextQuestionId: 'Q3_BATTERY_HIGH',
            resolvedFaultId: null,
          },
          {
            optionId: 'Q2_BAT_A2',
            label: 'Too low (< 120 V)',
            nextQuestionId: 'Q3_BATTERY_LOW',
            resolvedFaultId: null,
          },
        ],
      },
      {
        questionId: 'Q3_BATTERY_HIGH',
        question: 'Is the charger output voltage adjustable and set correctly?',
        questionText: 'Is the charger output voltage adjustable and set correctly?',
        options: [
          {
            optionId: 'Q3_BH_A1',
            label: 'Yes, adjust immediately',
            resolvedFaultId: 'BATTERY_VOLTAGE_ABNORMAL_001',
          },
          {
            optionId: 'Q3_BH_A2',
            label: 'No, charger needs repair',
            resolvedFaultId: 'BATTERY_VOLTAGE_ABNORMAL_001',
          },
        ],
      },
      {
        questionId: 'Q3_BATTERY_LOW',
        question: 'Are there active DC loads drawing current?',
        questionText: 'Are there active DC loads drawing current?',
        options: [
          {
            optionId: 'Q3_BL_A1',
            label: 'Yes, significant load detected',
            resolvedFaultId: 'BATTERY_VOLTAGE_ABNORMAL_001',
          },
          {
            optionId: 'Q3_BL_A2',
            label: 'No, load appears minimal',
            resolvedFaultId: 'BATTERY_VOLTAGE_ABNORMAL_001',
          },
        ],
      },
    ];

    await FaultDecisionTree.insertMany(decisionTree);
    console.log(`✓ Seeded ${decisionTree.length} decision tree nodes`);

    console.log('');
    console.log('✅ Fault Decision Tree seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding fault decision tree:', error.message);
    process.exit(1);
  }
};

seedFaultDecisionTree();
