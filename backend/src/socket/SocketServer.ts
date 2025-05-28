import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import registerScriptHandlers from "./ScriptHandlers";

let io: SocketIOServer;

export function InitializeSocketServer(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // Allow all origins for development; restrict in production
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket: Socket) => {
    console.log("New client");
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("join_room", (room: string) => {
      socket.join(room);
      console.log(`Client joined room: ${room}`);
    });

    registerScriptHandlers(socket,io);
  });

  return io;
}
