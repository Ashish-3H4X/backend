import express from "express"
import {googleAuthSignin, googleAuthSignup, login, logout, resetPassword, sendOTP, signUp, verifyOTP } from "../controller/authController.js"


const authRouter =express.Router()

authRouter.post("/signup" ,signUp)
authRouter.post("/login" ,login)
authRouter.get("/logout" ,logout)
authRouter.post("/sendotp", sendOTP)
authRouter.post("/verifyotp" ,verifyOTP)
authRouter.post("/resetpassword" , resetPassword)
authRouter.post("/googleauthsignup" , googleAuthSignup)
authRouter.post("/googleauthsignin" ,googleAuthSignin)
export default authRouter