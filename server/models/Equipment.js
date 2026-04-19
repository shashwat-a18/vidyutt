import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['Transformer', 'CircuitBreaker', 'Battery', 'Feeder', 'Busbar'],
      required: true,
    },
    thresholds: mongoose.Schema.Types.Mixed,
    isActive: {
      type: Boolean,
      default: true,
    },
    manufacturer: String,
    rating: String,
    voltageRatio: String,
  },
  { timestamps: true }
);

export default mongoose.model('Equipment', equipmentSchema);
