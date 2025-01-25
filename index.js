const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./Models/db'); // Your database connection
const adminRoutes = require('./routes/adminRoutes');
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: process.env.FRONTEND_URL, // Dynamic frontend URL based on .env file (if needed)
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

// Enable CORS
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// API Routes
app.use('/api/admin', adminRoutes); // Mount Admin Routes

// Root Route
app.get('/', (req, res) => {
  res.send(`Welcome to the API! ${process.env.FRONTEND_URL}`); // Respond with a custom message
});

// Test API Route
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
