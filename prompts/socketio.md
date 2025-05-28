## SocketEvent
Generate a TypeScript file named `SocketEvents.ts` under `backend/src/socket`

This file should define all TypeScript interfaces for the data payloads exchanged via WebSocket (Socket.IO) between the client and the server for a real-time collaborative script editing application.

**Naming Conventions:**
* File name: `SocketEvents.ts`
* Interface names: PascalCase (e.g., `ClientBlockUpdateEvent`)
* Property names within interfaces: camelCase (e.g., `scriptId`, `blockId`)

**Content Requirements:**

1.  **Core Script Block Interfaces (Dependencies):**
    * `HeadingBlockParam`: Interface for scene heading block parameters.
        * `intExt`: `string` (e.g., "INT", "EXT")
        * `location`: `string`
        * `time`: `string`
    * `DescriptionBlockParam`: Interface for description (action) block parameters.
        * `text`: `string`
    * `DialogueBlockParam`: Interface for dialogue block parameters.
        * `characterName`: `string`
        * `text`: `string`
    * `ScriptBlock`: Main interface for a single script block.
        * `id`: `string` (unique identifier for the block)
        * `type`: Union type `'sceneHeading' | 'description' | 'dialogue'`
        * `blockParams`: Union type `HeadingBlockParam | DescriptionBlockParam | DialogueBlockParam`

2.  **Client-to-Server Event Interfaces:** These define the data sent *from* the client *to* the server.
    * `ClientBlockUpdateEvent`:
        * `scriptId`: `string` (ID of the script being edited)
        * `blockId`: `string` (ID of the block being updated)
        * `updates`: `Partial<HeadingBlockParam | DescriptionBlockParam | DialogueBlockParam>` (partial object containing only the changed parameters for the block)
    * `ClientBlockAddedEvent`:
        * `scriptId`: `string`
        * `block`: `ScriptBlock` (the full new block data, including its `id`)
        * `precedingBlockId`: `string | null` (the ID of the block it should be inserted *after*. `null` if adding at the beginning.)
    * `ClientBlockDeletedEvent`:
        * `scriptId`: `string`
        * `blockId`: `string`
    * `ClientBlockMovedEvent`:
        * `scriptId`: `string`
        * `blockId`: `string` (the ID of the block that was moved)
        * `precedingBlockId`: `string | null` (the ID of the block it was moved *after* in the new order. `null` if moved to the beginning.)

