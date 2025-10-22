import { Request, Response } from "express";
import Note from "../models/Note";

// 🟢 Get all notes for a repo
export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ repo: req.params.repo });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// 🟢 Add or update note
export const addNote = async (req: Request, res: Response) => {
  const { repo, nodeId, content } = req.body;
  try {
    const note = await Note.findOneAndUpdate(
      { repo, nodeId },
      { content },
      { upsert: true, new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to save note" });
  }
};

// 🔴 Delete note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    await Note.findOneAndDelete({
      repo: req.params.repo,
      nodeId: req.params.nodeId,
    });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note" });
  }
};
