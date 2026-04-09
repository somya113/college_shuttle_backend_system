import { z } from "zod";

export const createShuttleSchema = z.object({
  routeId: z.number(),
  bookingTime: z.string(),
  shuttle_startTime: z.string(),
  seats: z.number(),
  remainingSeats: z.number().optional(),
  isActive: z.boolean().optional(),
});
