import { Response } from "express";
import { Diagram } from "../models/Diagram";
import { AuthRequest } from "../middleware/authMiddleware";

/**
 * ✅ Get diagram for the logged-in user and repo
 */
export const getDiagram = async (req: AuthRequest, res: Response) => {
  try {
    const { repo } = req.params;
    const userId = req.user?.id; // comes from JWT

    const diagram = await Diagram.findOne({ repo, userId });
    if (!diagram)
      return res.status(404).json({ message: "Diagram not found for this user" });

    res.json({ graph: diagram.graph });
  } catch (error) {
    console.error("Error fetching diagram:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Save or update diagram for the logged-in user
 */
export const saveDiagram = async (req: AuthRequest, res: Response) => {
  try {
    const { repo, graph } = req.body;
    const userId = req.user?.id;

    const updated = await Diagram.findOneAndUpdate(
      { repo, userId },
      { graph },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error saving diagram:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Load the user's saved diagram (optional)
 */
export const loadSavedDiagram = async (req: AuthRequest, res: Response) => {
  try {
    const { repo } = req.params;
    const userId = req.user?.id;

    const diagram = await Diagram.findOne({ repo, userId });
    if (!diagram)
      return res.status(404).json({ message: "No saved diagram for this user" });

    res.json({ data: diagram });
  } catch (error) {
    console.error("Error loading saved diagram:", error);
    res.status(500).json({ message: "Server error" });
  }
};
