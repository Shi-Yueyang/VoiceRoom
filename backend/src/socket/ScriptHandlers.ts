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
  ServerBlocksMovedEvent,
  SocketUser,
  ClientBlockLockEvent,
  ClientBlockUnlockEvent
} from '@chatroom/shared';


/**
 * Register all script-related socket event handlers
 * @param socket The individual client socket
 * @param io The global Socket.IO server instance
 */
export const registerScriptHandlers = (socket: Socket, io: Server): void => {
  const user = socket.data.user as SocketUser;

  socket.on('client:blockAdded', async (payload: ClientBlockAddedEvent) => {
    console.log('client:blockAdded event received:', payload);
    try {
      const { scriptId, block } = payload;
      
      // Generate a new ObjectId for the block if not provided

      // Fetch the script document
      const script = await ScriptModel.findById(scriptId);
      if (!script) {
        throw new Error(`Script with ID ${scriptId} not found`);
      }
      
      
      // Add position to the block
      const blockWithPosition = {
        ...block,
      };
      
      // Add the new block to the blocks array
      script.blocks.push(blockWithPosition);
      
      // Save the script
      await script.save();
      // Broadcast the event to all clients in the script room
      io.to(scriptId).emit('server:blockAdded', {
        scriptId,
        block: blockWithPosition,
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
      const { scriptId, blockId, blockParamUpdates } = payload;
      console.log('client:blockUpdated event received:', payload);
      
      // Update the block in the database
      const result = await ScriptModel.findOneAndUpdate(
        { _id: scriptId, 'blocks._id': blockId },
        { $set: { 'blocks.$.blockParams': blockParamUpdates } },
        { new: true }
      );
      
      if (!result) {
        throw new Error(`Failed to update block with ID ${blockId} in script ${scriptId}`);
      }
      
      // Broadcast the update to all other clients in the script room
      socket.broadcast.to(scriptId).emit('server:blockUpdated', {
        scriptId,
        blockId,
        blockParamUpdates,
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
        { $pull: { blocks: { _id: blockId } } },
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
      const { scriptId, blockId, newPosition } = payload;

      // Update the block's position in the database
      const result = await ScriptModel.findOneAndUpdate(
        { _id: scriptId, 'blocks._id': blockId },
        { $set: { 'blocks.$.position': newPosition } },
        { new: true }
      );

      if (!result) {
        throw new Error(`Failed to move block with ID ${blockId} in script ${scriptId}`);
      }

      // Broadcast the position update to all other clients in the script room
      socket.broadcast.to(scriptId).emit('server:blockMoved', {
        scriptId,
        blockId,
        newPosition,
        timestamp: Date.now()
      } as ServerBlocksMovedEvent);

    } catch (error) {
      console.error('Error handling client:blockMoved event:', error);
      socket.emit('server:error', {
        message: 'Failed to move block',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Block locking handlers
  socket.on('client:blockLock', async (payload: ClientBlockLockEvent) => {
    try {
      const { scriptId, blockId } = payload;
      console.log('client:blockLock event received:', payload);
      
      const script = await ScriptModel.findById(scriptId);
      if (!script) {
        throw new Error(`Script with ID ${scriptId} not found`);
      }

      // Check if user can edit this script
      if (!script.canEdit(new ObjectId(user.userId))) {
        return;
      }

      // Try to lock the block
      const lockSuccess = await script.lockBlock(blockId, new ObjectId(user.userId));
      if (lockSuccess) {
        console.log(`Block ${blockId} locked by user ${user.username}`);
        // Broadcast successful lock to all clients in the room
        io.to(scriptId).emit('server:blockLocked', {
          scriptId,
          blockId,
          lockedBy: user,
          timestamp: Date.now()
        });
      } 
    } catch (error) {
      console.error('Error handling client:blockLock event:', error);
    }
  });

  socket.on('client:blockUnlock', async (payload: ClientBlockUnlockEvent) => {
    try {
      const { scriptId, blockId } = payload;
      console.log('client:blockUnlock event received:', payload);
      
      const script = await ScriptModel.findById(scriptId);
      if (!script) {
        throw new Error(`Script with ID ${scriptId} not found`);
      }

      // Try to unlock the block
      const unlockSuccess = await script.unlockBlock(blockId, new ObjectId(user.userId));
      
      if (unlockSuccess) {
        io.to(scriptId).emit('server:blockUnlocked', {
          scriptId,
          blockId,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Error handling client:blockUnlock event:', error);
      socket.emit('server:error', {
        message: 'Failed to unlock block',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};

export default registerScriptHandlers;
