import express from "express";
import {
  registerTeacher,
  loginTeacher,
  logOutTeacher
} from "../controllers/auth.js";

const teacherRouter = express.Router();

teacherRouter.post("/register", registerTeacher);
teacherRouter.post("/login", loginTeacher);
teacherRouter.post("/logout", logOutTeacher);

export default teacherRouter;