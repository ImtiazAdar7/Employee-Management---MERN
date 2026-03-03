const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        gender: {type: String, enum: ["Male", "Female", "Other"], required: true},
        designation: {type: String},
        dob: {type: Date, required: true},
        password: {type: String, required: true},
        role: {type: String, enum: ["EMPLOYEE", "ADMIN"], required: true},
        refreshToken: {type: String}},
        {timestamps: {createdAt: "created_at"}}

);
module.exports = mongoose.model("Users", userSchema);