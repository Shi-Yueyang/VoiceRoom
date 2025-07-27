import {
  ScriptBlock,
  DescriptionBlockParam,
  DialogueBlockParam,
  HeadingBlockParam,
  SocketUser,
  ClientBlockAddedEvent,
  ClientBlockUpdateEvent,
  ClientBlockDeletedEvent,
  ClientBlockMovedEvent,
  ServerBlockAddedEvent,
  ServerBlockUpdatedEvent,
  ServerBlockDeletedEvent,
  ServerBlocksMovedEvent,
  ServerUserJoinedEvent,
  ServerUserLeftEvent,
  ServerActiveUsersEvent,
  ServerBlockLockedEvent,
  ServerBlockUnlockedEvent,
  ServerBlockLockErrorEvent,
} from "@chatroom/shared";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseScriptSocketProps {
  scriptId: string;
  onServerBlockAdded?: (event: ServerBlockAddedEvent) => void;
  onServerBlockUpdated?: (event: ServerBlockUpdatedEvent) => void;
  onServerBlockDeleted?: (event: ServerBlockDeletedEvent) => void;
  onServerBlockMoved?: (event: ServerBlocksMovedEvent) => void;
  onServerError?: (error: { message: string; error: string }) => void;
  onUserJoined?: (event: ServerUserJoinedEvent) => void;
  onUserLeft?: (event: ServerUserLeftEvent) => void;
  onActiveUsersUpdate?: (event: ServerActiveUsersEvent) => void;
  onServerBlockLocked?: (event: ServerBlockLockedEvent) => void;
  onServerBlockLUnlcked?: (event: ServerBlockUnlockedEvent) => void;
  onBlockLockError?: (event: ServerBlockLockErrorEvent) => void;
}

export const useScriptSocket = ({
  scriptId,
  onServerBlockAdded,
  onServerBlockUpdated,
  onServerBlockDeleted,
  onServerBlockMoved,
  onServerError,
  onUserJoined,
  onUserLeft,
  onActiveUsersUpdate,
  onServerBlockLocked,
  onServerBlockLUnlcked,
  onBlockLockError,
}: UseScriptSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState<SocketUser[]>([]);

  useEffect(() => {
    // Get auth token from localStorage
    const token = localStorage.getItem('token');
    
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL || "", {
      auth: {
        token: token
      }
    });
    const socket = socketRef.current;
    socket.emit("join_room", scriptId);

    onServerBlockAdded && socket.on("server:blockAdded", onServerBlockAdded);
    onServerBlockUpdated && socket.on("server:blockUpdated", onServerBlockUpdated);
    onServerBlockDeleted && socket.on("server:blockDeleted", onServerBlockDeleted);
    onServerBlockMoved && socket.on("server:blockMoved", onServerBlockMoved);
    onServerError && socket.on("server:error", onServerError);

    // User presence event handlers
    const handleUserJoined = (event: ServerUserJoinedEvent) => {
      setActiveUsers(event.activeUsers);
      if (onUserJoined) {
        onUserJoined(event);
      }
    };

    const handleUserLeft = (event: ServerUserLeftEvent) => {
      setActiveUsers(event.activeUsers);
      if (onUserLeft) {
        onUserLeft(event);
      }
    };

    const handleActiveUsers = (event: ServerActiveUsersEvent) => {
      setActiveUsers(event.activeUsers);
      if (onActiveUsersUpdate) {
        onActiveUsersUpdate(event);
      }
    };

    socket.on("server:userJoined", handleUserJoined);
    socket.on("server:userLeft", handleUserLeft);
    socket.on("server:activeUsers", handleActiveUsers);


    onServerBlockLocked && socket.on("server:blockLocked", onServerBlockLocked);
    onServerBlockLUnlcked && socket.on("server:blockUnlocked", onServerBlockLUnlcked);
    onBlockLockError && socket.on("server:blockLockError", onBlockLockError);

    return () => {
      console.log("Cleaning up socket connection for scriptId:", scriptId);
      socket.off("server:blockAdded", onServerBlockAdded);
      socket.off("server:blockUpdated", onServerBlockUpdated);
      socket.off("server:blockDeleted", onServerBlockDeleted);
      socket.off("server:blocksReordered", onServerBlockMoved);
      socket.off("server:error", onServerError);
      socket.off("server:userJoined", handleUserJoined);
      socket.off("server:userLeft", handleUserLeft);
      socket.off("server:activeUsers", handleActiveUsers);
      socket.off("server:blockLocked", onServerBlockLocked);
      socket.off("server:blockUnlocked", onServerBlockLUnlcked);
      socket.off("server:blockLockError", onBlockLockError);
      socket.emit("leave_room", scriptId);
      socket.disconnect();
    };
  }, [
    scriptId,
    onServerBlockAdded,
    onServerBlockUpdated,
    onServerBlockDeleted,
    onServerBlockMoved,
    onServerError,
  ]);

  const addBlockInSocket = useCallback(
    (block: ScriptBlock) => {
      if (!socketRef.current) return;

      const payload: ClientBlockAddedEvent = {
        scriptId,
        block,
      };
      socketRef.current.emit("client:blockAdded", payload);
    },
    [scriptId]
  );

  const updateBlockInSocket = useCallback(
    (
      blockId: string,
      blockParamUpdates: Partial<
        HeadingBlockParam | DescriptionBlockParam | DialogueBlockParam
      >,
    ) => {
      if (!socketRef.current) return;
      const payload: ClientBlockUpdateEvent = {
        scriptId,
        blockId: blockId as any, // Type assertion since we're using string but shared types expect ObjectId
        blockParamUpdates
      };
      console.log("Emitting client:blockUpdated with payload:", payload);
      socketRef.current.emit("client:blockUpdated", payload);
    },
    [scriptId]
  );

  const deleteBlockInSocket = useCallback(
    (blockId: string) => {
      if (!socketRef.current) return;

      const payload: ClientBlockDeletedEvent = {
        scriptId,
        blockId: blockId as any, // Type assertion since we're using string but shared types expect ObjectId
      };

      socketRef.current.emit("client:blockDeleted", payload);
    },
    [scriptId]
  );

  const moveBlockInSocket = useCallback(
    (blockId: string, newPosition:number) => {
      if (!socketRef.current) return;

      const payload: ClientBlockMovedEvent = {
        scriptId,
        blockId: blockId as any, // Type assertion since we're using string but shared types expect ObjectId
        newPosition
      };

      socketRef.current.emit("client:blockMoved", payload);
    },
    [scriptId]
  );

  const getActiveUsers = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit("getActiveUsers", scriptId);
  }, [scriptId]);

  const lockBlockInSocket = useCallback(
    (blockId: string) => {
      if (!socketRef.current) return;
      socketRef.current.emit("client:blockLock", {
        scriptId,
        blockId: blockId as any, // Type assertion since we're using string but shared types expect ObjectId
      });
    },
    [scriptId]
  );

  const unlockBlockInSocket = useCallback(
    (blockId: string) => {
      if (!socketRef.current) return;
      socketRef.current.emit("client:blockUnlock", {
        scriptId,
        blockId: blockId as any, // Type assertion since we're using string but shared types expect ObjectId
      });
    },
    [scriptId]
  );

  return {
    addBlockInSocket,
    updateBlockInSocket,
    deleteBlockInSocket,
    moveBlockInSocket,
    getActiveUsers,
    lockBlockInSocket,
    unlockBlockInSocket,
    activeUsers,
    socket: socketRef.current,
  };
};
