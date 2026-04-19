import mongoose from 'mongoose';

const faultChecklistSchema = new mongoose.Schema(
  {
    faultId: {
      type: String,
      required: true,
      unique: true,
    },
    faultTitle: String,
    severity: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
    },
    triggerPath: [String],
    immediateActions: [String],
    checklist: [
      {
        step: Number,
        action: String,
        component: String,
        safetyNote: String,
      },
    ],
    basedOnIncident: String,
  },
  { timestamps: true }
);

export default mongoose.model('FaultChecklist', faultChecklistSchema);
