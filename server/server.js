import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import shiftLogsRouter from './routes/shiftLogs.js';
import analyticsRouter from './routes/analytics.js';
import chatbotRouter from './routes/chatbot.js';
import reportsRouter from './routes/reports.js';
import equipmentRouter from './routes/equipment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running' });
});

// Routes
app.use('/api/shiftlogs', shiftLogsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/equipment', equipmentRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
