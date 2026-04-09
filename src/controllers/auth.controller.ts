import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import {
  findUserByEmail,
  updateLastLogin,
  createUserAuth,
  createUserDetails,
} from "../repository/auth.repo";
import { ROLE_STUDENT } from "../constants/roles";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phoneNumber, batch, isGated, inCampus } =
      req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    const existingUsers = await findUserByEmail(email);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const authId = randomUUID();
    const userId = randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    await createUserAuth({
      authId,
      email,
      password: hashedPassword,
      roleId: ROLE_STUDENT,
      isActive: true,
      isFirstLogin: true,
      timeseries: new Date(),
    });

    await createUserDetails({
      userId,
      authId,
      name: name || null,
      email,
      phoneNumber: phoneNumber || null,
      isGated: typeof isGated === "boolean" ? isGated : false,
      inCampus: typeof inCampus === "boolean" ? inCampus : false,
      batch: batch || null,
      timeseries: new Date(),
      isDeleted: false,
    });

    return res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    const users = await findUserByEmail(email);

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(
      password,
      user.userAuth!.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    await updateLastLogin(user.userAuth!.authId);   // user.userAuth!  Means: “I am 100% sure this value is NOT null or undefined”

    const token = jwt.sign(
      {
        userId: user.userDetails!.userId,
        roleId: user.userAuth!.roleId,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
};