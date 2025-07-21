import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Script from "../models/Script";
import { Types } from "mongoose";
import { AUTH_CONFIG } from "../config/auth";
import registerScriptHandlers from "./ScriptHandlers";
import { SocketUser } from "@chatroom/shared";
import { RegisterRoomHandler as registerRoomHandler } from "./RoomHandler";

let io: SocketIOServer;


// Middleware to authenticate socket connections
const authenticateSocket = async (socket: Socket, next: Function) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, AUTH_CONFIG.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select("-passwordHash");
    
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach user info to socket
    socket.data.user = {
      userId: user._id,
      username: user.username,
      email: user.email
    } as SocketUser;

    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
};

export function InitializeSocketServer(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // Allow all origins for development; restrict in production
      methods: ["GET", "POST"],
    },
  });

  // Add authentication middleware
  io.use(authenticateSocket);

  // Set up periodic cleanup of stale connections

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as SocketUser;
    console.log(`New authenticated client: ${user.username} (${user.userId})`);

    registerRoomHandler(socket, io);
    registerScriptHandlers(socket, io);
  });

  return io;
}


