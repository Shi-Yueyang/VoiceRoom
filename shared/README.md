# @chatroom/shared

This package contains shared TypeScript interfaces and types used by both the frontend and backend components of the chatroom application.

## Installation

This package is installed as a local dependency in both the frontend and backend projects:

```json
{
  "dependencies": {
    "@chatroom/shared": "file:../shared"
  }
}
```

## Usage

Import the types you need from the shared package:

```typescript
import { 
  ScriptBlock,
  HeadingBlockParam,
  DescriptionBlockParam,
  DialogueBlockParam,
  ClientBlockAddedEvent,
  ServerBlockUpdatedEvent 
} from '@chatroom/shared';
```

## Available Types

### Core Script Block Interfaces

- `HeadingBlockParam` - Parameters for scene heading blocks
- `DescriptionBlockParam` - Parameters for description/action blocks  
- `DialogueBlockParam` - Parameters for dialogue blocks
- `ScriptBlock` - Main interface for a script block

### Client-to-Server Event Interfaces

- `ClientBlockUpdateEvent` - When client updates a block
- `ClientBlockAddedEvent` - When client adds a new block
- `ClientBlockDeletedEvent` - When client deletes a block
- `ClientBlockMovedEvent` - When client moves/reorders a block

### Server-to-Client Event Interfaces

- `ServerBlockUpdatedEvent` - Server notifies clients of block update
- `ServerBlockAddedEvent` - Server notifies clients of new block
- `ServerBlockDeletedEvent` - Server notifies clients of deleted block
- `ServerBlocksReorderedEvent` - Server notifies clients of reordered blocks

## Development

To build the package:

```bash
npm run build
```

To watch for changes during development:

```bash
npm run dev
```

## File Structure

```
src/
  ├── index.ts          # Main export file
  └── SocketEvents.ts   # Socket.IO event interfaces
dist/                   # Compiled JavaScript and type definitions
```
