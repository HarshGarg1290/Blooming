import { response } from "express";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await userModel.findOne({ email });

		if (!user) {
			return res.json({ success: false, message: "User Doesn't Exists" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (isMatch) {
			const token = createToken(user._id);
			res.json({ success: true, token });
		} else {
			res.json({ success: false, message: "Incorrect Password" });
		}
	} catch (error) {
		console.log(error);

		res.json({ success: false, message: error.message });
	}
};

const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const exists = await userModel.findOne({ email });
		if (exists) {
			return res.json({ success: false, message: "User Already Exists" });
		}

		if (!validator.isEmail(email)) {
			return res.json({ success: false, message: "Incorrect Email" });
		}

		if (password.length < 8) {
			return res.json({
				success: false,
				message: "Please enter Strong Password",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new userModel({ name, email, password: hashedPassword });

		const user = await newUser.save();

		const token = createToken(user._id);
		res.json({ success: true, token });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

const adminLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (
			email === process.env.ADMIN_EMAIL &&
			password === process.env.ADMIN_PASSWORD
		) {
			const token = jwt.sign(email + password, process.env.JWT_SECRET);
			res.json({ success: true, token });
		} else {
			res.json({ success: false, message: "Invalid Credentials" });
		}
	} catch (error) {
		res.json({ success: false, message: error.message });
	}
};

const saveDeliveryInfo = async (req, res) => {
	try {
		const { userId, deliveryDetails } = req.body;
		const user = await userModel.findById(userId);
		if (!user) {
			return res.json({ success: false, message: "User not found" });
		}

		user.deliveryDetails = deliveryDetails;
		await user.save();

		res.json({ success: true, message: "Delivery details saved successfully" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};
const getUserDetails = async (req, res) => {
	try {
		const { userId } = req.body; 
		if (!userId) {
			return res.json({ success: false, message: "User ID is required" });
		}

		const user = await userModel.findById(userId);
		if (!user) {
			return res.json({ success: false, message: "User not found" });
		}

		res.json({ success: true, userName: user.name });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};



const getDeliveryInfo = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const deliveryDetails = await user.deliveryDetails;

        res.json({ success: true, deliveryDetails });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }


        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; 


        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

 
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset Request</h2>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Password reset link sent to your email" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired reset token" });
        }

        if (newPassword.length < 8) {
            return res.json({
                success: false,
                message: "Please enter Strong Password (min 8 characters)",
            });
        }

    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

 
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
	loginUser,
	registerUser,
	adminLogin,
	saveDeliveryInfo,
	getDeliveryInfo,
	getUserDetails,
	forgotPassword,
	resetPassword
};
