import jwt from 'jsonwebtoken';
import { User } from '../models/usermodel.js';
import nodemailer from 'nodemailer';

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
      console.log(token);
  // check token
        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
        // Get user from token
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists' });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(401).json({ status: 'fail', message: 'Not authorized, token failed' });
    }
};

export const restricTo= (...roles)=>{
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)){
 return res.status(403).json({ status: 'fail', message: 'You do not have permission  for this action' });
        }
        next();
    }
}


export const forgot = async (req, res, next) => {
  try {
    const { email } = req.validated;

    const user = await User.findOne({ email });
    
    
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
if (!user.isVerified) {
      return res.status(400).json({ status: 'fail', message: 'Account not verified. Please verify OTP first.' });
    }
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({validateBeforeSave:false});

    const transporter = nodemailer.createTransport({
        service :'gmail',
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.YOUR_PASSWORD
        }
    });

   
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOpt = {
  from: `MyApp <${process.env.EMAIL}>`,   // sender email from env
  to: user.email,                         // recipient
  subject: "Password Reset",
  html: `
    <p>Click this link to reset your password (expires in 10 mins):</p>
    <a href="${resetURL}">${resetURL}</a>
  `

     }

     await transporter.sendMail(mailOpt);

    res.status(200).json({
      status: "success",
      message: "Reset link generated. Please check your email.",
      resetURL // remove in production
    });

  } catch (err) {
    next(err);
  }
};

  export const reset =async (req,res,next)=>{
  try {
    const { token } = req.params;
    const { password } = req.validated;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Token invalid or expired" });

    user.pass = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ status: "success", message: "Password reset successfully" });

  } catch (err) {
    return res.status(400).json({ message: "Token invalid or expired" });
  }
};

  