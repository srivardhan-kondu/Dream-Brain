import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    optionId: { type: String, required: true },
  },
  { _id: false }
);

// Stores the submitted responses plus the fully computed report so a saved
// result can be re-opened without recomputing.
const AssessmentSchema = new mongoose.Schema(
  {
    ageGroup: { type: String, required: true },
    nickname: { type: String, trim: true, maxlength: 60, default: '' },
    responses: { type: [ResponseSchema], required: true },
    result: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const Assessment = mongoose.model('Assessment', AssessmentSchema);
