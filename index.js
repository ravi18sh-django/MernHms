const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./Models/db'); // Your database connection
const adminRoutes = require('./routes/adminRoutes');
const clinicRoutes = require("./routes/clinicRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const verifyToken = require('./middlewares/authMiddleware');
const PORT = process.env.PORT || 8000;

// CORS Configuration to allow all origins
const corsOptions = {
  origin: '*',  // Allow all origins
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, // Allow credentials if you're sending cookies or authorization headers
};

//console.log(corsOptions.allowedHeaders);


// Enable CORS
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// API Routes
app.use('/api/admin', adminRoutes); // Mount Admin Routes

app.use("/api/clinics", verifyToken, clinicRoutes);

app.use("/api/doctors", doctorRoutes);

app.use("/api/patients", patientRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/inventory", inventoryRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send(`Welcome to the API!`);
});

// Test API Route
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
