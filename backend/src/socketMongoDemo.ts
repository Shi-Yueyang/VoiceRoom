import express from 'express';
import cors from 'cors';
import { initializeSocketMongo } from './demos/socketMongoHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Regular REST endpoints
app.get('/', (req, res) => {
  res.send('MongoDB + Socket.IO Chat Demo');
});

// Initialize Socket.IO and MongoDB integration
initializeSocketMongo(app).then((success) => {
  if (!success) {
    console.error('Failed to initialize Socket.IO and MongoDB integration');
    process.exit(1);
  }
});
