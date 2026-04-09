import { Request, Response } from "express";
import {
  getShuttleById,
  updateRemainingSeats,
} from "../repository/shuttle.repo";
import {
  insertBooking,
  selectBookingsByUser,
  selectAllBookings,
  selectBookingsByShuttle,
  selectBookingById,
  markBoarded,
  selectBoardingStatusByShuttle,
} from "../repository/booking.repo";


export const createBooking = async (req: Request, res: Response) => {
  try {
    const shuttleId = Number(req.body.shuttleId); // we gave the shuttleId in the body of the request
    const userId = (req as any).user.userId;

    if (isNaN(shuttleId)) {
      return res.status(400).json({ error: "shuttleId is required and must be a number" });
    }


    //
     // ✅ 1. Get shuttle
    const shuttle = await getShuttleById(shuttleId);

    if (!shuttle) {
      return res.status(404).json({ error: "Shuttle not found" });
    }

    // ✅ 2. Check seats
    if (shuttle.remainingSeats <= 0) {
      return res.status(400).json({ error: "No seats available" });
    }

    // ✅ 3. Reduce seats
    await updateRemainingSeats(
      shuttleId,
      shuttle.remainingSeats - 1
    );

    //
    

    const booking = await insertBooking({
      shuttleId,
      userId,
      boarded: false,
      timseries: new Date(),
      status: "PENDING",
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create booking" });
  }
};


export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const bookings = await selectBookingsByUser(userId);
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch bookings" });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await selectAllBookings();
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch all bookings" });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid booking id" });
  }

  try {
    const bookings = await selectBookingById(id);
    if (bookings.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(bookings[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch booking" });
  }
};

export const getBookingsByShuttle = async (req: Request, res: Response) => {
  const shuttleId = Number(req.params.shuttleId);

  if (isNaN(shuttleId)) {
    return res.status(400).json({ error: "Invalid shuttle id" });
  }

  try {
    const bookings = await selectBookingsByShuttle(shuttleId);
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch bookings" });
  }
};

export const getBoardingStatusByShuttle = async (req: Request, res: Response) => {
  const shuttleId = Number(req.params.shuttleId);

  if (isNaN(shuttleId)) {
    return res.status(400).json({ error: "Invalid shuttle id" });
  }

  try {
    const status = await selectBoardingStatusByShuttle(shuttleId);
    res.json(status);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch boarding status" });
  }
};

export const boardStudent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid booking id" });
  }

  try {
    const booking = await markBoarded(id);
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update booking" });
  }
};
