import mongoose from 'mongoose';
import Equipment from '../models/Equipment.js';
import dotenv from 'dotenv';

dotenv.config();

const seedEquipment = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing equipment
    await Equipment.deleteMany({});

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
      {
        name: 'Banda Town',
        type: 'Feeder',
        isActive: true,
      },
      {
        name: 'Atarra',
        type: 'Feeder',
        isActive: true,
      },
      {
        name: 'Baberu',
        type: 'Feeder',
        isActive: true,
      },
      {
        name: 'Pailani',
        type: 'Feeder',
        isActive: true,
      },
      {
        name: 'Augasi',
        type: 'Feeder',
        isActive: true,
      },
      {
        name: 'Karvi/Rajapur',
        type: 'Feeder',
        isActive: true,
      },
    ];

    await Equipment.insertMany(equipment);
    console.log('Equipment seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding equipment:', error);
    process.exit(1);
  }
};

seedEquipment();
