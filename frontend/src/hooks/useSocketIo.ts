import {
  ServerBlockAddedEvent,
  ServerBlockUpdatedEvent,
  ServerBlockDeletedEvent,
  ServerBlocksMovedEvent,
  ClientBlockAddedEvent,
  ScriptBlock,
  DescriptionBlockParam,
  DialogueBlockParam,
  HeadingBlockParam,
  ClientBlockUpdateEvent,
  ClientBlockDeletedEvent,
  ClientBlockMovedEvent,
} from "@chatroom/shared";
import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface UseScriptSocketProps {
  scriptId: string;
  onServerBlockAdded?: (event: ServerBlockAddedEvent) => void;
  onServerBlockUpdated?: (event: ServerBlockUpdatedEvent) => void;
  onServerBlockDeleted?: (event: ServerBlockDeletedEvent) => void;
  onServerBlockMoved?: (event: ServerBlocksMovedEvent) => void;
  onServerError?: (error: { message: string; error: string }) => void;
}

export const useScriptSocket = ({
  scriptId,
  onServerBlockAdded,
  onServerBlockUpdated,
  onServerBlockDeleted,
  onServerBlockMoved,
  onServerError: onError,
}: UseScriptSocketProps) => {
  console.log("useScriptSocket called with scriptId:", scriptId);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL || "");
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

    if (onError) {
      socket.on("server:error", onError);
    }
    return () => {
      console.log("Cleaning up socket connection for scriptId:", scriptId);
      socket.off("server:blockAdded", onServerBlockAdded);
      socket.off("server:blockUpdated", onServerBlockUpdated);
      socket.off("server:blockDeleted", onServerBlockDeleted);
      socket.off("server:blocksReordered", onServerBlockMoved);
      socket.off("server:error", onError);
      socket.disconnect();
    };
  }, [
    scriptId,
    onServerBlockAdded,
    onServerBlockUpdated,
    onServerBlockDeleted,
    onServerBlockMoved,
    onError,
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
        blockId,
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
        blockId,
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
        blockId,
        newPosition
      };

      socketRef.current.emit("client:blockMoved", payload);
    },
    [scriptId]
  );

  return {
    addBlockInSocket,
    updateBlockInSocket,
    deleteBlockInSocket,
    moveBlockInSocket,
    socket: socketRef.current,
  };
};
