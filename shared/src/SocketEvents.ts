/**
 * SocketEvents.ts
 * 
 * This file defines TypeScript interfaces for data payloads exchanged via Socket.IO
 * between the client and server for a real-time collaborative script editing application.
 */

// Core Script Block Interfaces

/**
 * Interface for scene heading block parameters
 */
export interface HeadingBlockParam {
  intExt: string;  // e.g., "INT", "EXT"
  location: string;
  time: string;
}

/**
 * Interface for description (action) block parameters
 */
export interface DescriptionBlockParam {
  text: string;
}

/**
 * Interface for dialogue block parameters
 */
export interface DialogueBlockParam {
  characterName: string;
  text: string;
}

/**
 * Union type for all possible block parameters
 */
export type BlockParamTypes = HeadingBlockParam | DescriptionBlockParam | DialogueBlockParam;

/**
 * Partial update type for block parameters
 */
export type BlockParamUpdates = Partial<BlockParamTypes>;

/**
 * Main interface for a single script block
 */
export interface ScriptBlock {
  _id: string;  // unique identifier for the block
  type: 'sceneHeading' | 'description' | 'dialogue';
  blockParams: BlockParamTypes;
}

// Client-to-Server Event Interfaces

/**
 * Event for updating a block from client to server
 */
export interface ClientBlockUpdateEvent {
  scriptId: string;  // ID of the script being edited
  blockId: string;   // ID of the block being updated
  updates: BlockParamUpdates;  // partial object containing only the changed parameters
}

/**
 * Event for adding a new block from client to server
 */
export interface ClientBlockAddedEvent {
  scriptId: string;
  block: ScriptBlock;  // the full new block data, including its id
  precedingBlockId: string | null;  // the ID of the block it should be inserted after. null if adding at the beginning.
}

/**
 * Event for deleting a block from client to server
 */
export interface ClientBlockDeletedEvent {
  scriptId: string;
  blockId: string;
}

/**
 * Event for moving a block from client to server
 */
export interface ClientBlockMovedEvent {
  scriptId: string;
  blockId: string;  // the ID of the block that was moved
  precedingBlockId: string | null;  // the ID of the block it was moved after in the new order. null if moved to the beginning.
}

// Server-to-Client Event Interfaces

/**
 * Event for notifying clients about a block update
 */
export interface ServerBlockUpdatedEvent {
  scriptId: string;
  blockId: string;
  updates: BlockParamUpdates;  // partial object with updated parameters
  timestamp: number;  // Unix timestamp of the update on the server
}

/**
 * Event for notifying clients about a new block
 */
export interface ServerBlockAddedEvent {
  scriptId: string;
  block: ScriptBlock;  // the full new block data, including its server-assigned id and position
  position: number;    // the final calculated position of the new block in the server's order
  timestamp: number;
}

/**
 * Event for notifying clients about a deleted block
 */
export interface ServerBlockDeletedEvent {
  scriptId: string;
  blockId: string;
  timestamp: number;
}

/**
 * Event for notifying clients about reordered blocks
 */
export interface ServerBlocksReorderedEvent {
  scriptId: string;
  blockOrder: string[];  // an array of all block IDs in their new, complete order
  timestamp: number;
}
