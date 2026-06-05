const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();  // Load .env variables
connectDB();      // Connect to MongoDB

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));  // Allow React dev server
app.use(express.json());                              // Parse JSON request bodies

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Root health check
app.get('/', (req, res) => res.json({ message: 'Task Manager API running' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));