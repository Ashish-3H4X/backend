import { response } from "express"
import User from "../model/userModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"


export const getCurrentUser = async (req , res) => {
  try {
     const user = await User.findById(req.userId ).select("-password")
     if(!user){
      return res.status(400).json({message:"User not found "})
     }
     return res.status(200).json(user)
  } catch (error) {
      return res.status(500).json({ message: `GetCurrentUserError: ${error.message}` });
  }
}


export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { description, name } = req.body;

    const updateData = {
      name,
      description,
    };

    if (req.file) {
      const photoUrl = await uploadOnCloudinary(req.file);
      updateData.photoUrl = photoUrl;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.log("Profile Update Error:", error);
    return res.status(500).json({
      message: `Update profile error: ${error.message}`,
    });
  }
};