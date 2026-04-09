import { db } from "../db";
import { shuttles, shuttleRoutes } from "../db/schema";
import { eq, and, lte, gte } from "drizzle-orm";

export const insertShuttle = async (data: any) => {
  return db.insert(shuttles).values(data).returning();
};

export const selectAllShuttles = async () => {
  return db.select().from(shuttles).where(eq(shuttles.isDeleted, false));
};

export const selectAvailableShuttles = async () => {
  const now = new Date();

  return db
    .select()
    .from(shuttles)
    .where(
      and(
        eq(shuttles.isDeleted, false),
        eq(shuttles.isActive, true),
        lte(shuttles.bookingTime, now),
        gte(shuttles.shuttle_startTime, now)
      )
    );
};



export const getShuttleById = async (shuttleId: number) => {
  const result = await db
    .select()
    .from(shuttles)
    .where(eq(shuttles.shuttleId, shuttleId));

  return result[0] || null;
};

export const updateRemainingSeats = async (
  shuttleId: number,
  seats: number
) => {
  return db
    .update(shuttles)
    .set({
      remainingSeats: seats,
      updatedAt: new Date(),
    })
    .where(eq(shuttles.shuttleId, shuttleId));
};









export const updateShuttleById = async (id: number, data: any) => {
  return db
    .update(shuttles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(shuttles.shuttleId, id))
    .returning();
};

export const pseudoDeleteShuttleById = async (id: number) => {
  return db
    .update(shuttles)
    .set({ isDeleted: true, isActive: false, updatedAt: new Date() })
    .where(eq(shuttles.shuttleId, id))
    .returning();
};

export const pseudoDeleteRouteById = async (id: number) => {
  return db
    .update(shuttleRoutes)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(eq(shuttleRoutes.routeId, id))
    .returning();
};