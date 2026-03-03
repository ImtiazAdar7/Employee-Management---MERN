const User = require("../models/user.model");
module.exports = (req, res, next) => {
  try {
    const loggedInId = req.user.id;
    const loggedInRole = req.user.role;
    const targetUserId = req.params.id;

    if (loggedInRole === "ADMIN") return next();
    if (loggedInId == targetUserId) return next();
    return res.status(403).json({ message: "Access Denied" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
