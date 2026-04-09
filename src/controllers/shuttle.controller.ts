import { Request, Response } from "express";
import {
  insertShuttle,
  selectAllShuttles,
  selectAvailableShuttles,
  updateShuttleById,
  pseudoDeleteShuttleById,
  pseudoDeleteRouteById,
 
} from "../repository/shuttle.repo";

import { createShuttleSchema } from "../validators/shuttle.validator";

export const createShuttle = async (req: Request, res: Response) => {
  const result = createShuttleSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error);
  }

  try {
    const shuttleData = {
      routeId: result.data.routeId,
      bookingTime: new Date(result.data.bookingTime),
      shuttle_startTime: new Date(result.data.shuttle_startTime),
      seats: result.data.seats,
      remainingSeats: result.data.remainingSeats ?? result.data.seats,
      isActive: result.data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };

    const shuttle = await insertShuttle(shuttleData);

    res.status(201).json(shuttle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create shuttle" });
  }
};

export const getShuttles = async (req: Request, res: Response) => {
  try { // GET /shuttles → req.query.all is undefined, so all is false
// GET /shuttles?all=true → req.query.all is "true", so all is true
    const all = req.query.all === "true"; // if req has all==true then it will fetch all shuttles including the inactive and deleted ones, otherwise it will fetch only the active and non-deleted shuttles
    const shuttles = all
      ? await selectAllShuttles()
      : await selectAvailableShuttles();

    res.json(shuttles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch shuttles" });
  }
};


export const updateShuttle = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid shuttle id" });
  }

  try {
    const shuttle = await updateShuttleById(id, req.body);

    res.json(shuttle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update shuttle" });
  }
};

export const deleteShuttle = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid shuttle id" });
  }

  try {
    await pseudoDeleteShuttleById(id);

    res.json({ message: "Shuttle pseudo-deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete shuttle" });
  }
};

export const deleteRoute = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid route id" });
  }

  try {
    await pseudoDeleteRouteById(id);

    res.json({ message: "Route pseudo-deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete route" });
  }
};