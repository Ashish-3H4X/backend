export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { description, name } = req.body;

    const updateData = {
      name,
      description,
    };

    if (req.file) {
      const photoUrl = await uploadOnCloudinary(req.file.path);
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