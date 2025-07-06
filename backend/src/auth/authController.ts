import { Request, Response } from "express";
import { AuthService, LoginCredentials, RegisterCredentials } from "./authService";
import { AuthRequest } from "./middleware";
import { Types } from "mongoose";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, email }: RegisterCredentials = req.body;
      console.log("Register request received:", { username, email });
      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }
      console.log("register");
      const result = await AuthService.register({ username, password, email });
        
      res.status(201).json({
        message: "User registered successfully",
        ...result,
      });
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          res.status(409).json({ error: error.message });
        } else if (error.message.includes("Password must be")) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Registration failed" });
        }
      } else {
        res.status(500).json({ error: "Registration failed" });
      }
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password }: LoginCredentials = req.body;

      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }
      
      const result = await AuthService.login({ username, password });
      
      res.json({
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      console.error("Login error:", error);
      
      if (error instanceof Error && error.message === "Invalid credentials") {
        res.status(401).json({ error: "Invalid credentials" });
      } else {
        res.status(500).json({ error: "Login failed" });
      }
    }
  }

  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }
      
      const result = await AuthService.getUserById(userId.toString());
      if(!result){
        res.status(401).json({error:`User with id ${userId} not found`});
        return;
      }
      res.json({
        message:"Get profile successful",
        user: {
          id: result._id.toString(),
          username: result.username,
          email: result.email
        }
      })
      
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  }

  static async updatePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: "Current password and new password are required" });
        return;
      }

      await AuthService.updatePassword(
        (req.user._id).toString(),
        currentPassword,
        newPassword
      );

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Update password error:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("Current password is incorrect")) {
          res.status(400).json({ error: error.message });
        } else if (error.message.includes("Password must be")) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Failed to update password" });
        }
      } else {
        res.status(500).json({ error: "Failed to update password" });
      }
    }
  }

  static async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        res.status(400).json({ error: "Token is required" });
        return;
      }

      const user = await AuthService.validateToken(token);

      if (!user) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      res.json({
        valid: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Validate token error:", error);
      res.status(500).json({ error: "Token validation failed" });
    }
  }
}
