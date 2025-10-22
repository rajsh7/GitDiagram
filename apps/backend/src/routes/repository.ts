import { Router } from "express";
import { fetchRepositoryData } from "../services/githubService";

const router = Router();

// GET /api/repository/:owner/:repo
router.get("/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;

  try {
    const data = await fetchRepositoryData(owner, repo);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
