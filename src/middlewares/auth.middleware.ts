import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (    // a function(middleware function)   const func()=> {}
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const header = req.headers.authorization;  // here header is a variable where "Authorization: Bearer <token>"" is stored.
// Check if token exists and starts with "Bearer "
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  try {

    const decoded = jwt.verify(   // This line: .. Checks if token is valid  .. Decodes the token data ..Returns the payload inside token
      token,
      process.env.JWT_SECRET as string
    );

    (req as any).user = decoded;   // Attach user to request.. Now you can access user in controller: as "req.user"

    next(); // move req to controller

  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};





// jwt.verify(token, secret)