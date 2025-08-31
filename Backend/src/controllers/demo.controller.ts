import type { Request, Response } from "express";
import { demoData } from "../models/demo.model.js";

export const getDemo = (req: Request, res: Response): void => {
  res.json({ success: true, data: demoData });
};

export const createDemo = (req: Request, res: Response): void => {
  const { message } = req.body;
  const newItem = { id: demoData.length + 1, message };
  demoData.push(newItem);
  res.status(201).json({ success: true, data: newItem });
};