3.  **Server-to-Client Event Interfaces:** These define the data sent *from* the server *to* connected clients.
    * `ServerBlockUpdatedEvent`:
        * `scriptId`: `string`
        * `blockId`: `string`
        * `updates`: `Partial<HeadingBlockParam | DescriptionBlockParam | DialogueBlockParam>` (partial object with updated parameters)
        * `timestamp`: `number` (Unix timestamp of the update on the server)
    * `ServerBlockAddedEvent`:
        * `scriptId`: `string`
        * `block`: `ScriptBlock` (the full new block data, including its server-assigned `id` and `position`)
        * `position`: `number` (the final calculated `position` of the new block in the server's order)
        * `timestamp`: `number`
    * `ServerBlockDeletedEvent`:
        * `scriptId`: `string`
        * `blockId`: `string`
        * `timestamp`: `number`
    * `ServerBlocksReorderedEvent`: (Alternative/complementary to `ServerBlockMovedEvent` for reordering)
        * `scriptId`: `string`
        * `blockOrder`: `string[]` (an array of all block IDs in their new, complete order)
        * `timestamp`: `number`

**Output:**
The complete TypeScript code for `src/types/SocketEvents.ts`.

## SocketHandler
Here's the prompt for an AI bot to generate the src/socket/ScriptHandlers.ts file, adhering to your specified naming conventions and including the logic for managing block order using a position field.

Markdown

Create a TypeScript file named `src/socket/ScriptHandlers.ts`.

**Purpose:**
This file will contain the server-side Socket.IO event handlers specifically for real-time script block operations (add, update, delete, move). It will interact with the MongoDB database via Mongoose and broadcast updates to other connected clients.

**Dependencies:**
* Import `Socket` and `Server` types from `'socket.io'`.
* Import the `ScriptModel` from `../models/Script`.
* Import all relevant TypeScript interfaces from `../types/Script` (e.g., `ScriptBlock`, `HeadingBlockParam`, `DescriptionBlockParam`, `DialogueBlockParam`).
* Import all relevant TypeScript interfaces from `../types/SocketEvents` (e.g., `ClientBlockAddedEvent`, `ClientBlockUpdatedEvent`, `ClientBlockDeletedEvent`, `ClientBlockMovedEvent`, `ServerBlockAddedEvent`, `ServerBlockUpdatedEvent`, `ServerBlockDeletedEvent`, `ServerBlockMovedEvent`).
* Import `ObjectId` from `mongoose.Types` for generating new block IDs.
* Import a logging utility (e.g., `console.error` for simplicity, or suggest a more robust logger).

**Main Function (`registerScriptHandlers`):**
Define a function named `registerScriptHandlers`.
* It should accept two parameters:
    * `socket`: `Socket` (the individual client socket).
    * `io`: `Server` (the global Socket.IO server instance).
* This function will set up all the event listeners for the given `socket`.

**Event Handlers (within `registerScriptHandlers`):**

Implement `socket.on` listeners for the following client-side events. Each handler should include `try-catch` blocks for robust error handling and logging.

1.  **`socket.on('client:blockAdded', async (payload: ClientBlockAddedEvent) => { ... })`**
    * **Logic:**
        * Extract `scriptId`, `block`, and `precedingBlockId` from the `payload`.
        * Generate a new `ObjectId` for the `block.id` if it's not already provided (client might send a temporary ID).
        * **Calculate `position` for the new block:**
            * Fetch the `Script` document from MongoDB using `scriptId`.
            * Get the `blocks` array from the script.
            * Find the `precedingBlock` by `precedingBlockId` within the `blocks` array.
            * Find the `followingBlock` (the block immediately after the `precedingBlock` in the current order).
            * If `precedingBlockId` is `null` (adding to the start):
                * If `blocks` is empty, `newPosition` = `1000`.
                * Else, `newPosition` = `blocks[0].position / 2`.
            * Else (`precedingBlockId` is provided):
                * If no `followingBlock` (adding to the end), `newPosition` = `precedingBlock.position + 1000`.
                * Else (`followingBlock` exists), `newPosition` = `(precedingBlock.position + followingBlock.position) / 2`.
            * Assign the calculated `newPosition` to `block.position`.
        * Add the new `block` to the `blocks` array in the MongoDB `Script` document using `$push` or by fetching, modifying, and then `$set`ing the entire array (prefer `$push` for simpler atomic operations if possible, but calculating position might necessitate fetching first).
        * **Broadcast:** Emit `io.to(scriptId).emit('server:blockAdded', { scriptId, block, position: block.position, timestamp: Date.now() } as ServerBlockAddedEvent);` (send the full block and its final position).

2.  **`socket.on('client:blockUpdated', async (payload: ClientBlockUpdatedEvent) => { ... })`**
    * **Logic:**
        * Extract `scriptId`, `blockId`, and `updates` from the `payload`.
        * Use `ScriptModel.findOneAndUpdate` with the `$set` operator to update specific fields within the embedded block. The query should target the `scriptId` and the specific block within its `blocks` array using `block.id`.
        * **Broadcast:** Emit `socket.broadcast.to(scriptId).emit('server:blockUpdated', { scriptId, blockId, updates, timestamp: Date.now() } as ServerBlockUpdatedEvent);` (broadcast to all *other* clients in the room).

3.  **`socket.on('client:blockDeleted', async (payload: ClientBlockDeletedEvent) => { ... })`**
    * **Logic:**
        * Extract `scriptId` and `blockId` from the `payload`.
        * Use `ScriptModel.findOneAndUpdate` with the `$pull` operator to remove the embedded block from the `blocks` array based on its `id`.
        * **Broadcast:** Emit `socket.broadcast.to(scriptId).emit('server:blockDeleted', { scriptId, blockId, timestamp: Date.now() } as ServerBlockDeletedEvent);`

4.  **`socket.on('client:blockMoved', async (payload: ClientBlockMovedEvent) => { ... })`**
    * **Logic:**
        * Extract `scriptId`, `blockId`, and `precedingBlockId` from the `payload`.
        * Fetch the `Script` document from MongoDB using `scriptId`.
        * Get the `blocks` array and find the `blockToMove` by `blockId`.
        * **Calculate `newPosition` for the moved block:**
            * Find the `precedingBlock` and `followingBlock` in the *current* sorted `blocks` array based on `precedingBlockId`.
            * Apply the same `position` calculation logic as in `client:blockAdded` to determine the `newPosition`.
        * Update the `position` field of the `blockToMove` in the database using `ScriptModel.findOneAndUpdate` and `$set`.
        * **Broadcast:** Emit `socket.broadcast.to(scriptId).emit('server:blockMoved', { scriptId, blockId, newPosition, timestamp: Date.now() } as ServerBlockMovedEvent);`

**Error Handling:**
* For each handler, wrap the database operations in a `try-catch` block.
* Log any errors using `console.error` (or a proper logger).
* Consider emitting a generic `server:error` event back to the client if an operation fails (e.g., `socket.emit('server:error', { message: 'Failed to update block', error: error.message });`).

**Naming Conventions:**
* File name: `ScriptHandlers.ts` 
* Function names: `registerScriptHandlers`, `onBlockAdded`, `onBlockUpdated`, etc. (camelCase)
* Variable names: `scriptId`, `blockToMove`, `newPosition`, etc.
* Interface names: `ClientBlockAddedEvent`, `ServerBlockUpdatedEvent`, etc. 


## SocketServer
Create a TypeScript file named `SocketServer.ts` in the `src/socket/` directory.

**Purpose:**
This module is responsible for initializing the Socket.IO server instance and attaching it to the existing HTTP server. It acts as the central hub for all WebSocket connections, handling new connections, disconnections, and routing events to appropriate handlers.

**Dependencies/Imports:**
* `Server` class from `socket.io`.
* `HttpServer` type from `http` module.
* The `ScriptHandlers` module (assume it's located at `../handlers/ScriptHandlers`).
* The `SocketEventTypes` module (assume it's located at `../../types/SocketEvent`).

**Exports:**
* A function, `InitializeSocketServer`, that takes an `HttpServer` instance as an argument.
* The initialized Socket.IO `Server` instance (`io`) should be exported, allowing other parts of the application (like REST controllers or other handlers) to access it for broadcasting.

**Key Functionality and Logic (within `InitializeSocketServer`):**

1.  **Socket.IO Server Initialization:**

2.  **Connection Handling (`connection` event):**
    * Listen for the `connection` event on the Socket.IO server.
    * When a new client `socket` connects:
        * Log a message indicating a new connection
        * Listen for the `disconnect` event on that specific `socket` and log a disconnection message.
        * Implement Room Joining
        * **Attach Event Handlers:** Attach the specific script-related event handlers from `ScriptHandlers` to this `socket` instance. You will need to pass the `io` instance to these handlers so they can broadcast. Use `socket.on()` for each type of `client:` event (e.g., `client:block_updated`, `client:block_added`, etc.).

**Considerations:**
* Use TypeScript for all variable types, function parameters, and return types, referencing `SocketEventTypes` for event payloads.
* Ensure proper error handling and logging.
* Adhere to PascalCase for the `SocketServer` function and file name as requested.