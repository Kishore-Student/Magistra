import React from "react";
import Logo from "../assets/Logo.png"

export const InputField = ({ label, type = "text", placeholder, value, onChange, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
    />
  </div>
);

export const GradientText = ({ children }) => (
  <span
    style={{
      background: "linear-gradient(to right, #2563eb, #16a34a)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    }}
  >
    {children}
  </span>
);

export const GradientButton = ({ children, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    style={{ background: "linear-gradient(to right, #2563eb, #16a34a)" }}
    className="w-full py-3 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg hover:opacity-90 hover:shadow-xl transition-all duration-200 active:scale-95"
  >
    {children}
  </button>
);

export const BrainIcon = () => (
  <img width="60" height="60" src={Logo} viewBox="0 0 36 36" fill="none">
  </img>
);