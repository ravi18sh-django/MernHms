const jwt = require("jsonwebtoken");

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.role || (decoded.role !== "admin" && decoded.role !== "superadmin")) {
      return res.status(403).json({ message: "Access forbidden: Admins only." });
    }

    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyAdmin;
