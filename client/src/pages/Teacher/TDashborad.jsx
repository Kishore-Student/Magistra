import { useState, useEffect } from "react";
import AI from "../../components/AI";

// ─── Persistent Storage (window.storage) ──────────────────────────────────────
const DB_KEY = "teacher_dashboard_db";

const defaultDB = {
  students: [
    { id: 1, name: "Aisha Patel", email: "aisha@school.edu", grade: "10A", avatar: "AP", score: 92, quizzesTaken: 8, lastActive: "2025-02-20", joined: "2025-01-10" },
    { id: 2, name: "Marcus Chen", email: "marcus@school.edu", grade: "10A", avatar: "MC", score: 85, quizzesTaken: 7, lastActive: "2025-02-19", joined: "2025-01-10" },
    { id: 3, name: "Sofia Torres", email: "sofia@school.edu", grade: "10B", avatar: "ST", score: 89, quizzesTaken: 8, lastActive: "2025-02-20", joined: "2025-01-12" },
    { id: 4, name: "James Okonkwo", email: "james@school.edu", grade: "10B", avatar: "JO", score: 72, quizzesTaken: 5, lastActive: "2025-02-17", joined: "2025-01-15" },
    { id: 5, name: "Emily Zhao", email: "emily@school.edu", grade: "10A", avatar: "EZ", score: 78, quizzesTaken: 6, lastActive: "2025-02-18", joined: "2025-01-11" },
  ],
  quizzes: [
    {
      id: 1,
      title: "Algebra Fundamentals",
      subject: "Mathematics",
      createdAt: "2025-02-15",
      assignedTo: [1, 2, 3, 4, 5],
      questions: [
        { q: "What is the value of x in 2x + 4 = 12?", options: ["2", "4", "6", "8"], answer: 1 },
        { q: "Simplify: 3(x + 2) - x", options: ["2x + 6", "2x + 3", "4x + 6", "2x + 2"], answer: 0 },
        { q: "Solve: x² = 49", options: ["x = 7", "x = ±7", "x = -7", "x = 14"], answer: 1 },
      ],
    },
    {
      id: 2,
      title: "Newton's Laws",
      subject: "Physics",
      createdAt: "2025-02-18",
      assignedTo: [1, 3, 5],
      questions: [
        { q: "What is Newton's First Law?", options: ["F=ma", "Every action has equal opposite reaction", "Objects remain at rest unless acted upon", "None"], answer: 2 },
        { q: "Unit of Force?", options: ["Joule", "Newton", "Pascal", "Watt"], answer: 1 },
      ],
    },
  ],
};

async function loadDB() {
  try {
    const result = await window.storage.get(DB_KEY);
    return result ? JSON.parse(result.value) : defaultDB;
  } catch {
    return defaultDB;
  }
}

