import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignUp() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [classAssigned, setClassAssigned] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password || !role || !classAssigned) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/teachers/register",
        {
          name,
          email,
          password,
          role,          // MUST match backend enum
          classAssigned
        },
        { withCredentials: true }
      );
      toast.success("Registration successful! Please sign in.");
      nav("/signin");
    } catch (error) {
      console.log("Error during registration", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-500 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-10">
          <img
            src={Logo}
            alt="School AI Logo"
            className="w-24 mb-6 drop-shadow-lg"
          />
          <h2 className="text-3xl font-bold mb-4 text-center">
            School AI Assistant
          </h2>
          <p className="text-center text-emerald-100">
            Empowering teachers and students with AI-powered learning
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 mb-6">
            Register to access the AI platform
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            {/* Role */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-emerald-400 outline-none"
            >
              <option value="">Select Role</option>
              <option value="Teacher">Teacher</option>
              <option value="Administrator">Administrator</option>
            </select>

            {/* Class */}
            <select
              value={classAssigned}
              onChange={(e) => setClassAssigned(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-emerald-400 outline-none"
            >
              <option value="">Select Class</option>
              <option value="5">5th Class</option>
              <option value="6">6th Class</option>
              <option value="7">7th Class</option>
              <option value="8">8th Class</option>
              <option value="9">9th Class</option>
              <option value="10">10th Class</option>
            </select>

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-2 rounded-lg font-semibold hover:bg-emerald-600 transition"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <button
              onClick={() => nav("/signin")}
              className="text-emerald-600 font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}