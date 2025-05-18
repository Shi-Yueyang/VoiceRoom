import express, { Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { MongoClient, Collection, ObjectId } from "mongodb";

// MongoDB connection string - should be in environment variables in production
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "chatroom";

let client: MongoClient | null = null;
let messagesCollection: Collection | null = null;
let io: SocketIOServer | null = null;

/**
 * Initialize MongoDB connection and Socket.IO server
 * 
 * @param app Express application
 * @returns boolean indicating success or failure
 */
export const initializeSocketMongo = async (app: express.Application) => {
  try {
    // Create HTTP server
    const server = http.createServer(app);
    
    // Initialize Socket.IO with CORS settings
    io = new SocketIOServer(server, {
      cors: {
        origin: "*", // In production, restrict to your frontend URL
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // Connect to MongoDB
    client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);
    messagesCollection = db.collection("messages");

    // Set up Express routes
    setupRoutes(app);
    
    // Set up Socket.IO event handlers
    setupSocketHandlers();

    // Start the server
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} with Socket.IO and MongoDB`);
    });

    return true;
  } catch (error) {
    console.error("Failed to initialize:", error);
    return false;
  }
};

/**
 * Set up Socket.IO event handlers
 */
const setupSocketHandlers = () => {
  if (!io || !messagesCollection) {
    console.error("Socket.IO or MongoDB not initialized");
    return;
  }

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Join a room
    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
      
      // Notify room about new user
      socket.to(room).emit("user_joined", { 
        userId: socket.id, 
        message: "A new user has joined the room" 
      });
    });
    
    // Listen for new message
    socket.on("send_message", async (data) => {
      try {
        const { text, user, room } = data;
        
        if (!text || !user || !room) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }
        
        // Create new message document
        const newMessage = {
          text,
          user,
          room,
          timestamp: new Date()
        };
        
        // Save to MongoDB
        const result = await messagesCollection.insertOne(newMessage);
        
        // Get the saved message with the generated ID
        const savedMessage = {
          _id: result.insertedId,
          ...newMessage
        };
        
        // Broadcast to everyone in the room
        io.to(room).emit("receive_message", savedMessage);
        
        console.log(`Message sent to room ${room}: ${text}`);
      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("error", { message: "Failed to save message" });
      }
    });
    
    // Update a message
    socket.on("update_message", async (data) => {
      try {
        const { id, text, room } = data;
        
        if (!id || !text) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }
        
        if (!ObjectId.isValid(id)) {
          socket.emit("error", { message: "Invalid message ID" });
          return;
        }
        
        const result = await messagesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { text, updatedAt: new Date() } }
        );
        
        if (result.matchedCount === 0) {
          socket.emit("error", { message: "Message not found" });
          return;
        }
        
        // Get the updated message
        const updatedMessage = await messagesCollection.findOne({
          _id: new ObjectId(id)
        });
        
        // Broadcast the update to the room
        io.to(room).emit("message_updated", updatedMessage);
        
      } catch (error) {
        console.error("Error updating message:", error);
        socket.emit("error", { message: "Failed to update message" });
      }
    });
    
    // Delete a message
    socket.on("delete_message", async (data) => {
      try {
        const { id, room } = data;
        
        if (!id || !room) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }
        
        if (!ObjectId.isValid(id)) {
          socket.emit("error", { message: "Invalid message ID" });
          return;
        }
        
        const result = await messagesCollection.deleteOne({
          _id: new ObjectId(id)
        });
        
        if (result.deletedCount === 0) {
          socket.emit("error", { message: "Message not found" });
          return;
        }
        
        // Broadcast the deletion to the room
        io.to(room).emit("message_deleted", { id });
        
      } catch (error) {
        console.error("Error deleting message:", error);
        socket.emit("error", { message: "Failed to delete message" });
      }
    });
    
    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

/**
 * Set up Express routes
 * 
 * @param app Express application
 */
const setupRoutes = (app: express.Application) => {
  // Get messages by room
  app.get(
    "/api/messages/:room",
    async (req: Request, res: Response): Promise<any> => {
      try {
        if (!messagesCollection) {
          return res.status(500).json({ error: "Database not initialized" });
        }

        const { room } = req.params;
        const messages = await messagesCollection.find({ room }).toArray();
        res.json(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
      }
    }
  );

  // Get all rooms
  app.get(
    "/api/rooms",
    async (req: Request, res: Response): Promise<any> => {
      try {
        if (!messagesCollection) {
          return res.status(500).json({ error: "Database not initialized" });
        }

        const rooms = await messagesCollection.distinct("room");
        res.json(rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Failed to fetch rooms" });
      }
    }
  );
};

// Helper function to close connections
export const closeSocketMongoConnections = async () => {
  if (io) {
    io.close();
    console.log("Socket.IO server closed");
  }
  
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
};
