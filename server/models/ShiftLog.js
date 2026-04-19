import mongoose from 'mongoose';

const shiftLogSchema = new mongoose.Schema(
  {
    operator: {
      type: String,
      required: true,
    },
    shiftType: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Night'],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    busReadings: {
      bus220kV: Number,
      bus132kV: Number,
      frequency: Number,
    },
    transformers: [
      {
        name: String,
        OTI: Number,
        WTI: Number,
        oilLevel: {
          type: String,
          enum: ['Normal', 'Low', 'High'],
        },
        OLTCPosition: Number,
        OLTCOperationCount: Number,
        coolingFanStatus: {
          type: String,
          enum: ['Auto', 'Manual-On', 'Off'],
        },
        remarks: String,
      },
    ],
    breakers: [
      {
        name: String,
        SF6Pressure: Number,
        ambientTemp: Number,
        SF6CorrectedStatus: {
          type: String,
          enum: ['Normal', 'Alarm', 'Lockout'],
        },
      },
    ],
    feeders: [
      {
        name: String,
        MW: Number,
        MVAR: Number,
        status: {
          type: String,
          enum: ['Energised', 'On-Maintenance', 'Tripped'],
        },
      },
    ],
    battery: {
      floatVoltage: Number,
      floatCurrent: Number,
      remarks: String,
    },
    anomalies: [String],
    generalRemarks: String,
  },
  { timestamps: true }
);

export default mongoose.model('ShiftLog', shiftLogSchema);
