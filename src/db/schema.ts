import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  boolean,
  uuid
} from "drizzle-orm/pg-core";
//
import { pgEnum } from "drizzle-orm/pg-core";
//

// USER AUTH

export const userAuth = pgTable("userAuth", {
  authId: uuid("authId").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  roleId: integer("roleId"),
  isActive: boolean("isActive"),
  isFirstLogin: boolean("isFirstLogin"),
  lastLogin: timestamp("lastLogin"),
  timeseries: timestamp("timeseries")
});



//USER DETAILS 

export const userDetails = pgTable("userDetails", {
  userId: uuid("userId").primaryKey(),
  name: varchar("name", { length: 255 }),
  authId: uuid("authId"),
  email: varchar("email", { length: 255 }),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  isGated: boolean("isGated"),
  inCampus: boolean("inCampus"),
  batch: varchar("batch", { length: 50 }),
  timeseries: timestamp("timeseries"),
  isDeleted: boolean("isDeleted"),

 
});



//SHUTTLES

export const shuttles = pgTable("shuttles", {
  shuttleId: serial("shuttleId").primaryKey(),

routeId: integer("route_id")                      //
    .references(() => shuttleRoutes.routeId), 

  bookingTime: timestamp("bookingTime"),
  shuttle_startTime: timestamp("shuttle_startTime"),   // shuttle start time i.e bookingclosing time
 seats: integer("seats").notNull(),
 remainingSeats:integer("remainingSeats").notNull(),

  isActive: boolean("isActive"),

  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
   isDeleted: boolean("isDeleted"),
});



//SHUTTLE ROUTES 

export const shuttleRoutes = pgTable("shuttleRoutes", {
  routeId: serial("routeId").primaryKey(),
 
  startLocation: varchar("startLocation", { length: 255 }),
  endLocation: varchar("endLocation", { length: 255 }),


  price: integer("price"),
  
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
   isDeleted: boolean("isDeleted"),
});



//USER ROLES 

export const userRoles = pgTable("userRoles", {
  roleId: serial("roleId").primaryKey(),
  roleName: varchar("roleName", { length: 100 }),
 
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
   isDeleted: boolean("isDeleted"),
});


export const statusEnum = pgEnum("status_enum", [
  "PENDING",
 
  "SUCCESS",
  "FAILED",
]);

//BOOKINGS 

export const bookings = pgTable("bookings", {        // row on hre is created when a student booked a shuttle
  bookingId: serial("id").primaryKey(),
  shuttleId: integer("shuttleId"),
  userId: uuid("userId"),
  boarded: boolean("boarded"),
  timseries: timestamp("timeseries"),

 status: statusEnum("status")
    .default("PENDING")
    .notNull(),

});



export const newEvents = pgTable("practiceEvents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
});

export const eventsRegistrations = pgTable("practiceEventsRegistrations", {
  id: serial("id").primaryKey(),
  eventId: integer("eventId").references(()=>newEvents.id).notNull(),
  studentNo: varchar("studentNo", { length: 20 }),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 100 }),
  registeredAt: timestamp("registeredAt").defaultNow(),
});




