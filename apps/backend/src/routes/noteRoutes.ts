import express from "express";
import {
  addNote,
  getNotes,
  deleteNote,
} from "../controllers/noteController";

const router = express.Router();

// 🟢 GET all notes for a repo
router.get("/:repo", getNotes);

// 🟢 POST a new note
router.post("/", addNote);

// 🔴 DELETE a note by repo + nodeId
router.delete("/:repo/:nodeId", deleteNote);

export default router;
