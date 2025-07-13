import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { Types } from "mongoose";
import { validateEmail, validateUsername, validatePassword } from "./validation";
import { AUTH_CONFIG } from "../config/auth";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email?: string;
    createdAt: Date;
  };
}

export class AuthService {
  static generateToken(userId: string): string {
    return jwt.sign({ id: userId }, AUTH_CONFIG.JWT_SECRET, {
      expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { username, password, email } = credentials;

    // Validate input
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      throw new Error(usernameValidation.error!);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error!);
    }

    if (email && !validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username },
        ...(email ? [{ email }] : [])
      ]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new Error("Username already exists");
      }
      if (existingUser.email === email) {
        throw new Error("Email already exists");
      }
    }

    // Create new user
    const user = new User({
      username,
      email,
      passwordHash: password // Will be hashed by pre-save middleware
    });

    await user.save();

    const token = this.generateToken((user._id).toString());

    return {
      token,
      user: {
        id: (user._id ).toString(),
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { username, password } = credentials;

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username },
        { email: username }
      ]
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken((user._id).toString());

    return {
      token,
      user: {
        id: (user._id ).toString(),
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  static async validateToken(token: string): Promise<IUser | null> {
    try {
      const decoded = jwt.verify(token, AUTH_CONFIG.JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id).select("-passwordHash");
      return user;
    } catch (error) {
      return null;
    }
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).select("-passwordHash");
      return user;
    } catch (error) {
      return null;
    }
  }

  static async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error!);
    }

    user.passwordHash = newPassword; // Will be hashed by pre-save middleware
    await user.save();
  }
}