async function saveDB(data) {
  try {
    await window.storage.set(DB_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Storage error", e);
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function getGrade(score) {
  if (score >= 90) return { label: "A", color: "text-emerald-400" };
  if (score >= 80) return { label: "B", color: "text-teal-400" };
  if (score >= 70) return { label: "C", color: "text-cyan-400" };
  if (score >= 60) return { label: "D", color: "text-yellow-400" };
  return { label: "F", color: "text-red-400" };
}

function ProgressBar({ value, color = "from-emerald-400 to-cyan-400" }) {
  return (
    <div className="w-full bg-white/10 rounded-full h-2">
      <div
        className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function Avatar({ initials, size = "md" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base" };
  return (
    <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg`}>
      {initials}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const [db, setDB] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Student form state
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: "", email: "", grade: "10A" });
  const [editingStudent, setEditingStudent] = useState(null);

  // Quiz builder state
  const [quizForm, setQuizForm] = useState({ title: "", subject: "", assignedTo: [] });
  const [questions, setQuestions] = useState([{ q: "", options: ["", "", "", ""], answer: 0 }]);
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadDB().then(setDB);
  }, []);

  const persistDB = (newDB) => {
    setDB(newDB);
    saveDB(newDB);
  };

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!db) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f4c35 0%, #0a3d5c 100%)" }}>
      <div className="text-white text-xl font-semibold animate-pulse">Loading Dashboard...</div>
    </div>
  );

  const avgScore = db.students.length ? Math.round(db.students.reduce((a, s) => a + s.score, 0) / db.students.length) : 0;
  const totalQuizzes = db.quizzes.length;

  // ── Add / Edit Student ──────────────────────────────────────────────────────
  const handleSaveStudent = () => {
    if (!studentForm.name.trim() || !studentForm.email.trim()) return notify("Fill all fields", "error");
    const initials = studentForm.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    if (editingStudent) {
      const updated = db.students.map(s => s.id === editingStudent.id ? { ...s, ...studentForm, avatar: initials } : s);
      persistDB({ ...db, students: updated });
      notify("Student updated!");
    } else {
      const newStudent = {
        id: Date.now(), ...studentForm, avatar: initials,
        score: 0, quizzesTaken: 0, lastActive: new Date().toISOString().split("T")[0],
        joined: new Date().toISOString().split("T")[0],
      };
      persistDB({ ...db, students: [...db.students, newStudent] });
      notify("Student added!");
    }
    setStudentForm({ name: "", email: "", grade: "10A" });
    setEditingStudent(null);
    setShowAddStudent(false);
  };

  const handleDeleteStudent = (id) => {
    persistDB({ ...db, students: db.students.filter(s => s.id !== id) });
    notify("Student removed");
    setSelectedStudent(null);
  };

  // ── Quiz Builder ──────────────────────────────────────────────────────────
  const addQuestion = () => setQuestions([...questions, { q: "", options: ["", "", "", ""], answer: 0 }]);
  const removeQuestion = (i) => setQuestions(questions.filter((_, idx) => idx !== i));
  const updateQuestion = (i, field, value) => {
    const updated = [...questions];
    updated[i] = { ...updated[i], [field]: value };
    setQuestions(updated);
  };
  const updateOption = (qi, oi, value) => {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
  };

  const handleSaveQuiz = () => {
    if (!quizForm.title || !quizForm.subject) return notify("Fill quiz details", "error");
    if (questions.some(q => !q.q.trim())) return notify("Fill all questions", "error");
    const newQuiz = {
      id: Date.now(), ...quizForm,
      createdAt: new Date().toISOString().split("T")[0],
      questions,
    };
    persistDB({ ...db, quizzes: [...db.quizzes, newQuiz] });
    // Update student quiz counts
    const updatedStudents = db.students.map(s =>
      quizForm.assignedTo.includes(s.id) ? { ...s, quizzesTaken: s.quizzesTaken + 1 } : s
    );
    persistDB({ ...db, quizzes: [...db.quizzes, newQuiz], students: updatedStudents });
    setQuizForm({ title: "", subject: "", assignedTo: [] });
    setQuestions([{ q: "", options: ["", "", "", ""], answer: 0 }]);
    setShowQuizBuilder(false);
    notify("Quiz created & assigned!");
  };

  // ── Nav items ───────────────────────────────────────────────────────────────
  const navItems = [
    { id: "overview", icon: "⊞", label: "Overview" },
    { id: "students", icon: "👥", label: "Students" },
    { id: "quizzes", icon: "📝", label: "Quizzes" },
    { id: "progress", icon: "📈", label: "Progress" },
    {id:"AI Insights", icon:"🤖", label:"AI Insights"}
  ];

  return (
    <div className="min-h-screen flex font-sans" style={{ background: "linear-gradient(135deg, #0b3d2e 0%, #062a45 100%)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        .glass { background: rgba(255,255,255,0.06); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.1); }
        .glass-dark { background: rgba(0,0,0,0.2); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); }
        .glow-green { box-shadow: 0 0 24px rgba(52,211,153,0.25); }
        .glow-blue { box-shadow: 0 0 24px rgba(34,211,238,0.2); }
        .syne { font-family: 'Syne', sans-serif; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.3); border-radius: 4px; }
        .tab-active { background: linear-gradient(90deg, rgba(52,211,153,0.2), rgba(34,211,238,0.15)); border-left: 3px solid #34d399; }
        .card-hover { transition: all 0.25s; } .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
        input, select, textarea { outline: none; }
        .score-ring { position: relative; display: inline-flex; align-items: center; justify-content: center; }
      `}</style>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col glass-dark transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg glow-green">T</div>
            <div>
              <p className="syne text-white font-bold text-sm leading-tight">EduBoard</p>
              <p className="text-emerald-400 text-xs">Teacher Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id ? "tab-active text-emerald-300" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="glass rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-sm font-bold">MR</div>
            <div>
              <p className="text-white text-xs font-semibold">Mr. Roberts</p>
              <p className="text-white/40 text-xs">Science Dept.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="glass-dark border-b border-white/10 px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="syne text-white font-bold text-lg lg:text-xl">
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-white/40 text-xs hidden sm:block">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            {activeTab === "students" && (
              <button onClick={() => { setShowAddStudent(true); setEditingStudent(null); setStudentForm({ name: "", email: "", grade: "10A" }); }}
                className="px-3 lg:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs lg:text-sm font-semibold hover:opacity-90 transition glow-green">
                + Add Student
              </button>
            )}
            {activeTab === "quizzes" && (
              <button onClick={() => setShowQuizBuilder(true)}
                className="px-3 lg:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs lg:text-sm font-semibold hover:opacity-90 transition glow-green">
                + New Quiz
              </button>
            )}
          </div>
        </header>

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl transition-all ${notification.type === "error" ? "bg-red-500/90" : "bg-emerald-500/90"}`}>
            {notification.msg}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">

          {/* ═══════════════ OVERVIEW TAB ═══════════════ */}
          {activeTab === "overview" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Students", value: db.students.length, icon: "👥", color: "from-emerald-500 to-teal-600" },
                  { label: "Quizzes Created", value: totalQuizzes, icon: "📝", color: "from-cyan-500 to-blue-600" },
                  { label: "Avg. Score", value: `${avgScore}%`, icon: "🎯", color: "from-teal-500 to-cyan-600" },
                  { label: "Active Today", value: db.students.filter(s => s.lastActive === new Date().toISOString().split("T")[0]).length, icon: "⚡", color: "from-emerald-400 to-cyan-500" },
                ].map((stat, i) => (
                  <div key={i} className="glass rounded-2xl p-4 lg:p-5 card-hover">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl mb-3`}>{stat.icon}</div>
                    <p className="syne text-white text-2xl lg:text-3xl font-bold">{stat.value}</p>
                    <p className="text-white/50 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Top Performers + Recent Quizzes */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-5">
                  <h2 className="syne text-white font-bold mb-4 flex items-center gap-2">🏆 Top Performers</h2>
                  <div className="space-y-3">
                    {[...db.students].sort((a, b) => b.score - a.score).slice(0, 4).map((s, i) => {
                      const g = getGrade(s.score);
                      return (
                        <div key={s.id} className="flex items-center gap-3">
                          <span className="text-white/30 text-sm w-4 font-mono">{i + 1}</span>
                          <Avatar initials={s.avatar} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{s.name}</p>
                            <ProgressBar value={s.score} />
                          </div>
                          <span className={`text-sm font-bold ${g.color}`}>{s.score}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass rounded-2xl p-5">
                  <h2 className="syne text-white font-bold mb-4 flex items-center gap-2">📋 Recent Quizzes</h2>
                  <div className="space-y-3">
                    {[...db.quizzes].reverse().slice(0, 4).map(quiz => (
                      <div key={quiz.id} className="glass-dark rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-semibold">{quiz.title}</p>
                          <p className="text-white/40 text-xs">{quiz.subject} · {quiz.questions.length} Qs · {quiz.createdAt}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-medium">
                          {quiz.assignedTo.length} students
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Class Score Distribution */}
              <div className="glass rounded-2xl p-5">
                <h2 className="syne text-white font-bold mb-4">📊 Score Distribution</h2>
                <div className="flex items-end gap-2 h-24">
                  {["90-100", "80-89", "70-79", "60-69", "Below 60"].map((range, i) => {
                    const [min, max] = range === "Below 60" ? [0, 59] : range.split("-").map(Number);
                    const count = db.students.filter(s => s.score >= min && s.score <= (max || 100)).length;
                    const height = db.students.length ? (count / db.students.length) * 100 : 0;
                    const colors = ["from-emerald-400 to-emerald-500", "from-teal-400 to-teal-500", "from-cyan-400 to-cyan-500", "from-blue-400 to-blue-500", "from-indigo-400 to-indigo-500"];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-white/60 text-xs">{count}</span>
                        <div className={`w-full rounded-t-lg bg-gradient-to-t ${colors[i]} transition-all`} style={{ height: `${Math.max(height, 8)}%` }} />
                        <span className="text-white/40 text-xs hidden sm:block">{range}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ STUDENTS TAB ═══════════════ */}
          {activeTab === "students" && (
            <>
              {/* Student Detail Modal */}
              {selectedStudent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
                  <div className="glass rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-4 mb-5">
                      <Avatar initials={selectedStudent.avatar} size="lg" />
                      <div>
                        <h3 className="syne text-white text-xl font-bold">{selectedStudent.name}</h3>
                        <p className="text-emerald-400 text-sm">{selectedStudent.email}</p>
                        <p className="text-white/40 text-xs">Grade {selectedStudent.grade}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[["Score", `${selectedStudent.score}%`], ["Quizzes", selectedStudent.quizzesTaken], ["Grade", getGrade(selectedStudent.score).label]].map(([l, v], i) => (
                        <div key={i} className="glass-dark rounded-xl p-3 text-center">
                          <p className="text-white font-bold text-lg">{v}</p>
                          <p className="text-white/40 text-xs">{l}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mb-5">
                      <div className="flex justify-between text-xs text-white/50 mb-1"><span>Progress</span><span>{selectedStudent.score}%</span></div>
                      <ProgressBar value={selectedStudent.score} />
                    </div>
                    <p className="text-white/40 text-xs mb-5">Joined: {selectedStudent.joined} · Last active: {selectedStudent.lastActive}</p>
                    <div className="flex gap-3">
                      <button onClick={() => { setEditingStudent(selectedStudent); setStudentForm({ name: selectedStudent.name, email: selectedStudent.email, grade: selectedStudent.grade }); setShowAddStudent(true); setSelectedStudent(null); }}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition">Edit</button>
                      <button onClick={() => handleDeleteStudent(selectedStudent.id)}
                        className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition">Remove</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Students Grid */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {db.students.map(student => {
                  const g = getGrade(student.score);
                  return (
                    <div key={student.id} className="glass rounded-2xl p-5 card-hover cursor-pointer" onClick={() => setSelectedStudent(student)}>
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar initials={student.avatar} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">{student.name}</p>
                          <p className="text-white/40 text-xs truncate">{student.email}</p>
                        </div>
                        <span className={`text-sm font-bold px-2 py-0.5 rounded-lg bg-white/10 ${g.color}`}>{g.label}</span>
                      </div>
                      <div className="flex justify-between text-xs text-white/50 mb-2">
                        <span>Score: <span className="text-white font-semibold">{student.score}%</span></span>
                        <span>{student.quizzesTaken} quizzes</span>
                      </div>
                      <ProgressBar value={student.score} />
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400">Grade {student.grade}</span>
                        <span className="text-white/30 text-xs">Active {student.lastActive}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ═══════════════ QUIZZES TAB ═══════════════ */}
          {activeTab === "quizzes" && (
            <>
              {/* Quiz Detail Modal (Teacher sees answers) */}
              {selectedQuiz && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedQuiz(null)}>
                  <div className="glass rounded-2xl p-6 w-full max-w-2xl my-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="syne text-white text-xl font-bold">{selectedQuiz.title}</h3>
                        <p className="text-emerald-400 text-sm">{selectedQuiz.subject} · Created {selectedQuiz.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                        🔑 Answer Key
                      </div>
                    </div>
                    <p className="text-white/40 text-xs mb-5">
                      Assigned to: {selectedQuiz.assignedTo.map(id => db.students.find(s => s.id === id)?.name).filter(Boolean).join(", ")}
                    </p>
                    <div className="space-y-5">
                      {selectedQuiz.questions.map((q, qi) => (
                        <div key={qi} className="glass-dark rounded-xl p-4">
                          <p className="text-white font-medium mb-3 text-sm">Q{qi + 1}. {q.q}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${oi === q.answer ? "bg-emerald-500/25 border border-emerald-400/40 text-emerald-300" : "bg-white/5 text-white/50"}`}>
                                {oi === q.answer && <span className="text-emerald-400 font-bold">✓</span>}
                                <span className="font-medium mr-1 text-white/30">{["A", "B", "C", "D"][oi]}.</span>
                                {opt}
                              </div>
                            ))}
                          </div>
                          <p className="text-emerald-400 text-xs mt-2 font-semibold">✓ Correct: {["A", "B", "C", "D"][q.answer]}. {q.options[q.answer]}</p>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setSelectedQuiz(null)} className="mt-5 w-full py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition">Close</button>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {db.quizzes.map(quiz => (
                  <div key={quiz.id} className="glass rounded-2xl p-5 card-hover">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-xl">📝</div>
                      <span className="text-xs text-white/40">{quiz.createdAt}</span>
                    </div>
                    <h3 className="syne text-white font-bold mb-1">{quiz.title}</h3>
                    <p className="text-white/50 text-sm mb-4">{quiz.subject}</p>
                    <div className="flex items-center justify-between text-xs text-white/40 mb-4">
                      <span>📖 {quiz.questions.length} questions</span>
                      <span>👥 {quiz.assignedTo.length} students</span>
                    </div>
                    <button onClick={() => setSelectedQuiz(quiz)}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/20 text-emerald-300 text-sm font-semibold hover:from-emerald-500/30 hover:to-cyan-500/30 transition">
                      🔑 View with Answers
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══════════════ PROGRESS TAB ═══════════════ */}
          {activeTab === "progress" && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-5">
                <h2 className="syne text-white font-bold mb-5 text-lg">All Students — Detailed Progress</h2>
                <div className="space-y-4">
                  {[...db.students].sort((a, b) => b.score - a.score).map((student, i) => {
                    const g = getGrade(student.score);
                    return (
                      <div key={student.id} className="glass-dark rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-white/20 font-mono text-sm w-5">{i + 1}</span>
                          <Avatar initials={student.avatar} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm">{student.name}</p>
                            <p className="text-white/40 text-xs">Grade {student.grade} · {student.quizzesTaken} quizzes taken</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${g.color}`}>{student.score}%</p>
                            <p className="text-white/30 text-xs">{g.label}</p>
                          </div>
                        </div>
                        <ProgressBar value={student.score} color={student.score >= 80 ? "from-emerald-400 to-cyan-400" : student.score >= 70 ? "from-cyan-400 to-blue-400" : "from-yellow-400 to-orange-400"} />
                        <div className="flex justify-between mt-2">
                          <span className="text-white/30 text-xs">Last active: {student.lastActive}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${student.score >= 80 ? "bg-emerald-500/20 text-emerald-400" : student.score >= 70 ? "bg-cyan-500/20 text-cyan-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                            {student.score >= 80 ? "On Track" : student.score >= 70 ? "Average" : "Needs Help"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ═══════════════ ADD/EDIT STUDENT MODAL ═══════════════ */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={() => setShowAddStudent(false)}>
          <div className="glass rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="syne text-white text-xl font-bold mb-5">{editingStudent ? "Edit Student" : "Add New Student"}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-xs font-medium mb-1.5 block">Full Name *</label>
                <input value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full glass-dark rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:border-emerald-400/50 border border-white/10 transition"
                  placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="text-white/60 text-xs font-medium mb-1.5 block">Email Address *</label>
                <input type="email" value={studentForm.email} onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="w-full glass-dark rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 border border-white/10 transition"
                  placeholder="student@school.edu" />
              </div>
              <div>
                <label className="text-white/60 text-xs font-medium mb-1.5 block">Class / Grade</label>
                <select value={studentForm.grade} onChange={e => setStudentForm({ ...studentForm, grade: e.target.value })}
                  className="w-full glass-dark rounded-xl px-4 py-3 text-white text-sm border border-white/10 bg-transparent">
                  {["10A", "10B", "11A", "11B", "12A", "12B"].map(g => <option key={g} value={g} className="bg-gray-800">{g}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddStudent(false)} className="flex-1 py-3 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/15 transition">Cancel</button>
              <button onClick={handleSaveStudent} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition glow-green">
                {editingStudent ? "Save Changes" : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ QUIZ BUILDER MODAL ═══════════════ */}
      {showQuizBuilder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass rounded-2xl p-6 w-full max-w-2xl my-4" onClick={e => e.stopPropagation()}>
            <h3 className="syne text-white text-xl font-bold mb-5">📝 Create New Quiz</h3>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-white/60 text-xs font-medium mb-1.5 block">Quiz Title *</label>
                <input value={quizForm.title} onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                  className="w-full glass-dark rounded-xl px-4 py-2.5 text-white text-sm border border-white/10 placeholder-white/20"
                  placeholder="e.g. Chapter 3 Review" />
              </div>
              <div>
                <label className="text-white/60 text-xs font-medium mb-1.5 block">Subject *</label>
                <input value={quizForm.subject} onChange={e => setQuizForm({ ...quizForm, subject: e.target.value })}
                  className="w-full glass-dark rounded-xl px-4 py-2.5 text-white text-sm border border-white/10 placeholder-white/20"
                  placeholder="e.g. Mathematics" />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-white/60 text-xs font-medium mb-2 block">Assign to Students</label>
              <div className="flex flex-wrap gap-2">
                {db.students.map(s => (
                  <button key={s.id}
                    onClick={() => setQuizForm(prev => ({ ...prev, assignedTo: prev.assignedTo.includes(s.id) ? prev.assignedTo.filter(id => id !== s.id) : [...prev.assignedTo, s.id] }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${quizForm.assignedTo.includes(s.id) ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/40" : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"}`}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5 mb-5">
              {questions.map((q, qi) => (
                <div key={qi} className="glass-dark rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-emerald-400 text-xs font-semibold">Question {qi + 1}</span>
                    {questions.length > 1 && (
                      <button onClick={() => removeQuestion(qi)} className="text-red-400/70 hover:text-red-400 text-xs">✕ Remove</button>
                    )}
                  </div>
                  <input value={q.q} onChange={e => updateQuestion(qi, "q", e.target.value)}
                    className="w-full bg-white/5 rounded-lg px-3 py-2 text-white text-sm border border-white/10 placeholder-white/20 mb-3"
                    placeholder="Enter your question..." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <span className="text-white/30 text-xs font-mono">{["A", "B", "C", "D"][oi]}.</span>
                        <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)}
                          className="flex-1 bg-white/5 rounded-lg px-3 py-1.5 text-white text-sm border border-white/10 placeholder-white/20"
                          placeholder={`Option ${["A", "B", "C", "D"][oi]}`} />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-xs">Correct answer:</span>
                    {["A", "B", "C", "D"].map((l, oi) => (
                      <button key={oi} onClick={() => updateQuestion(qi, "answer", oi)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition ${q.answer === oi ? "bg-emerald-500 text-white" : "bg-white/10 text-white/50 hover:bg-white/20"}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addQuestion} className="w-full py-2.5 rounded-xl border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 text-sm transition mb-5">
              + Add Question
            </button>

            <div className="flex gap-3">
              <button onClick={() => setShowQuizBuilder(false)} className="flex-1 py-3 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/15 transition">Cancel</button>
              <button onClick={handleSaveQuiz} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition glow-green">
                Create Quiz
              </button>
            </div>
          </div>
        </div>
      )}
      {
        activeTab === "AI Insights" && (
            <AI />
        )
      }
    </div>
  );
}