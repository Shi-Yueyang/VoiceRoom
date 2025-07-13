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
  position: number;  // determines the order of blocks (higher numbers appear later)
  blockParams: BlockParamTypes;
}

// Client-to-Server Event Interfaces

/**
 * Event for updating a block from client to server
 */
export interface ClientBlockUpdateEvent {
  scriptId: string;  // ID of the script being edited
  blockId: string;   // ID of the block being updated
  blockParamUpdates: BlockParamUpdates;  // partial object containing only the changed parameters
}

/**
 * Event for adding a new block from client to server
 */
export interface ClientBlockAddedEvent {
  scriptId: string;
  block: ScriptBlock;  // the full new block data, including its id
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
    blockId: string;
    newPosition: number;
}

export interface ServerBlockPositionUpdatedEvent {
    scriptId: string;
    blockId: string;
    newPosition: number;  // the new position of the block after reordering
    timestamp: number;  // when the update occurred
}
// Server-to-Client Event Interfaces

/**
 * Event for notifying clients about a block update
 */
export interface ServerBlockUpdatedEvent {
    scriptId: string;
    blockId: string;
    blockParamUpdates: BlockParamUpdates;
    timestamp: number;
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
export interface ServerBlocksMovedEvent {
    scriptId: string;
    blockId: string;
    newPosition: number;
}

// User Presence Events

/**
 * Interface for user information in socket context
 */
export interface SocketUser {
  userId: string;
  username: string;
  email?: string;
}

/**
 * Event for when a user joins a room
 */
export interface ClientUserJoinedEvent {
  scriptId: string;
  user: SocketUser;
}

/**
 * Event for when a user leaves a room
 */
export interface ClientUserLeftEvent {
  scriptId: string;
  userId: string;
}

/**
 * Event for notifying clients about user joining
 */
export interface ServerUserJoinedEvent {
  scriptId: string;
  user: SocketUser;
  activeUsers: SocketUser[];
  timestamp: number;
}

/**
 * Event for notifying clients about user leaving
 */
export interface ServerUserLeftEvent {
  scriptId: string;
  userId: string;
  activeUsers: SocketUser[];
  timestamp: number;
}

/**
 * Event for getting current active users in a room
 */
export interface ServerActiveUsersEvent {
  scriptId: string;
  activeUsers: SocketUser[];
  timestamp: number;
}

/**
 * Event for requesting active users
 */
export interface ClientGetActiveUsersEvent {
  scriptId: string;
}
