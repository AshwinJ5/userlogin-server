const users = require("../Schema/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const fs = require("fs");
const path = require("path");
const { updateUserSchema } = require("../Validators/userValidator");
const { registerUserSchema } = require("../Validators/userValidator");

// register

exports.register = async (req, res) => {
    const { error } = registerUserSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: "Validation error", errors: error.details.map((err) => err.message) });
    }
    const { userName, email, password } = req.body;

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            res.status(406).json("User Already Exist! Please Login..");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new users({
                userName,
                email,
                password: hashedPassword,
            });
            await newUser.save();
            res.status(200).json(newUser);
        }
    } catch (err) {
        res.status(401).json(err);
    }
};

// login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email) {
            return res.status(400).json({
                message: "Email not provided",
            });
        }
        if (!password) {
            return res.status(400).json({
                message: "Password not provided",
            });
        }
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "The email or password you entered is incorrect. Please check your details and try again",
                });
            }
            const token = jwt.sign({ userId: existingUser._id }, process.env.Key_jwt, { expiresIn: "1h" });
            res.status(200).json({ existingUser, token });
        } else if (!existingUser) {
            return res
                .status(400)
                .json({ message: "No user found with this email. Please check the email address and try again" });
        } else {
            res.status(406).json("Email & Passsward does not match");
        }
    } catch (err) {
        res.status(401).json(err);
    }
};

//get all users data

exports.getAllUserData = async (req, res) => {
    try {
        const allUsers = await users.find().select("-password");
        if (!allUsers.length) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(401).json(error);
    }
};

//edit a user data

exports.updateUser = async (req, res) => {
    const { userName, email, password } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }

    try {
        const existingUser = await users.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const { error } = updateUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: "Validation error", errors: error.details.map((err) => err.message) });
        }

        let updateData = {};
        if (userName) updateData.userName = userName;
        if (email) updateData.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }
        if (req.file) {
            if (existingUser.userImage) {
                const oldImagePath = path.join(__dirname, "../Uploads", existingUser.userImage);
                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                        console.log("Old image deleted:", existingUser.userImage);
                    } catch (err) {
                        console.error("Error deleting old image:", err);
                    }
                }
            }
            updateData.userImage = req.file.filename;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No data provided for update" });
        }

        const updatedUser = await users.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// delete an user

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }

    try {
        const user = await users.findById(id);
        if (!user) {
            return res.status(404).json({ message: "No user found for deleting" });
        }

        if (user.userImage) {
            const imagePath = path.join(__dirname, "../Uploads", user.userImage);
            if (fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath);
                    console.log("User image deleted:", user.userImage);
                } catch (err) {
                    console.error("Error deleting image:", err);
                }
            }
        }

        await users.findByIdAndDelete(id);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
