import { Request, Response } from "express";
import { Diagram } from "../models/Diagram";

export const getDiagram = async (req: Request, res: Response) => {
  const { repo } = req.params;
  const diagram = await Diagram.findOne({ repo });
  if (!diagram) return res.status(404).json({ message: "Diagram not found" });
  res.json({ graph: diagram.graph });
};

export const saveDiagram = async (req: Request, res: Response) => {
  const { repo, graph } = req.body;
  const updated = await Diagram.findOneAndUpdate(
    { repo },
    { graph },
    { upsert: true, new: true }
  );
  res.json({ success: true, data: updated });
};

export const loadSavedDiagram = async (req: Request, res: Response) => {
  const { repo } = req.params;
  const diagram = await Diagram.findOne({ repo });
  if (!diagram) return res.status(404).json({ message: "No saved diagram" });
  res.json({ data: diagram });
};
