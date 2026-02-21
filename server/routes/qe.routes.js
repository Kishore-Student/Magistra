import express from "express";
import { explainController,quizController } from "../controllers/qe.js";

const AiRouter = express.Router();

AiRouter.post("/explain", explainController);
AiRouter.post("/quiz", quizController);

export default AiRouter;



