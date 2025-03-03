const express = require('express');
const {loginAdmin, logoutAdmin} = require('../controllers/adminController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
// Protected routes
router.get('/profile', verifyToken, async (req, res) => {
  res.json({ message: 'Welcome to your profile', user: req.user });
});
router.get('/patientlist', verifyToken, async (req, res) => {
  res.json({ message: 'Welcome to patient list', user: req.user });
});
router.get('/patient/createPatient', verifyToken, async (req, res) => {
  res.json({ message: 'Welcome to patient Creation', user: req.user });
});

module.exports = router;
