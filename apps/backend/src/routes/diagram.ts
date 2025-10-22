import { Router } from "express";
import { fetchRepositoryData } from "../services/githubService";
import { generateRepoGraph } from "../services/diagramService";
import { Diagram } from "../models/Diagram"; // ✅ FIX: use named import (matches export)

const router = Router();

// 🧩 1️⃣ Generate new diagram from GitHub
router.get("/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;

  try {
    const repoData = await fetchRepositoryData(owner, repo);
    const graph = generateRepoGraph(repoData.structure);

    res.status(200).json({
      success: true,
      metadata: repoData.metadata,
      graph,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 💾 2️⃣ Save diagram to MongoDB
router.post("/", async (req, res) => {
  const { repo, graph } = req.body;

  if (!repo || !graph)
    return res.status(400).json({ success: false, error: "Missing repo or graph data" });

  try {
    const existing = await Diagram.findOneAndUpdate(
      { repo },
      { graph, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: existing });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📂 3️⃣ Load saved diagram from MongoDB
router.get("/saved/:repo", async (req, res) => {
  const { repo } = req.params;

  try {
    const savedDiagram = await Diagram.findOne({ repo });

    if (!savedDiagram)
      return res.status(404).json({ success: false, error: "Diagram not found" });

    res.status(200).json({ success: true, data: savedDiagram });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
