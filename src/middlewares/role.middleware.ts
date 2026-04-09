import { Request, Response, NextFunction } from "express";

export const allowRoles = (...roles: number[]) => {      // a function const allowRoles=()=>{}
  return (req: Request, res: Response, next: NextFunction) => {

    const user = (req as any).user;  // came from auth middleware

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });   // “User identity is missing or not verified”....Authenticated = Identity is verified ✔ “We know who you are”
    }

    if (!roles.includes(user.roleId)) {  //  allowed roles → [1] ,,user role → 3
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }

    next();
  };
};




// allowRoles(1)  means only admin allowed