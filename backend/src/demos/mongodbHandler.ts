import express, { Request, Response } from "express";
import { MongoClient, Collection, ObjectId } from "mongodb";

// MongoDB connection string - should be in environment variables in production
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "chatroom";

let client: MongoClient | null = null;
let messagesCollection: Collection | null = null;

export const initializeMongoDBHandler = async (app: express.Application) => {
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);
    messagesCollection = db.collection("messages");

    // Set up routes
    setupRoutes(app);

    return true;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return false;
  }
};

const setupRoutes = (app: express.Application) => {
  // Get all messages
  app.get(
    "/api/messages",
    async (req: Request, res: Response): Promise<any> => {
      try {
        if (!messagesCollection) {
          return res.status(500).json({ error: "Database not initialized" });
        }

        const messages = await messagesCollection.find({}).toArray();
        res.json(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
      }
    }
  );

  // Get a single message by ID
  app.get(
    "/api/messages/:id",
    async (req: Request, res: Response): Promise<any> => {
      try {
        if (!messagesCollection) {
          return res.status(500).json({ error: "Database not initialized" });
        }

        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid ID format" });
        }

        const message = await messagesCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!message) {
          return res.status(404).json({ error: "Message not found" });
        }

        res.json(message);
      } catch (error) {
        console.error("Error fetching message:", error);
        res.status(500).json({ error: "Failed to fetch message" });
      }
    }
  );

  // Create a new message
  app.post(
    "/api/messages",
    async (req: Request, res: Response): Promise<any> => {
      try {
        if (!messagesCollection) {
          return res.status(500).json({ error: "Database not initialized" });
        }

        const { text, user, room } = req.body;

        if (!text || !user) {
          return res
            .status(400)
            .json({ error: "Text and user fields are required" });
        }

        const newMessage = {
          text,
          user,
          room: room || "general",
          timestamp: new Date(),
        };

        const result = await messagesCollection.insertOne(newMessage);
        res.status(201).json({
          _id: result.insertedId,
          ...newMessage,
        });
      } catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ error: "Failed to create message" });
      }
    }
  );

  // Update a message by ID
  app.put(
    "/api/messages/:id",
    async (req: Request, res: Response): Promise<any> => {
      try {
        if (!messagesCollection) {
          return res.status(500).json({ error: "Database not initialized" });
        }

        const { id } = req.params;
        const { text, room } = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid ID format" });
        }

        if (!text) {
          return res.status(400).json({ error: "Text field is required" });
        }

        const result = await messagesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { text, ...(room && { room }), updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Message not found" });
        }

        res.json({ success: true, modifiedCount: result.modifiedCount });
      } catch (error) {
        console.error("Error updating message:", error);
        res.status(500).json({ error: "Failed to update message" });
      }
    }
  );

  // Delete a message by ID
  app.delete(
    "/api/messages/:id",
    async (req: Request, res: Response): Promise<any> => {
      try {
        if (!messagesCollection) {
          return res.status(500).json({ error: "Database not initialized" });
        }

        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await messagesCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Message not found" });
        }

        res.json({ success: true });
      } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "Failed to delete message" });
      }
    }
  );
};
