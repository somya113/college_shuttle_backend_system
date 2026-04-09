import { db } from "../db";
import { bookings } from "../db/schema";
import { eq } from "drizzle-orm";

export const insertBooking = async (data: any) => {
  return db.insert(bookings).values(data).returning();
};

export const selectBookingsByUser = async (userId: string) => {
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, userId));
};

export const selectAllBookings = async () => {
  return db.select().from(bookings);
};

export const selectBookingsByShuttle = async (shuttleId: number) => {
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.shuttleId, shuttleId));
};

export const selectBookingById = async (id: number) => {
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.bookingId, id));
};

export const markBoarded = async (id: number) => {
  return db
    .update(bookings)
    .set({ boarded: true })
    .where(eq(bookings.bookingId, id))
    .returning();
};

export const selectBoardingStatusByShuttle = async (shuttleId: number) => {
  const shuttleBookings = await selectBookingsByShuttle(shuttleId);
  const boarded = shuttleBookings.filter((booking) => booking.boarded).length;
  const total = shuttleBookings.length;
  return {
    shuttleId,
    total,
    boarded,
    notBoarded: total - boarded,
    bookings: shuttleBookings,
  };
};