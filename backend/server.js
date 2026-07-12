import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Vercel deployment routes
app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/api/test-db', (req, res) => {
  try {
    const readyState = mongoose.connection.readyState;
    const statusMap = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting',
    };
    res.json({
      status: 'success',
      readyState,
      connectionStatus: statusMap[readyState] || 'Unknown',
      host: mongoose.connection.host || 'None'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;

