import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    repo: { type: String, required: true },
    nodeId: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Note", NoteSchema);
