import { Server, Socket } from 'socket.io';

// Keep track of users in the main chat (optional, could be enhanced)
const chatUsers: { [socketId: string]: string } = {}; // Store socket ID and a simple identifier

export function initializeChatHandler(io: Server): void {
  io.on('connection', (socket: Socket) => {
    // Use a simple identifier for chat messages
    const userIdentifier = `User ${socket.id.substring(0, 5)}`;
    chatUsers[socket.id] = userIdentifier;
    console.log(`${userIdentifier} connected to main namespace for chat`);

    // Send a welcome message to the connected client
    socket.emit('chat message', 'Welcome to the chat!');

    // Broadcast join message to others
    socket.broadcast.emit('chat message', `${userIdentifier} joined the chat`);

    // Handle chat messages
    socket.on('chat message', (msg: string) => {
      console.log(`Chat message from ${userIdentifier}: ${msg}`);
      // Broadcast message with identifier
      io.emit('chat message', `${userIdentifier}: ${msg}`);
    });

    // Handle disconnection for chat
    socket.on('disconnect', () => {
      const disconnectedUserIdentifier = chatUsers[socket.id];
      if (disconnectedUserIdentifier) {
        console.log(`${disconnectedUserIdentifier} disconnected from main namespace (chat)`);
        // Broadcast leave message
        io.emit('chat message', `${disconnectedUserIdentifier} left the chat`);
        delete chatUsers[socket.id];
      }
    });
  });
  console.log('Chat handler initialized for main namespace');
}