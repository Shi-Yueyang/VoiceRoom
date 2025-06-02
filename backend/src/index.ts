import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import scriptRouter from "./routers/ScriptRouter";
import connectDB from "./config/db";
import { InitializeSocketServer } from "./socket/SocketServer";

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
