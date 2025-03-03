const Admin = require('../Models/admin');
const adminService = require('../services/adminService');
const jwt = require('jsonwebtoken');



exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const admin = await adminService.authenticateAdmin(email, password);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

   
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } 
    );

    
    res.status(200).json({
      message: 'Login successful',
      token: `Bearer ${token}`,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.logoutAdmin = (req, res) => {
    try {
        
        res.clearCookie('token'); 
        return res.status(200).json({
            message: 'Logged out successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong during logout',
            error: error.message,
        });
    }
};

