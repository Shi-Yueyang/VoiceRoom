import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Regular REST endpoints
app.get('/', (req, res) => {
  res.send('MongoDB + Socket.IO Chat Demo');
});

