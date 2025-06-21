import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import scriptRouter from "./routers/ScriptRouter";
import authRouter from "./auth/authRouter";
import connectDB from "./config/db";
import { InitializeSocketServer } from "./socket/SocketServer";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Regular REST endpoints
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Express!");
});

app.use("/api/scripts", scriptRouter);
app.use("/api/auth", authRouter);

const startServer = async () => {
  try {
    await connectDB();
    InitializeSocketServer(server);
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on:  http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
