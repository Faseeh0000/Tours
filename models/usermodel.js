import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';
import { number } from "zod";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate:[validator.isEmail,'Provide a valid mail']
  },
  phoneNo:{
    type: Number,
    required:true,
  },
  countryCode: {
    type: String,
    required: false
  },
  countryISO: {
    type: String, 
    required: false
  }
  ,
  pass: {
    type: String,
    required: [true, "Password is required"],
    minlength: [4, "Password must be at least 6 characters long"],
    select:false
  },
 confirmPass: {
    type: String,
    required: [false, "Password is required"],
    minlength: [4, "Password must be at least 6 characters long"],
    validate:function(el){
        return el === this.pass;
    }
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "user","Guide"],
      message: "Role must be either admin or user",
    },
    default: "user",
  }, 
  resetPasswordToken: String,
  resetPasswordExpire: Date,
 otp: String,
 otpExpires: Date,
 isVerified: { type: Boolean, default: false }

});

userSchema.pre('save', async function(){
    if(! this.isModified('pass')) return ;
   
    const salt =await bcrypt.genSalt(10);
    this.pass = await bcrypt.hash(this.pass,salt);
  this.confirmPass = undefined;
})
userSchema.methods.correctpass = async function( candidatePassword, userPassword){
   return await bcrypt.compare(candidatePassword, userPassword)
}

export const User = mongoose.model("User",userSchema);