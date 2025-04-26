import { Server, Socket } from 'socket.io';

// Define the User interface (can be shared in a types file later if needed)
interface EditingUser {
  id: string;
  name: string;
  color: string;
}

// State specific to the editing namespace
let documentContent = '';
const connectedEditingUsers: { [socketId: string]: EditingUser } = {};

export function initializeEditingHandler(io: Server): void {
  const editingNamespace = io.of('/editing');

  editingNamespace.on('connection', (socket: Socket) => {
    console.log('a user connected to /editing namespace:', socket.id);

    socket.emit('document-update', documentContent);
    socket.emit('users-update', Object.values(connectedEditingUsers));

    socket.on('join-editing-session', (user: { name: string; color: string }) => {
      console.log(`User ${user.name} (${socket.id}) joined editing session`);
      connectedEditingUsers[socket.id] = { id: socket.id, ...user };
      editingNamespace.emit('users-update', Object.values(connectedEditingUsers));
      // Send current document content again
      socket.emit('document-update', documentContent);
    });

    socket.on('document-change', (newContent: string) => {
      documentContent = newContent;
      // Broadcast the change to all other clients *in this namespace*
      socket.broadcast.emit('document-update', newContent);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected from /editing namespace:', socket.id);
      const disconnectedUser = connectedEditingUsers[socket.id];
      if (disconnectedUser) {
          delete connectedEditingUsers[socket.id];
          // Broadcast updated user list within the namespace
          editingNamespace.emit('users-update', Object.values(connectedEditingUsers));
          console.log(`User ${disconnectedUser.name} left the editing session`);
      }
    });
  });

  console.log('Editing namespace initialized');
}