/**
 * ScriptHandlers.ts
 * 
 * This file contains the server-side Socket.IO event handlers for real-time script block operations
 * (add, update, delete, move). It interacts with the MongoDB database via Mongoose and broadcasts
 * updates to other connected clients.
 */

import { Socket, Server } from 'socket.io';
import { Types } from 'mongoose';
const ObjectId = Types.ObjectId;
import ScriptModel from '../models/Script';
import {
  ClientBlockAddedEvent,
  ClientBlockUpdateEvent,
  ClientBlockDeletedEvent,
  ClientBlockMovedEvent,
  ServerBlockAddedEvent,
  ServerBlockUpdatedEvent,
  ServerBlockDeletedEvent,
  ServerBlocksReorderedEvent
} from '@chatroom/shared';

/**
 * Register all script-related socket event handlers
 * @param socket The individual client socket
 * @param io The global Socket.IO server instance
 */
export const registerScriptHandlers = (socket: Socket, io: Server): void => {
  /**
   * Handle the 'client:blockAdded' event - when a client adds a new block
   */
  socket.on('client:blockAdded', async (payload: ClientBlockAddedEvent) => {
    try {
      const { scriptId, block, precedingBlockId } = payload;
      
      // Generate a new ObjectId for the block if not provided
      if (!block.id) {
        block.id = new ObjectId().toString();
      }
      
      // Fetch the script document
      const script = await ScriptModel.findById(scriptId);
      if (!script) {
        throw new Error(`Script with ID ${scriptId} not found`);
      }
      
      // Get the blocks array
      const blocks = script.blocks;
      
      // Calculate the position for the new block
      let newPosition: number;
      
      if (precedingBlockId === null) {
        // Adding to the beginning
        if (blocks.length === 0) {
          newPosition = 1000;
        } else {
          newPosition = blocks[0].position / 2;
        }
      } else {
        // Find the preceding block
        const precedingBlockIndex = blocks.findIndex(b => b.id === precedingBlockId);
        if (precedingBlockIndex === -1) {
          throw new Error(`Preceding block with ID ${precedingBlockId} not found`);
        }
        
        const precedingBlock = blocks[precedingBlockIndex];
        
        // Check if there's a following block
        if (precedingBlockIndex === blocks.length - 1) {
          // Adding to the end
          newPosition = precedingBlock.position + 1000;
        } else {
          // Adding between blocks
          const followingBlock = blocks[precedingBlockIndex + 1];
          newPosition = (precedingBlock.position + followingBlock.position) / 2;
        }
      }
      
      // Add position to the block
      const blockWithPosition = {
        ...block,
        position: newPosition
      };
      
      // Add the new block to the blocks array
      script.blocks.push(blockWithPosition);
      
      // Save the script
      await script.save();
      
      // Broadcast the event to all clients in the script room
      io.to(scriptId).emit('server:blockAdded', {
        scriptId,
        block: blockWithPosition,
        position: newPosition,
        timestamp: Date.now()
      } as ServerBlockAddedEvent);
      
    } catch (error) {
      console.error('Error handling client:blockAdded event:', error);
      socket.emit('server:error', {
        message: 'Failed to add block',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  /**
   * Handle the 'client:blockUpdated' event - when a client updates a block
   */
  socket.on('client:blockUpdated', async (payload: ClientBlockUpdateEvent) => {
    try {
      const { scriptId, blockId, updates } = payload;
      
      // Update the block in the database
      const result = await ScriptModel.findOneAndUpdate(
        { _id: scriptId, 'blocks.id': blockId },
        { $set: { 'blocks.$.blockParams': updates } },
        { new: true }
      );
      
      if (!result) {
        throw new Error(`Failed to update block with ID ${blockId} in script ${scriptId}`);
      }
      
      // Broadcast the update to all other clients in the script room
      socket.broadcast.to(scriptId).emit('server:blockUpdated', {
        scriptId,
        blockId,
        updates,
        timestamp: Date.now()
      } as ServerBlockUpdatedEvent);
      
    } catch (error) {
      console.error('Error handling client:blockUpdated event:', error);
      socket.emit('server:error', {
        message: 'Failed to update block',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  /**
   * Handle the 'client:blockDeleted' event - when a client deletes a block
   */
  socket.on('client:blockDeleted', async (payload: ClientBlockDeletedEvent) => {
    try {
      const { scriptId, blockId } = payload;
      
      // Remove the block from the database
      const result = await ScriptModel.findByIdAndUpdate(
        scriptId,
        { $pull: { blocks: { id: blockId } } },
        { new: true }
      );
      
      if (!result) {
        throw new Error(`Failed to delete block with ID ${blockId} from script ${scriptId}`);
      }
      
      // Broadcast the deletion to all other clients in the script room
      socket.broadcast.to(scriptId).emit('server:blockDeleted', {
        scriptId,
        blockId,
        timestamp: Date.now()
      } as ServerBlockDeletedEvent);
      
    } catch (error) {
      console.error('Error handling client:blockDeleted event:', error);
      socket.emit('server:error', {
        message: 'Failed to delete block',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  /**
   * Handle the 'client:blockMoved' event - when a client moves a block
   */
  socket.on('client:blockMoved', async (payload: ClientBlockMovedEvent) => {
    try {
      const { scriptId, blockId, precedingBlockId } = payload;
      
      // Fetch the script document
      const script = await ScriptModel.findById(scriptId);
      if (!script) {
        throw new Error(`Script with ID ${scriptId} not found`);
      }
      
      // Get the blocks array and sort it by position
      const blocks = [...script.blocks].sort((a, b) => a.position - b.position);
      
      // Find the block to move
      const blockToMoveIndex = blocks.findIndex(b => b.id === blockId);
      if (blockToMoveIndex === -1) {
        throw new Error(`Block with ID ${blockId} not found`);
      }
      
      const blockToMove = blocks[blockToMoveIndex];
      
      // Calculate the new position for the moved block
      let newPosition: number;
      
      if (precedingBlockId === null) {
        // Moving to the beginning
        if (blocks.length === 1) {
          newPosition = 1000;
        } else {
          newPosition = blocks[0].position / 2;
        }
      } else {
        // Find the preceding block
        const precedingBlockIndex = blocks.findIndex(b => b.id === precedingBlockId);
        if (precedingBlockIndex === -1) {
          throw new Error(`Preceding block with ID ${precedingBlockId} not found`);
        }
        
        const precedingBlock = blocks[precedingBlockIndex];
        
        // Check if there's a following block
        if (precedingBlockIndex === blocks.length - 1) {
          // Moving to the end
          newPosition = precedingBlock.position + 1000;
        } else {
          // Moving between blocks
          const followingBlockIndex = precedingBlockIndex + 1;
          // Skip the block being moved if it's the one right after the preceding block
          const followingBlock = blocks[followingBlockIndex === blockToMoveIndex ? followingBlockIndex + 1 : followingBlockIndex];
          newPosition = followingBlock 
            ? (precedingBlock.position + followingBlock.position) / 2 
            : precedingBlock.position + 1000;
        }
      }
      
      // Update the position of the block in the database
      await ScriptModel.findOneAndUpdate(
        { _id: scriptId, 'blocks.id': blockId },
        { $set: { 'blocks.$.position': newPosition } }
      );
      
      // Broadcast the new block order to all other clients
      const updatedScript = await ScriptModel.findById(scriptId);
      if (updatedScript) {
        // Get blocks sorted by position for the block order
        const sortedBlockIds = updatedScript.blocks
          .sort((a, b) => a.position - b.position)
          .map(block => block.id);
          
        socket.broadcast.to(scriptId).emit('server:blocksReordered', {
          scriptId,
          blockOrder: sortedBlockIds,
          timestamp: Date.now()
        } as ServerBlocksReorderedEvent);
      }
      
    } catch (error) {
      console.error('Error handling client:blockMoved event:', error);
      socket.emit('server:error', {
        message: 'Failed to move block',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};

export default registerScriptHandlers;
