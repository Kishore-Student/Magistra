import { useEffect, useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";


export default function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [quiz, setQuiz] = useState([]);
  const [language, setLanguage] = useState("en");
  const [listening, setListening] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const recognitionRef = useRef(null);

  // ───── Speech Recognition Setup ─────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setTopic(voiceText);
    };
  }, []);

  // ───── Start Voice Input for Title ─────
  const startTitleVoice = () => {
    if (!recognitionRef.current) return;

    let recogLang = language;
    if (language === "kn") recogLang = "en-IN";
    if (language === "en") recogLang = "en-US";
    if (language === "ta") recogLang = "ta-IN";
    if (language === "hi") recogLang = "hi-IN";

    recognitionRef.current.lang = recogLang;
    recognitionRef.current.start();
  };

  // ───── Generate Quiz ─────
  const generateQuiz = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    const res = await axios.post(
      "http://localhost:5000/api/assistant-response/quiz",
      {
        topic: topic + " (Language: " + language + ")",
        questionCount: count,
        language
      }
    );

    setQuiz(res.data.questions);
    setShowAnswers(false);
    setIsGenerating(false);
  };

  // ───── Download PDF ─────
  const downloadPDF = () => {
  const doc = new jsPDF();

  // Register fonts
  doc.addFileToVFS("Tamil.ttf", NotoSansTamil);
  doc.addFont("Tamil.ttf", "Tamil", "normal");

//   doc.addFileToVFS("Hindi.ttf", NotoSansHindi);
//   doc.addFont("Hindi.ttf", "Hindi", "normal");

//   doc.addFileToVFS("Kannada.ttf", NotoSansKannada);
//   doc.addFont("Kannada.ttf", "Kannada", "normal");

  // Choose font based on language
  if (language === "ta") {
    doc.setFont("Tamil");
  } else if (language === "hi") {
    doc.setFont("Hindi");
  } else if (language === "kn") {
    doc.setFont("Kannada");
  } else {
    doc.setFont("helvetica"); // English
  }

  let y = 10;
  doc.setFontSize(16);
  doc.text("Quiz: " + topic, 10, y);
  y += 10;

  doc.setFontSize(12);

  quiz.forEach((q, index) => {
    doc.text(index + 1 + ". " + q.q, 10, y);
    y += 7;

    q.options.forEach((opt, i) => {
      doc.text(
        String.fromCharCode(65 + i) + ") " + opt,
        15,
        y
      );
      y += 6;
    });

    y += 4;

    if (y > 270) {
      doc.addPage();

      if (language === "ta") doc.setFont("Tamil");
      else if (language === "hi") doc.setFont("Hindi");
      else if (language === "kn") doc.setFont("Kannada");
      else doc.setFont("helvetica");

      y = 10;
    }
  });

  doc.save(topic + "_quiz.pdf");
};

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-3">
        Quiz Generator
      </h2>

      {/* Language Selection */}
      <select
        value={language}
        onChange={e => setLanguage(e.target.value)}
        className="w-full border rounded-lg p-2 mb-2"
      >
        <option value="en">English</option>
        <option value="ta">Tamil</option>
        <option value="hi">Hindi</option>
        <option value="kn">Kannada</option>
      </select>

      {/* Voice Input */}
      <button
        onClick={startTitleVoice}
        className={`w-full mb-2 py-2 rounded-lg text-white ${
          listening ? "bg-red-500" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {listening ? "Listening..." : "Speak Quiz Title"}
      </button>

      {/* Topic */}
      <input
        className="w-full border rounded-lg p-2 mb-2"
        placeholder="Quiz topic"
        value={topic}
        onChange={e => setTopic(e.target.value)}
      />

      <input
        type="number"
        className="w-full border rounded-lg p-2 mb-3"
        value={count}
        onChange={e => setCount(e.target.value)}
      />

      <button
  onClick={generateQuiz}
  disabled={isGenerating}
  className="bg-cyan-500 text-white w-full py-2 rounded-lg hover:bg-cyan-600 disabled:opacity-70 disabled:cursor-not-allowed"
>
  {isGenerating ? "Generating..." : "Generate Quiz"}
</button>

      {/* Quiz Questions */}
      {quiz.length > 0 && (
        <>
          <div className="mt-4 space-y-3">
            {quiz.map((q, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {index + 1}. {q.q}
                </p>
                <ul className="list-disc ml-5 text-gray-600">
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Answer Toggle */}
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="mt-4 bg-indigo-500 text-white w-full py-2 rounded-lg hover:bg-indigo-600"
          >
            {showAnswers ? "Hide Answers" : "Show Answers"}
          </button>

          {/* Answer Block */}
          {showAnswers && (
            <div className="mt-4 bg-emerald-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">
                Answer Key
              </h3>

              {quiz.map((q, index) => (
                <p key={index} className="text-gray-700">
                  {index + 1}.{" "}
                  <span className="font-semibold text-emerald-700">
                    {String.fromCharCode(65 + q.answer)}
                  </span>{" "}
                  – {q.options[q.answer]}
                </p>
              ))}
            </div>
          )}

          <button
            onClick={downloadPDF}
            className="mt-4 bg-emerald-500 text-white w-full py-2 rounded-lg hover:bg-emerald-600"
          >
            Download Quiz as PDF
          </button>
        </>
      )}
    </div>
  );
}