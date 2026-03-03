const User = require("../models/user.model");
exports.getProfile = async(req, res)=>{
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);

};

exports.getAllEmployees = async(req, res)=>{
    const employees = await User.find({role: 'EMPLOYEE'}
    );
    res.json(employees);

};

exports.getEmployeeById = async(req, res)=>{
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.updateUser = async(req, res)=>{
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.json({message: "Updated Successfully!!!"});
}

exports.deleteUser = async(req, res)=>{
    await User.findByIdAndDelete(req.params.id, req.body);
    res.json({message: "Deleted Successfully!!!"});
}