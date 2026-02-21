import { generateExplain } from "../explain.js";
import { generateQuiz } from "../quiz.js";

export const explainController = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required"
      });
    }

    const aiResponse = await generateExplain(prompt);

    // If AI returns string JSON, parse it
    let parsedResponse = aiResponse;

    if (typeof aiResponse === "string") {
      parsedResponse = JSON.parse(
        aiResponse.replace(/```json|```/g, "").trim()
      );
    }

    return res.status(200).json({
      success: true,
      data: parsedResponse
    });

  } catch (error) {
    console.error("Explain error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate explanation"
    });
  }
};

export const quizController = async (req, res) => {
  try {
    const { topic, questionCount } = req.body;

    if (!topic || !questionCount) {
      return res.status(400).json({
        success: false,
        message: "topic and questionCount are required"
      });
    }

    // AI response
    const aiResponse = await generateQuiz(topic, questionCount);

    // aiResponse.quiz is a STRING with ```json ... ```
    let raw = aiResponse.quiz;

    // Remove markdown code block
    raw = raw.replace(/```json|```/g, "").trim();

    // Parse JSON
    const parsedQuiz = JSON.parse(raw);

    // Convert to frontend-compatible format
    const questions = parsedQuiz.questions.map(q => ({
      q: q.question,
      options: q.options.map(opt => opt.replace(/^[A-D]\)\s*/, "")),
      answer: q.options.findIndex(
        opt => opt === q.correctAnswer
      )
    }));

    return res.status(200).json({
      success: true,
      title: parsedQuiz.topic,
      classLevel: parsedQuiz.classLevel,
      questions
    });

  } catch (error) {
    console.error("Quiz generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate quiz"
    });
  }
};


