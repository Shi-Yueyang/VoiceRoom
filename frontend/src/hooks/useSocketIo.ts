import {
  ServerBlockAddedEvent,
  ServerBlockUpdatedEvent,
  ServerBlockDeletedEvent,
  ServerBlocksReorderedEvent,
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
  onBlockAdded?: (event: ServerBlockAddedEvent) => void;
  onBlockUpdated?: (event: ServerBlockUpdatedEvent) => void;
  onBlockDeleted?: (event: ServerBlockDeletedEvent) => void;
  onBlocksReordered?: (event: ServerBlocksReorderedEvent) => void;
  onError?: (error: { message: string; error: string }) => void;
}

export const useScriptSocket = ({
  scriptId,
  onBlockAdded,
  onBlockUpdated,
  onBlockDeleted,
  onBlocksReordered,
  onError,
}: UseScriptSocketProps) => {
  console.log("useScriptSocket called with scriptId:", scriptId);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL || "");
    const socket = socketRef.current;
    socket.emit("join_room", scriptId);

    if (onBlockAdded) {
      socket.on("server:blockAdded", onBlockAdded);
    }
    if (onBlockUpdated) {
      socket.on("server:blockUpdated", onBlockUpdated);
    }

    if (onBlockDeleted) {
      socket.on("server:blockDeleted", onBlockDeleted);
    }

    if (onBlocksReordered) {
      socket.on("server:blocksReordered", onBlocksReordered);
    }

    if (onError) {
      socket.on("server:error", onError);
    }
    return () => {
      console.log("Cleaning up socket connection for scriptId:", scriptId);
      socket.off("server:blockAdded", onBlockAdded);
      socket.off("server:blockUpdated", onBlockUpdated);
      socket.off("server:blockDeleted", onBlockDeleted);
      socket.off("server:blocksReordered", onBlocksReordered);
      socket.off("server:error", onError);
      socket.disconnect();
    };
  }, [
    scriptId,
    onBlockAdded,
    onBlockUpdated,
    onBlockDeleted,
    onBlocksReordered,
    onError,
  ]);

  const addBlock = useCallback(
    (block: ScriptBlock, precedingBlockId: string | null) => {
      if (!socketRef.current) return;

      const payload: ClientBlockAddedEvent = {
        scriptId,
        block,
        precedingBlockId,
      };
      socketRef.current.emit("client:blockAdded", payload);
    },
    [scriptId]
  );

  const updateBlock = useCallback(
    (
      updates: Partial<
        HeadingBlockParam | DescriptionBlockParam | DialogueBlockParam
      >,
      blockId: string
    ) => {
      if (!socketRef.current) return;
      const payload: ClientBlockUpdateEvent = {
        scriptId,
        blockId,
        updates,
      };
      socketRef.current.emit("client:blockUpdated", payload);
    },
    [scriptId]
  );

  const deleteBlock = useCallback(
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

  const moveBlock = useCallback(
    (blockId: string, precedingBlockId: string | null) => {
      if (!socketRef.current) return;

      const payload: ClientBlockMovedEvent = {
        scriptId,
        blockId,
        precedingBlockId,
      };

      socketRef.current.emit("client:blockMoved", payload);
    },
    [scriptId]
  );

  return {
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    socket: socketRef.current,
  };
};
