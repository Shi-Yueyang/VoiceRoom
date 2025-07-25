import { SocketUser } from "@chatroom/shared";
import { Types } from "mongoose";
import { Socket, Server } from "socket.io";
import Script from "../models/Script";

const roomUsers = new Map<string, Map<string, SocketUser>>();

function addUserToRoom(
  roomId: string,
  socketId: string,
  user: SocketUser
): SocketUser[] {
  if (!roomUsers.has(roomId)) {
    roomUsers.set(roomId, new Map());
  }

  const room = roomUsers.get(roomId)!;

  // Remove any existing entries for this user (in case of reconnection)
  for (const [existingSocketId, existingUser] of room.entries()) {
    if (existingUser.userId === user.userId) {
      room.delete(existingSocketId);
      console.log(
        `Removed duplicate user ${user.username} (${existingSocketId}) from room ${roomId}`
      );
    }
  }

  // Add the user with the new socket ID
  room.set(socketId, user);
  console.log(`Added user ${user.username} (${socketId}) to room ${roomId}`);

  return Array.from(room.values());
}

function removeUserFromRoom(roomId: string, socketId: string): SocketUser[] {
  if (roomUsers.has(roomId)) {
    roomUsers.get(roomId)!.delete(socketId);
    if (roomUsers.get(roomId)!.size === 0) {
      roomUsers.delete(roomId);
      return [];
    }
    return Array.from(roomUsers.get(roomId)!.values());
  }
  return [];
}

function getRoomUsers(roomId: string): SocketUser[] {
  if (roomUsers.has(roomId)) {
    const users = Array.from(roomUsers.get(roomId)!.values());
    // Deduplicate by userId to ensure no duplicates are returned
    const uniqueUsers = users.filter(
      (user, index, array) =>
        array.findIndex((u) => u.userId === user.userId) === index
    );
    return uniqueUsers;
  }
  return [];
}

function cleanupStaleConnections(io:Server): void {
  const connectedSocketIds = new Set(Array.from(io.sockets.sockets.keys()));
  
  for (const [roomId, socketMap] of roomUsers.entries()) {
    const socketsToRemove: string[] = [];
    
    for (const [socketId] of socketMap.entries()) {
      if (!connectedSocketIds.has(socketId)) {
        socketsToRemove.push(socketId);
      }
    }
    
    // Remove stale socket IDs
    for (const socketId of socketsToRemove) {
      socketMap.delete(socketId);
      console.log(`Cleaned up stale socket ${socketId} from room ${roomId}`);
    }
    
    // Remove empty rooms
    if (socketMap.size === 0) {
      roomUsers.delete(roomId);
      console.log(`Removed empty room ${roomId}`);
    }
  }
}


export const RegisterRoomHandler = (socket: Socket, io: Server): void => {
  const user = socket.data.user as SocketUser;

  socket.on("getActiveUsers", (room: string) => {
    const activeUsers = getRoomUsers(room);
    socket.emit("server:activeUsers", {
      scriptId: room,
      activeUsers,
      timestamp: Date.now(),
    });
  });

  socket.on("leave_room", (room: string) => {
    socket.leave(room);
    console.log(`Client ${user.username} left room: ${room}`);

    // Remove user from room tracking
    const activeUsers = removeUserFromRoom(room, socket.id);

    // Notify other clients in the room
    socket.broadcast.to(room).emit("server:userLeft", {
      scriptId: room,
      userId: user.userId,
      activeUsers,
      timestamp: Date.now(),
    });
  });

  socket.on("join_room", (room: string) => {
    socket.join(room);
    console.log(`Client ${user.username} joined room: ${room}`);

    // Add user to room tracking and remove any duplicates
    const activeUsers = addUserToRoom(room, socket.id, user);

    // Notify all clients in the room about the updated user list
    // We use broadcast to all (not just other clients) to ensure everyone has the same list
    io.to(room).emit("server:userJoined", {
      scriptId: room,
      user,
      activeUsers,
      timestamp: Date.now(),
    });

    // Send current active users to the joining client specifically
    socket.emit("server:activeUsers", {
      scriptId: room,
      activeUsers,
      timestamp: Date.now(),
    });
  });

  socket.on("disconnect", async () => {
    console.log(`Client disconnected: ${user.username} (${user.userId})`);

    // Unlock all blocks that were locked by this user
    try {
      const userObjectId = new Types.ObjectId(user.userId);
      const scripts = await Script.find({ "blocks.lockedBy": userObjectId });

      for (const script of scripts) {
        const scriptId = (script as any)._id.toString();
        await script.unlockAllBlocksByUser(userObjectId);

        // Notify other users in the script room about unlocked blocks
        script.blocks.forEach((block) => {
          if (block.lockedBy?.equals(userObjectId)) {
            socket.broadcast.to(scriptId).emit("server:blockUnlocked", {
              scriptId,
              blockId: block._id,
              timestamp: Date.now(),
            });
          }
        });
      }
    } catch (error) {
      console.error("Error unlocking blocks on disconnect:", error);
    }

    // Remove user from all rooms they were in
    Array.from(socket.rooms).forEach((roomId) => {
      if (roomId !== socket.id) {
        // Skip the default room (socket's own ID)
        const activeUsers = removeUserFromRoom(roomId, socket.id);
        socket.broadcast.to(roomId).emit("server:userLeft", {
          scriptId: roomId,
          userId: user.userId,
          activeUsers,
          timestamp: Date.now(),
        });
      }
    });
  });
};
