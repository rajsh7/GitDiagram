import mongoose from "mongoose";

const DiagramSchema = new mongoose.Schema(
  {
    repo: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ensures diagrams are tied to a specific user
    },
    graph: {
      nodes: { type: Array, default: [] },
      edges: { type: Array, default: [] },
    },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

// ✅ Optional: unique index to prevent duplicate diagrams for the same user/repo
DiagramSchema.index({ repo: 1, userId: 1 }, { unique: true });

export const Diagram = mongoose.model("Diagram", DiagramSchema);
