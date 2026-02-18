import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skill: {
      type: String,
      enum: ["reading", "listening", "writing", "speaking", "full"],
      required: true,
    },
    bandScore: {
      type: Number,
      min: 0,
      max: 9,
    },
    // Full mock individual scores
    fullScores: {
      reading:   { type: Number, min: 0, max: 9 },
      listening: { type: Number, min: 0, max: 9 },
      writing:   { type: Number, min: 0, max: 9 },
      speaking:  { type: Number, min: 0, max: 9 },
    },
    mistakes: { type: String },
    testDate:  { type: Date, required: true },
    mockName:  { type: String },
    mockLink:  { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);