import cron from "node-cron";
import { db } from "../db";
import { bookings, shuttles } from "../db/schema";
import { eq } from "drizzle-orm";

export const startBookingStatusCron = () => { 
  cron.schedule("*/15 * * * *", async () => {  //check every 15 min
    try {
      const now = new Date();   // give  current timestamp

      const pendingBookings = await db
        .select({
          bookingId: bookings.bookingId,
          shuttleStartTime: shuttles.shuttle_startTime,
        })
        .from(bookings)  // these 3 lines are selecting only the row which have staus=pending and also joining with shuttle table to get the shuttle start time  
        .leftJoin(shuttles, eq(bookings.shuttleId, shuttles.shuttleId))    // left join booking with shuttels,,, i,e if booking exist (of a student/shuttele) give its shuttle id
        .where(eq(bookings.status, "PENDING"));

      for (const booking of pendingBookings) {    // So pendingBookings becomes a list of pending booking rows,
        if (!booking.shuttleStartTime) {   // if that booking has no shuttleStartTime value, skip it
          continue;   
        }

        const newStatus = now < booking.shuttleStartTime ? "SUCCESS" : "FAILED";

        await db
          .update(bookings)
          .set({ status: newStatus })
          .where(eq(bookings.bookingId, booking.bookingId));
      }

      console.log(
        `Cron: processed ${pendingBookings.length} pending bookings`
      );
    } catch (error) {
      console.error("Booking status cron error:", error);
    }
  });
};