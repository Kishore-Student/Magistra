import express, { Router } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectDB from "./config/db.js";

import { generateExplain } from "./explain.js";
import { generateQuiz } from "./quiz.js";
import AiRouter from "./routes/qe.routes.js";
import teacherRouter from "./routes/teacher.js";
import studentRouter from "./routes/student.js";
import jwt from "jsonwebtoken";


connectDB();
const app = express();

app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.get("/api/auth/check", (req, res) => {
  console.log("Cookies:", req.cookies); // 👈 check this

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.status(200).json({ message: "OK" });
});
app.use("/api/teachers", teacherRouter);
app.use("/api/students", studentRouter);
app.use("/api/assistant-response", AiRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});