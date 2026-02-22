import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import {
  createCourse,
  getPublishedCourses,
  getCreatorCourses,
  editCourse,
  getCourseById,
  removeCourse,
  createLecture,
  getCourseLecture,
  editLecture,
  removeLecture,
  getSingleCourse,
} from "../controller/courseController.js";

const courseRouter = express.Router();
// fro Courses
courseRouter.post("/create", isAuth, createCourse);
courseRouter.get("/getpublished", getPublishedCourses);
courseRouter.get("/getcreator", isAuth, getCreatorCourses);
courseRouter.post(
  "/editcourse/:courseId",
  isAuth,
  upload.single("thumbnail"),
  editCourse,
);
courseRouter.get("/getcourse/:courseId", isAuth, getCourseById);
courseRouter.delete("/remove/:courseId", isAuth, removeCourse);

// for lectures

courseRouter.get("/get/:courseId", getSingleCourse);

courseRouter.post("/createlecture/:courseId", isAuth, createLecture);
courseRouter.get("/courselecture/:courseId", isAuth, getCourseLecture);
courseRouter.post("/editlecture/:lectureId", isAuth, upload.single("videoUrl"),editLecture)
courseRouter.delete("/removelecture/:lectureId" , isAuth, removeLecture)

export default courseRouter;
