import React from "react";
import Logo from "../assets/Logo.png"
import { useNavigate } from "react-router-dom";

export default function SignUp() {

  const nav = useNavigate();
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-500 px-4">

      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-2">
        
        {/* LEFT SIDE (Visible only on laptop+) */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-emerald-500 text-white p-10">
          
          <img
            src={Logo}
            alt="Government AI Logo"
            className="w-24 mb-6"
          />

          <h2 className="text-3xl font-bold mb-4 text-center">
             School AI Assistant
          </h2>

          <p className="text-center text-emerald-100">
            Empowering students and teachers with
            AI-powered smart learning solutions.
          </p>
        </div>

        {/* RIGHT SIDE (Signup Form) */}
        <div className="p-8 sm:p-10">
          
          <div className="text-center lg:text-left mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Register to access the AI platform
            </p>
          </div>

          <form className="space-y-4">
            
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />

            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <option>Student</option>
              <option>Teacher</option>
              <option>Administrator</option>
            </select>

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold transition"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <button onClick={() => nav("/signin")} className="text-emerald-600 hover:underline cursor-pointer">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}