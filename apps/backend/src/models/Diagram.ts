import mongoose from "mongoose";

const DiagramSchema = new mongoose.Schema(
  {
    repo: { type: String, required: true, unique: true },
    graph: {
      nodes: { type: Array, default: [] },
      edges: { type: Array, default: [] },
    },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

export const Diagram = mongoose.model("Diagram", DiagramSchema);
