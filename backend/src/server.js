import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:19006',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Randevu Yönetim Sistemi API',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);

// Error handler (en sonda olmalı)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
