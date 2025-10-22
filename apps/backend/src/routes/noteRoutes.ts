import express from "express";
import {
  addNote,
  getNotes,
  deleteNote,
} from "../controllers/noteController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// 🟢 GET all notes for a repo (protected)
router.get("/:repo", authMiddleware, getNotes);

// 🟢 POST a new note (protected)
router.post("/", authMiddleware, addNote);

// 🔴 DELETE a note by repo + nodeId (protected)
router.delete("/:repo/:nodeId", authMiddleware, deleteNote);

export default router;