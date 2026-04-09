/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Student booking APIs
 */

import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingsByShuttle,
  getBoardingStatusByShuttle,
  boardStudent,
} from "../controllers/booking.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { ROLE_STUDENT, ROLE_GUARD } from "../constants/roles";

const router = Router();

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Book a shuttle
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shuttleId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Booking created
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/bookings",
  authMiddleware,
  allowRoles(ROLE_STUDENT),
  createBooking
);


/**
 * @swagger
 * /bookings/my:
 *   get:
 *     summary: Get my bookings
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/bookings/my",
  authMiddleware,
  allowRoles(ROLE_STUDENT),
  getMyBookings
);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Guard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/bookings",
  authMiddleware,
  allowRoles(ROLE_GUARD),
  getAllBookings
);

/**
 * @swagger
 * /bookings/shuttle/{shuttleId}/status:
 *   get:
 *     summary: Get boarding status for a shuttle
 *     tags: [Guard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shuttleId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Boarding status summary
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/bookings/shuttle/:shuttleId/status",
  authMiddleware,
  allowRoles(ROLE_GUARD),
  getBoardingStatusByShuttle
);

/**
 * @swagger
 * tags:
 *   name: Guard
 *   description: Guard boarding APIs
 */


/**
 * @swagger
 * /bookings/shuttle/{shuttleId}:
 *   get:
 *     summary: Get shuttle bookings
 *     tags: [Guard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shuttleId
 *         required: true
 *         description: Shuttle ID
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of bookings
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/bookings/shuttle/:shuttleId",
  authMiddleware,
  allowRoles(ROLE_GUARD, ROLE_STUDENT),
  getBookingsByShuttle
);


/**
 * @swagger
 * /bookings/{id}/board:
 *   patch:
 *     summary: Mark student boarded
 *     tags: [Guard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Student marked as boarded
 *       404:
 *         description: Booking not found
 */
router.patch(
  "/bookings/:id/board",
  authMiddleware,
  allowRoles(ROLE_GUARD),
  boardStudent
);

export default router;