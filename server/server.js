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


connectDB();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/teachers", teacherRouter);
app.use("/api/students", studentRouter);
app.use("/api/assistant-response", AiRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});