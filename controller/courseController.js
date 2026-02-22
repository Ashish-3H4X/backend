import uploadOnCloudinary from "../config/cloudinary.js";
import Course from "../model/courseModel.js";
import Lecture from "../model/lectureModel.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res
        .status(400)
        .json({ message: "Title and Category are required" });
    }

    const course = await Course.create({
      title,
      category,
      creator: req.userId, // Ensure your auth middleware sets req.userId
    });

    return res.status(201).json(course);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Failed to create course: ${error.message}` });
  }
};

// Get all published courses
export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true });

    if (courses.length === 0) {
      return res.status(404).json({ message: "No published courses found" });
    }

    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Failed to fetch published courses: ${error.message}` });
  }
};

// Get courses created by a specific user
export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await Course.find({ creator: userId });

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this creator" });
    }

    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Failed to fetch creator courses: ${error.message}` });
  }
};

// Edit a course
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      subTitle,
      description,
      category,
      level,
      price,
      isPublished,
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updateData = {
      title,
      subTitle,
      description,
      category,
      level,
      price,
      isPublished,
    };
    if (req.file) {
      const thumbnail = await uploadOnCloudinary(req.file.path);
      updateData.thumbnail = thumbnail;
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
    return res.status(200).json(updatedCourse);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Failed to update course: ${error.message}` });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Failed to fetch course: ${error.message}` });
  }
};

// Remove a course
export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Course.findByIdAndDelete(courseId);
    return res.status(200).json({ message: "Course removed successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Failed to remove course: ${error.message}` });
  }
};

// for lecture
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture title is required",
      });
    }
    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    course.lectures.push(lecture._id);
    await course.populate("lectures");
    await course.save();
    return res.status(201).json({
      lecture,
      course,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to create Lecture ${error.message}`,
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    await course.populate("lectures");

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({
      message: `Failed to getCourseLecture ${error.message}`,
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { isPreviewFree, lectureTitle } = req.body;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    if (req.file) {
      const videoUrl = await uploadOnCloudinary(req.file.path);
      lecture.videoUrl = videoUrl;
    }
    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
    }
    lecture.isPreviewFree = isPreviewFree;
    await lecture.save();
    return res.status(200).json(lecture);
  } catch (error) {
    return res.status(500).json({
      message: `Failed to edit lecture ${error.message}`,
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }

    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } },
    );

    return res.status(200).json({
      message: "Lecture Removed",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to remove lecture ${error.message}`,
    });
  }
};

export const getSingleCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate("lectures")
      .populate("creator", "name email photoUrl");

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({
      message: `Failed to get course: ${error.message}`,
    });
  }
};
