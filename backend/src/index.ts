import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

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


// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  
  // Send a welcome message to the connected client
  socket.emit('chat message', 'Welcome to the chat demo!');
  
  // Broadcast to all clients except the sender
  socket.broadcast.emit('chat message', `User ${socket.id.substr(0, 5)} joined the chat`);
  
  // Handle chat messages
  socket.on('chat message', (msg) => {
    console.log(`message from ${socket.id}: ${msg}`);
    io.emit('chat message', `${socket.id.substr(0, 5)}: ${msg}`);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    io.emit('chat message', `User ${socket.id.substr(0, 5)} left the chat`);
  });

  socket.on('webrtc_offer', (offer) => {
    console.log('Received webrtc_offer:', offer);
    socket.broadcast.emit('webrtc_offer', offer);
  });

  socket.on('webrtc_answer', (answer) => {
    console.log('Received webrtc_answer:', answer);
    socket.broadcast.emit('webrtc_answer', answer);
  });

  socket.on('webrtc_ice_candidate', (candidate) => {
    console.log('Received webrtc_ice_candidate:', candidate);
    socket.broadcast.emit('webrtc_ice_candidate', candidate);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.IO demo available at http://localhost:${PORT}/demo`);
});
