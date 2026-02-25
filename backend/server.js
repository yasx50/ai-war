import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.connnection.js';
import mongoose from 'mongoose';
import profileRoutes from './routes/profile.js';
import debateRoutes from './routes/debate.js';
import customprofile from './routes/createprofile.js';
// Load env variables FIRST before anything else

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Vite default port
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Debate Engine API is running',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes (add as you build them)
app.use('/api/profiles', profileRoutes);
app.use('/api/debate', debateRoutes);
app.use('/api/customprofiles', customprofile);

// 404 handler
 // 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});
// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.message);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("groq api key", process.env.GROQ_API_KEY);
});