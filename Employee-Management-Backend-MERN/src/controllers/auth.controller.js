const bcrypt = require("bcryptjs");
const User = require('../models/user.model');
const {generateAccessToken, generateRefreshToken} = require("../utils/token");
exports.register = async (req, res) =>{
    const {role, companyToken, password} = req.body;
    if(role === 'ADMIN' && companyToken !== 'ImtiazAdar')
        return res.status(403).json({message: "Invalid Company Token"});

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({...req.body, password: hashedPassword});
    res.status(201).json({message: "Registered Successfully!!!"});
};

exports.login = async (req, res)=>{
    const user = await User.findOne({username: req.body.username});
    if(!user) return res.status(404).json({message: "User not found!!!"});
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isMatch) return res.status(401).json({message: "Wrong Password"});
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    res.json({accessToken, refreshToken});
}

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findOne({ 
      _id: decoded.id, 
      refreshToken: refreshToken 
    });
    
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ 
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
    
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await User.findOneAndUpdate(
          { refreshToken }, 
          { refreshToken: null }
        );
      }
    }
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// Optional: Add logout method
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {e
      await User.findOneAndUpdate(
        { refreshToken }, 
        { refreshToken: null }
      );
    }
    
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};