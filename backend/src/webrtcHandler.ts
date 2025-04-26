import { Server, Socket } from 'socket.io';

export function initializeWebRTCHandler(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`Socket ${socket.id} connected, setting up WebRTC listeners`);

    socket.on('webrtc_offer', (offer: any) => {
      console.log(`Received webrtc_offer from ${socket.id}`);
      // Broadcast offer to others in the main namespace
      socket.broadcast.emit('webrtc_offer', { offer, senderId: socket.id });
    });

    socket.on('webrtc_answer', (answer: any) => {
      console.log(`Received webrtc_answer from ${socket.id}`);
      // Broadcast answer to others in the main namespace
      socket.broadcast.emit('webrtc_answer', { answer, senderId: socket.id });
    });

    socket.on('webrtc_ice_candidate', (candidate: any) => {
      console.log(`Received webrtc_ice_candidate from ${socket.id}`);
      // Broadcast candidate to others in the main namespace
      socket.broadcast.emit('webrtc_ice_candidate', { candidate, senderId: socket.id });
    });

    // Note: Disconnect logic specific to WebRTC (like cleaning up calls)
    // might be needed here or handled client-side based on chat disconnects.
    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected, removing WebRTC listeners implicitly.`);
        // Optionally broadcast a message if peers need to know immediately
        // socket.broadcast.emit('webrtc_user_disconnected', socket.id);
    });
  });
  console.log('WebRTC handler initialized for main namespace');
}