import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token, authorization denied" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key";
    const decoded = jwt.verify(token, jwtSecret) as { id: string };

    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      res.status(401).json({ error: "Token is not valid" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Token is not valid" });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      next();
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key";
    const decoded = jwt.verify(token, jwtSecret) as { id: string };

    const user = await User.findById(decoded.id).select("-passwordHash");
    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Invalid token, but don't block the request
    next();
  }
};
