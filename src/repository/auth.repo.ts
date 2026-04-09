import { eq } from "drizzle-orm";
import { db } from "../db";
import { userAuth, userDetails } from "../db/schema";

export const findUserByEmail = async (email: string) => {
  return db
    .select()
    .from(userAuth)
    .leftJoin(userDetails, eq(userAuth.authId, userDetails.authId))
    .where(eq(userAuth.email, email));
};

export const createUserAuth = async (data: any) => {
  return db.insert(userAuth).values(data).returning();
};

export const createUserDetails = async (data: any) => {
  return db.insert(userDetails).values(data).returning();   // "returinig()"=it tells the database: “After inserting, give me back the inserted row data”
};

export const updateLastLogin = async (authId: string) => {
  return db
    .update(userAuth)
    .set({ lastLogin: new Date() })
    .where(eq(userAuth.authId, authId));
};