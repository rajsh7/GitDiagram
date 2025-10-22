import express from "express";
import { getDiagram, saveDiagram, loadSavedDiagram } from "../controllers/diagramController";

const router = express.Router();

router.get("/:repo", getDiagram);
router.post("/", saveDiagram);
router.get("/saved/:repo", loadSavedDiagram);

export default router;
