import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function ExplainBox() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en-IN");

  const recognitionRef = useRef(null);

  // ───── Speech Recognition Setup ─────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setPrompt(voiceText);
    };
  }, []);

  // ───── Speak Function ─────
  const speak = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;

    const voices = window.speechSynthesis.getVoices();
    let matchedVoice = null;

    // Exact match first
    matchedVoice = voices.find((v) => v.lang === language);

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // ───── Start Voice Input ─────
  const startListening = () => {
    if (!recognitionRef.current) return;

    recognitionRef.current.lang = language;
    recognitionRef.current.start();
  };

  // ───── API Call ─────
  const handleExplain = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/assistant-response/explain",
        { prompt },
      );

      const responseText = res.data.data.response;
      setResult(responseText);
      speak(responseText);
    } catch (error) {
      console.log("Explain error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Voice AI Explanation
      </h2>

      {/* Language Selection */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full mb-3 p-2 border rounded-lg"
      >
        <option value="en-IN">English</option>
        <option value="hi-IN">Hindi</option>
      </select>

      {/* Voice Input */}
      <button
        onClick={startListening}
        className={`w-full mb-3 py-2 rounded-lg text-white ${
          listening ? "bg-red-500" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {listening ? "Listening..." : "Speak Question"}
      </button>

      {/* Text Input */}
      <textarea
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        rows="4"
        placeholder="Your question will appear here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Explain Button */}
      <button
        onClick={handleExplain}
        disabled={loading}
        className="mt-4 w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600"
      >
        {loading ? "Generating..." : "Explain"}
      </button>

      {/* Result */}
      {result && (
        <div className="mt-5 p-4 bg-emerald-50 rounded-lg text-gray-700">
          {result}
        </div>
      )}
    </div>
  );
}
