module.exports = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    console.error("❌ Admin privileges required");
    return res.status(403).json({ message: "Admin privileges required" });
  }
};
