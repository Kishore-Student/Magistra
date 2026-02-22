import express from "express";
import {getStudents, getStudentById, addStudent, updateMarks} from "../controllers/student.js";

const studentRouter = express.Router();
studentRouter.get("/", getStudents);
studentRouter.get("/:id", getStudentById);
studentRouter.post("/", addStudent);
studentRouter.put("/:id/marks", updateMarks);

export default studentRouter;