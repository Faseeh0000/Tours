import {User } from "../models/usermodel.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config({ path: "./config.env" });

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.YOUR_PASSWORD
    }
});

// Helper to send OTP email
const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP for signup is: ${otp}. It will expire in 10 minutes.`
    };
    await transporter.sendMail(mailOptions);
};

export const signup = async (req, res) => {
    try {
        const data = req.validated;
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ status: 'fail', message: 'Email already exists' });
        }

        // Create new user with isVerified = false
        const newUser = await User.create({ ...data, isVerified: false });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        newUser.otp = otp;
        newUser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await newUser.save({ validateBeforeSave: false });

        // Send OTP via email
        await sendOtpEmail(newUser.email, otp);

        res.status(201).json({
            status: 'success',
            message: 'OTP sent to your email. Please verify to complete signup.',
            userId: newUser._id
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ status: 'fail', message: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email }).select('+otp +otpExpires +pass');

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ status: 'fail', message: 'User already verified' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ status: 'fail', message: 'Invalid OTP' });
        }

        if (Date.now() > user.otpExpires) {
            return res.status(400).json({ status: 'fail', message: 'OTP expired' });
        }

        // Mark verified and remove OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });

        // Issue JWT
        const token = signToken(user._id);
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
        });

        user.pass = undefined;

        res.status(200).json({
            status: 'success',
            token,
            data: user
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ------------------- RESEND OTP -------------------
export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ status: 'fail', message: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ status: 'fail', message: 'User already verified' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        await sendOtpEmail(user.email, otp);

        res.status(200).json({ status: 'success', message: 'OTP resent successfully' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

export const login = async (req,res)=>{ 
     try {
        const data = req.validated;
        const {email, pass} = data;

        const user = await User.findOne({email:email}).select('+pass');
        if (!user) {
            return res.status(401).json({ status: "fail", message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(401).json({ status: 'fail', message: 'Please verify your account first' });
        }

        if (!await user.correctpass(pass, user.pass)){
            return res.status(401).json({ status: "fail", message: "Invalid credentials" });
        }

 const token = signToken(user._id);

 res.cookie('jwt', token, {
    expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
 });

  res.status(201).json({
    status:'success',
    token,
    data:user
        });
      } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
      }
  
}
