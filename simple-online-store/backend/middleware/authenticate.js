const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("❌ Missing or malformed authorization header");
    return res
      .status(401)
      .json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // Fetch user
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "email", "role"],
    });

    if (!user) {
      console.error("❌ User associated with token not found");
      return res
        .status(401)
        .json({ message: "User associated with token not found" });
    }

    req.user = user;
    console.log("✅ Authenticated user:", req.user);

    next();
  } catch (error) {
    console.error("❌ Authentication Middleware Error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
