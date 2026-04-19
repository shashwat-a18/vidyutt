import mongoose from 'mongoose';

const faultDecisionTreeSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
    },
    questionText: String,
    options: [
      {
        optionId: String,
        label: String,
        nextQuestionId: String,
        resolvedFaultId: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('FaultDecisionTree', faultDecisionTreeSchema);
