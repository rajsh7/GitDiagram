import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getDiagram, saveDiagram, loadSavedDiagram } from "../controllers/diagramController";

const router = express.Router();

router.get("/:repo", getDiagram);
router.post("/", saveDiagram);
router.get("/saved/:repo", loadSavedDiagram);
router.get("/:repo", authMiddleware, getDiagram);
router.post("/:repo", authMiddleware, saveDiagram);

export default router;
