import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 px-4">
      {/* Header: Research Conclave 2025 */}
      <div className="text-center">
        <p
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 mb-1"
          style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.08em' }}
        >
          RESEARCH CONCLAVE 2025
        </p>
      </div>

      {/* Subheader: CodeFusion */}
      <div className="text-center mb-4">
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 drop-shadow-lg"
          style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.12em' }}
        >
          CODEFUSION
        </h1>
      </div>

      {/* Two Timer Buttons */}
      <div className="flex flex-col md:flex-row gap-12 items-center justify-center w-full max-w-4xl">
        {/* IT Timer Button */}
        <button
          onClick={() => navigate("/it-timer")}
          className="relative px-10 py-4 text-xl md:text-2xl font-bold text-white bg-transparent border-2 border-cyan-500 rounded-full overflow-hidden transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] cursor-pointer group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <div className="relative flex items-center justify-center">
            <span style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.05em' }}>
              IT TIMER
            </span>
          </div>
        </button>

        {/* CSE Timer Button */}
        <button
          onClick={() => navigate("/cse-timer")}
          className="relative px-10 py-4 text-xl md:text-2xl font-bold text-white bg-transparent border-2 border-purple-500 rounded-full overflow-hidden transition-all duration-300 hover:border-purple-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] cursor-pointer group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <div className="relative flex items-center justify-center">
            <span style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.05em' }}>
              CSE TIMER
            </span>
          </div>
        </button>
        {/* ECE TIMER */}
        <button
          onClick={() => navigate("/ecetimer")}
          className="relative px-10 py-4 text-xl md:text-2xl font-bold text-white bg-transparent border-2 border-green-500 rounded-full overflow-hidden transition-all duration-300 hover:border-green-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] cursor-pointer group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <span style={{ fontFamily: "Orbitron, monospace", letterSpacing: "0.05em" }}>
            ECE TIMER
          </span>
        </button>
      </div>
    </div>
  );
}

export default Home;