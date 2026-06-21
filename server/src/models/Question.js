import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // 'A' | 'B' | 'C' | 'D'
    label: { type: String, required: true },
    // metricKey -> 0..100 contribution
    weights: { type: Map, of: Number, default: {} },
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    ageGroup: { type: String, required: true, index: true },
    order: { type: Number, required: true },
    category: { type: String, required: true }, // emotional | cognitive | behavioral | stress
    metric: { type: String, required: true }, // primary metric key this item scores
    text: { type: String, required: true },
    options: { type: [OptionSchema], required: true },
  },
  { timestamps: true }
);

QuestionSchema.index({ ageGroup: 1, order: 1 }, { unique: true });

export const Question = mongoose.model('Question', QuestionSchema);
