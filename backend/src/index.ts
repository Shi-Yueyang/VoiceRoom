import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initializeEditingHandler } from './editingNamespace'; // Editing logic
import { initializeChatHandler } from './chatHandler';         // Chat logic
import { initializeWebRTCHandler } from './webrtcHandler';       // WebRTC logic

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend domain
    methods: ["GET", "POST"]
  }
});

const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Regular REST endpoints
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript Express!');
});


initializeChatHandler(io); 
initializeWebRTCHandler(io);  
initializeEditingHandler(io); 

// Start the server 
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.IO demo available at http://localhost:${PORT}/demo`);
});
