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
import { ObjectId } from "bson";
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
  onBlockLocked?: (event: ServerBlockLockedEvent) => void;
  onBlockUnlocked?: (event: ServerBlockUnlockedEvent) => void;
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
  onBlockLocked,
  onBlockUnlocked,
  onBlockLockError,
}: UseScriptSocketProps) => {
  console.log("useScriptSocket called with scriptId:", scriptId);
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

    if (onServerBlockAdded) {
      socket.on("server:blockAdded", onServerBlockAdded);
    }
    if (onServerBlockUpdated) {
      socket.on("server:blockUpdated", onServerBlockUpdated);
    }

    if (onServerBlockDeleted) {
      socket.on("server:blockDeleted", onServerBlockDeleted);
    }

    if (onServerBlockMoved) {
      socket.on("server:blockMoved", onServerBlockMoved);
    }

    if (onServerError) {
      socket.on("server:error", onServerError);
    }

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

    // Block locking event handlers
    const handleBlockLocked = (event: ServerBlockLockedEvent) => {
      console.log("Block locked:", event);
      if (onBlockLocked) {
        onBlockLocked(event);
      }
    };

    const handleBlockUnlocked = (event: ServerBlockUnlockedEvent) => {
      console.log("Block unlocked:", event);
      if (onBlockUnlocked) {
        onBlockUnlocked(event);
      }
    };

    const handleBlockLockError = (event: ServerBlockLockErrorEvent) => {
      console.log("Block lock error:", event);
      if (onBlockLockError) {
        onBlockLockError(event);
      }
    };

    socket.on("server:blockLocked", handleBlockLocked);
    socket.on("server:blockUnlocked", handleBlockUnlocked);
    socket.on("server:blockLockError", handleBlockLockError);

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
      socket.off("server:blockLocked", handleBlockLocked);
      socket.off("server:blockUnlocked", handleBlockUnlocked);
      socket.off("server:blockLockError", handleBlockLockError);
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
      blockId: ObjectId,
      blockParamUpdates: Partial<
        HeadingBlockParam | DescriptionBlockParam | DialogueBlockParam
      >,
    ) => {
      if (!socketRef.current) return;
      const payload: ClientBlockUpdateEvent = {
        scriptId,
        blockId,
        blockParamUpdates
      };
      console.log("Emitting client:blockUpdated with payload:", payload);
      socketRef.current.emit("client:blockUpdated", payload);
    },
    [scriptId]
  );

  const deleteBlockInSocket = useCallback(
    (blockId: ObjectId) => {
      if (!socketRef.current) return;

      const payload: ClientBlockDeletedEvent = {
        scriptId,
        blockId,
      };

      socketRef.current.emit("client:blockDeleted", payload);
    },
    [scriptId]
  );

  const moveBlockInSocket = useCallback(
    (blockId: ObjectId, newPosition:number) => {
      if (!socketRef.current) return;

      const payload: ClientBlockMovedEvent = {
        scriptId,
        blockId,
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

  const lockBlock = useCallback(
    (blockId: ObjectId) => {
      if (!socketRef.current) return;
      socketRef.current.emit("client:blockLock", {
        scriptId,
        blockId,
      });
    },
    [scriptId]
  );

  const unlockBlock = useCallback(
    (blockId: ObjectId) => {
      if (!socketRef.current) return;
      socketRef.current.emit("client:blockUnlock", {
        scriptId,
        blockId,
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
    lockBlock,
    unlockBlock,
    activeUsers,
    socket: socketRef.current,
  };
};
