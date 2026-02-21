import { useState } from "react";

function AI() {
  const [userCommand, setUserCommand] = useState("");
  const [AICommand, setAICommand] = useState("");

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-emerald-400 to-cyan-500 flex flex-col items-center px-4 py-6 gap-4 overflow-y-auto">
      
      {/* Assistant image */}
      <div className="w-56 h-72 sm:w-64 sm:h-80 lg:w-72 lg:h-96 rounded-3xl overflow-hidden shadow-xl">
        <img
          src="https://png.pngtree.com/png-vector/20250321/ourlarge/pngtree-a-futuristic-ai-assistant-with-glowing-digital-face-png-image_15826839.png"
          alt="Assistant"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Welcome text */}
      <h1 className="text-white text-lg sm:text-xl font-semibold text-center">
        Welcome to your Assistant,
        <span className="text-blue-700 ml-1">Alex</span>
      </h1>

      {/* Command text */}
      <h1 className="text-white text-base sm:text-lg text-center px-2">
        {userCommand || AICommand || "Say something to start..."}
      </h1>
    </div>
  );
}

export default AI;