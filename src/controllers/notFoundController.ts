import { Request, Response } from "express";

export const notFound = async (req: Request, res: Response) => {
  res.status(404).send();
};
