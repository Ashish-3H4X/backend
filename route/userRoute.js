import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser, updateProfile } from "../controller/userContoller.js"
import upload from "../middleware/multer.js"

const userRouter = express.Router()

userRouter.get("/getcurrentuser", isAuth , getCurrentUser)
userRouter.put("/profile", isAuth, upload.single("photoUrl"), updateProfile);



export default userRouter