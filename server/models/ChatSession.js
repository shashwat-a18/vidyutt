import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema(
  {
    operator: String,
    startTime: {
      type: Date,
      default: Date.now,
    },
    answers: [
      {
        questionId: String,
        selectedOptionId: String,
        selectedLabel: String,
      },
    ],
    resolvedFaultId: String,
    checklistProgress: [
      {
        step: Number,
        completed: Boolean,
        completedAt: Date,
      },
    ],
    closed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ChatSession', chatSessionSchema);
