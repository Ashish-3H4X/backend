import User from "../model/userModel.js"
import validator from "validator"
import bcrypt, { compare } from "bcryptjs"
import genToken from "../config/token.js"
import sendMail from "../config/sendMail.js"

export const signUp = async (req ,res) => {
  
  try {

     const {name , email , password , role } =req.body

    //  check user exits

     let exitUser = await User.findOne({email})

     if (exitUser) {
       return res.status(400).json({message:"User is already exist"})
     }

    //  email validation check 

     if (!validator.isEmail(email) ) {
      return res.status(400).json({message:"Enter Valid Email "})
     }
    //  password check it strong or not 

     if (password.length <8) {
      return res.status(400).json({message:"Enter Strong Password "})   
     }
    //  here hashthe password by using bcryptjs to encrypt js 

      let hashPassword = await bcrypt.hash(password,10)

    //  here the user is created
    
      const user = await User.create(
        {
          name, 
          email,
          password:hashPassword,
          role
        })
      
// tokken gentration 

let token  = await genToken(user._id)
   res.cookie("token" ,token,{
    httpOnly:true,
    secure:true,
    sameSite:"none",
    maxAge:7*24*60*60*1000
   })
   return res.status(201).json(user)

  } catch (error) {
     if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
     return res.status(500).json({message:`Signup Error${error}`})
  }
}

// login authController setup

export const login = async (req, res) => {
  try {

    const {email , password} = req.body
     let user = await User.findOne({email})
     if (!user) {
       
       return res.status(404).json({message:"User not found"})
      
     }
     let isMatch = await bcrypt.compare(password,user.password)
     if (!isMatch) {
      return res.status(400).json({message:"Incorrect Password"})
      
     }

let token  = await genToken(user._id)
   res.cookie("token" ,token,{
    httpOnly:true,
    secure:true,
    sameSite:"none",
    maxAge:7*24*60*60*1000
   })
   return res.status(200).json(user)

  } catch (error) {
       return res.status(500).json({message:`LogIn Error${error}`})
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ message: "LogOut Successfully" });

  } catch (error) {
    return res.status(500).json({ message: `LogOut Error ${error}` });
  }
};
// export const logout = async(req, res)=>{
//   try {
//      await res.clearCookie("token")
//        return res.status(200).json({message:"LogOut Successfully"})
//   } catch (error) {
//     return res.status(500).json({message:`LogOut Error${error}`})
//   }
// }

export const sendOTP = async(req, res) =>{
  try {
     const {email}  = req.body
     const user = await User.findOne({email})
     if(!user){
      return res.status(404).json({message:"User not found"})
     }

     const otp = Math.floor(1000 + Math.random() * 9000).toString()

     user.resetOtp = otp,
     user.otpExpires = Date.now()+ 5*60*1000
     user.isOtpVerifed = false

     await user.save()
     await sendMail(email , otp)
     return res.status(200).json({message:"Otp Send Succesfully"})
  } catch (error) {
    return res.status(500).json({message:` Send Otp  Error${error}`})
  }
}


export const verifyOTP = async (req, res) => {
 try {
   const {email , otp} = req.body
   const user = await User.findOne({email})
     if(!user || user.resetOtp != otp ||user.otpExpires < Date.now() ){
      return res.status(404).json({message:"Invalid OTP"})
     }
     user.isOtpVerifed = true,
    user.resetOtp = undefined,
     user.otpExpires = undefined
     await user.save()
     return res.status(200).json({message:" Otp  Verified Successfully"})
 } catch (error) {
   return res.status(500).json({message:` Verify Otp   Error${error}`})
 }
}

export const resetPassword = async (req  , res) => {
  try {
     const {email ,  password } = req.body
     const user = await User.findOne({email})
     if(!user || !user.isOtpVerifed){
      return res.status(404).json({message:"OTP verification is required"})
     }
     const hashPassword = await bcrypt.hash(password,10)
     user.password = hashPassword, 
      user.isOtpVerifed = false
        await user.save()

       return res.status(200).json({message:"Reset Password Succesfully"})
  } catch (error) {
    return res.status(500).json({message:` Reset password  Error${error}`})
  }
  
}
export const googleAuthSignup = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // check if email exists
    let user = await User.findOne({ email });

    if (user) {
      // user already exists → throw error instead of login
      return res.status(400).json({ message: "User already exists. Please log in." });
    }
    // create new user if not exists
    user = await User.create({ name, email, role });

    // generate token
    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // set false if testing locally
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json(user);

  } catch (error) {
    return res.status(500).json({ message: `Google Auth Error: ${error.message}` });
  }
};
  //  slef
export const googleAuthSignin = async (req, res) => {
  try {
    const { name, email } = req.body;

    // check if email exists
    let user = await User.findOne({ email });
    // generate token
    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // set false if testing locally
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json(user);

  } catch (error) {
    return res.status(500).json({ message: `Google Auth Error: ${error.message}` });
  }
};
