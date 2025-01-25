const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./Models/db'); // Your database connection
const adminRoutes = require('./routes/adminRoutes');
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: process.env.FRONTEND_URL,  // Ensure this matches your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, // Allow credentials if you're sending cookies or authorization headers
};

// Enable CORS
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());

// API Routes
app.use('/api/admin', adminRoutes); // Mount Admin Routes

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');  // Custom message for the root route
});

// Test API Route
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
