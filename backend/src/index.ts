import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { initializeEditingHandler } from "./demos/editingNamespace"; // Editing logic
import { initializeChatHandler } from "./demos/chatHandler"; // Chat logic
import { initializeWebRTCHandler } from "./demos/webrtcHandler"; // WebRTC logic
import { initializeMongoDBHandler } from "./demos/mongodbHandler"; // MongoDB logic
import { initializeSocketMongo } from "./demos/socketMongoHandler"; // MongoDB + Socket.IO integration
import Script from "./models/Script";
import scriptRouter from "./routers/ScriptRouter";
import connectDB from "./config/db";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend domain
    methods: ["GET", "POST"],
  },
});

const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Regular REST endpoints
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Express!");
});

app.use("/api/scripts", scriptRouter);

const startServer = async () => {
  try {
    await connectDB();
    
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
