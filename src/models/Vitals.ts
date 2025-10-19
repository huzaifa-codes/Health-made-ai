import mongoose from "mongoose";

const VitalsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  bp: String,
  sugar: String,
  weight: String,
  notes: String,
});

export default mongoose.models.Vitals || mongoose.model("Vitals", VitalsSchema);
