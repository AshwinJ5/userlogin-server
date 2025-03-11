const users = require("../Schema/userModel");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { generateAccessToken, generateRefreshToken } = require("../Services/tokenServices");

// register
exports.register = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(406).json({ message: "User Already Exists! Please Login." });
        }
        const saltRounds = parseInt(process.env.SALT);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new users({
            userName,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully", newUser });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "The email or password you entered is incorrect. Please check your details and try again",
                });
            }

            const accessToken = generateAccessToken(existingUser._id);
            const refreshToken = generateRefreshToken(existingUser._id);

            res.status(200).json({ user:{id:existingUser._id, username:existingUser.userName,email:existingUser.email}, accessToken, refreshToken });
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
        const allUsers = await users.find().select("-password -blockedUsers");
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

    try {
        const existingUser = await users.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
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
                        // console.log("Old image deleted:", existingUser.userImage);
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
                    // console.log("User image deleted:", user.userImage);
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

// block or unblock a user
exports.blockOrUnblockAnyUser = async (req, res) => {
    const userId = req.userId; 
    const { blockid } = req.params;

    try {
        const user = await users.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.blockedUsers.includes(blockid)) {
            await users.findByIdAndUpdate(userId, {
                $pull: { blockedUsers: blockid }
            });
            return res.status(200).json({ message: "User unblocked successfully" });
        } else {
            await users.findByIdAndUpdate(userId, {
                $addToSet: { blockedUsers: blockid }
            });
            return res.status(200).json({ message: "User blocked successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};
