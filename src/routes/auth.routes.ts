/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

import { Router } from "express";
import { login, register } from "../controllers/auth.controller";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *               batch:
 *                 type: string
 *                 example: "2026"
 *               inCampus:
 *                 type: boolean
 *                 example: false
 *               isGated:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Missing email or password
 *       409:
 *         description: Email already registered
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid email or password
 *       404:
 *         description: User not found
 */
router.post("/login", login);

export default router;
