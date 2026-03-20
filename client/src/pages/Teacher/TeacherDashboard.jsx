import QuizGenerator from "../../components/QuizGenerator";
import ExplainBox from "../../components/ExplainBox";
import { GraduationCap, BookOpen, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/teachers/logout",
        {},
        { withCredentials: true }
      );

      navigate("/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Left Section */}
          <div>
            <div className="flex items-center gap-3">
              <GraduationCap className="text-emerald-600 w-8 h-8" />
              <h1 className="text-3xl font-bold text-gray-800">
                Teacher Dashboard
              </h1>
            </div>

            <p className="text-gray-600 text-lg">
              Manage explanations, generate quizzes, and guide students easily
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full shadow-md transition w-fit"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Explain Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-cyan-600 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-800">
                Concept Explanation
              </h2>
            </div>
            <ExplainBox />
          </div>

          {/* Quiz Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="text-emerald-600 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-800">
                Quiz Generator
              </h2>
            </div>
            <QuizGenerator />
          </div>

        </div>

      </div>
    </div>
  );
}