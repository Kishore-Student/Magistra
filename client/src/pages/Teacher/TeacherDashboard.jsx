import QuizGenerator from "../../components/QuizGenerator";
import ExplainBox from "../../components/ExplainBox";
import { GraduationCap, BookOpen } from "lucide-react";

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 flex flex-col gap-2">
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