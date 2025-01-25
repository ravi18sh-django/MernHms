const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./Models/db');  // Your database connection
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
const PORT = process.env.PORT || 8000;

const corsOptions = {
    origin: process.env.FRONTEND_URL, // Dynamic frontend URL based on .env file
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  };
  

// Enable CORS
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Serve API routes
app.use('/api/admin', adminRoutes);  // Mount Admin Routes

// Serve React app's static files from the dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback route for React app to handle any route (client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Test API
app.get('/ping', (req, res) => {
    res.send('pong');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
