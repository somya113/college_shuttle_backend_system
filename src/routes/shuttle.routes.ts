/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin shuttle management
 */

import { Router } from "express";
import {
  createShuttle,
  getShuttles,
  updateShuttle,
  deleteShuttle,
  deleteRoute,
} from "../controllers/shuttle.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { ROLE_ADMIN } from "../constants/roles";

const router = Router();

/**
 * @swagger
 * /shuttles:
 *   get:
 *     summary: Get shuttles available for booking
 *     description: Returns shuttles where current time is between bookingTime and shuttle_startTime. Use query param `all=true` to return all shuttles.
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: all
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Set to true to return all shuttles instead of only currently open ones
 *     responses:
 *       200:
 *         description: List of shuttles
 *       401:
 *         description: Unauthorized
 */
router.get("/shuttles", authMiddleware, getShuttles);

/**
 * @swagger
 * /shuttles:
 *   post:
 *     summary: Create shuttle
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               
 *               routeId:
 *                 type: number
 *                 example: 1
 *               bookingTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-15T16:00:00"
 *               shuttle_startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-15T18:00:00"
 *               seats:
 *                 type: number
 *                 example: 20
 *               price:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Shuttle created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/shuttles",
  authMiddleware,
  allowRoles(ROLE_ADMIN),
  createShuttle
);


/**
 * @swagger
 * /shuttles/{id}:
 *   put:
 *     summary: Update shuttle
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Shuttle ID
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departureTime:
 *                 type: string
 *                 example: "2026-03-15T19:00:00"
 *               price:
 *                 type: number
 *                 example: 60
 *     responses:
 *       200:
 *         description: Shuttle updated
 *       404:
 *         description: Shuttle not found
 */
router.put(
  "/shuttles/:id",
  authMiddleware,
  allowRoles(ROLE_ADMIN),
  updateShuttle
);


/**
 * @swagger
 * /shuttles/{id}:
 *   delete:
 *     summary: Delete shuttle
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Shuttle ID
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Shuttle deleted
 *       404:
 *         description: Shuttle not found
 */
router.delete(
  "/shuttles/:id",
  authMiddleware,
  allowRoles(ROLE_ADMIN),
  deleteShuttle
);

/**
 * @swagger
 * /shuttleRoutes/{id}:
 *   delete:
 *     summary: Delete shuttle route
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Shuttle route ID
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Route deleted
 *       400:
 *         description: Invalid route id
 *       404:
 *         description: Route not found
 */
router.delete(
  "/shuttleRoutes/:id",
  authMiddleware,
  allowRoles(ROLE_ADMIN),
  deleteRoute
);

export default router;