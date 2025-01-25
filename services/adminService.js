const Admin = require('../Models/admin');

// Create Admin
exports.createAdmin = async ({ name, email, password, role }) => {
  if (await Admin.findOne({ email })) {
    throw new Error('Admin with this email already exists');
  }
  const admin = new Admin({ name, email, password, role });
  return await admin.save();
};

// Get All Admins
exports.getAllAdmins = async () => {
  return await Admin.find().select('-password');
};

// Authenticate Admin (Login)
exports.authenticateAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error('Admin not found');
  }
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid password');
  }
  return admin;
};
