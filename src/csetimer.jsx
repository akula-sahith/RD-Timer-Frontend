import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import intro from "./assets/video.mp4";
import socket from "./socket";

// --- CELEBRATION COMPONENT ---
function CelebrationActivated({ show }) {
  if (!show) return null;

  return (
    <div className="celebration-overlay">
      <div className="celebration-frame">
        {/* Confetti - Now varying shapes and sizes for better visual */}
        {[...Array(150)].map((_, i) => {
          const randomX = Math.random() * 400 - 200;
          const randomRotate = Math.random() * 1080;
          const size = Math.random() * 10 + 6; // Size between 6px and 16px
          const isCircle = Math.random() > 0.6; // 40% chance of being a circle
          const opacity = Math.random() * 0.5 + 0.5; // Varying opacity for depth

          return (
            <div
              key={`confetti-${i}`}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: isCircle ? '50%' : '3px',
                opacity: opacity,
                animationDelay: `${Math.random() * 2.5}s`,
                animationDuration: `${3.5 + Math.random() * 4}s`,
                "--random-x": randomX,
                "--random-rotate": randomRotate,
              }}
            />
          );
        })}

        {/* Sparkles - Updated to blue */}
        {[...Array(70)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `scale(${Math.random()})`, // Slight starting size variation
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Center Message - Updated to Blue Theme */}
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2 className="success-title">CODEFUSION ACTIVATED</h2>
          <p className="success-subtitle">Timer Started Successfully</p>
        </div>
      </div>

      {/* CSS STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

        .celebration-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 10, 30, 0.9); /* Darker blue-black background */
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.5s ease-out;
          font-family: 'Orbitron', sans-serif; /* Ensure font matches */
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .celebration-frame {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Radial gradient for depth centered on the message */
          background: radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
        }

        /* Confetti - Blue/Cyan Gradients */
        .confetti {
          position: absolute;
          top: -50px;
          /* Width/Height/Border-radius handled by inline styles now */
          background: linear-gradient(135deg, #3b82f6, #22d3ee); /* Blue to Cyan */
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); /* Blue glow */
          animation: confettiFall ease-out forwards;
          will-change: transform, opacity;
        }

        @keyframes confettiFall {
          0% {
            transform: translateX(0) rotate(0deg) scale(0.8);
          }
          100% {
            transform:
              translateX(calc(var(--random-x) * 2px)) /* Increased spread slightly */
              rotate(calc(var(--random-rotate) * 1deg))
              scale(1);
            top: 110%;
          }
        }

        /* Sparkle - Blue */
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #60a5fa; /* Bright Blue */
          border-radius: 50%;
          animation: sparkle-pulse 2s ease-in-out infinite;
          box-shadow: 0 0 15px rgba(96, 165, 250, 0.9); /* Bright blue glow */
        }

        @keyframes sparkle-pulse {
          0%,100% { transform: scale(0); opacity: 0; }
          50% { transform: scale(2.5); opacity: 1; } /* Slightly larger pulse */
        }

        /* Center Success */
        .success-message {
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          animation: zoomInEnrty 0.8s cubic-bezier(.34,1.56,.64,1), holdPause 2s ease-in-out 0.8s;
        }

        @keyframes zoomInEnrty {
          from { transform: scale(0.5); opacity: 0; filter: blur(10px); }
          to { transform: scale(1); opacity: 1; filter: blur(0); }
        }

        @keyframes holdPause {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1); opacity: 1; }
        }

        .success-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          /* Blue to Cyan Gradient */
          background: linear-gradient(135deg, #2563eb, #22d3ee);
          color: white;
          font-size: 4.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Strong Blue Shadow */
          box-shadow: 0 0 60px rgba(59, 130, 246, 0.7), inset 0 0 20px rgba(255,255,255,0.3);
          animation: iconPulse 2s infinite ease-in-out;
          border: 3px solid rgba(255,255,255,0.1);
        }

        @keyframes iconPulse {
          0%,100% { transform: scale(1); box-shadow: 0 0 60px rgba(59, 130, 246, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 80px rgba(59, 130, 246, 0.9); }
        }

        .success-title {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: #ffffff;
          /* Blue text shadow glow */
          text-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 10px rgba(59, 130, 246, 0.8);
          text-align: center;
        }

        .success-subtitle {
          font-size: 1.5rem;
          color: #93c5fd; /* Light blue text */
          text-align: center;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}

// --- INTRO ANIMATION (Your Original) ---
function IntroAnimation({ onFinish, show }) {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (show && videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video play failed:', err));
    }
  }, [show]);

  return (
    <div 
      className={`fixed inset-0 z-50 transition-opacity duration-1000 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <video
        ref={videoRef}
        onEnded={onFinish}
        className="w-full h-full object-cover bg-black"
        playsInline
        muted
      >
        <source src={intro} type="video/mp4" />
      </video>
    </div>
  );
}

// --- NEW CIRCULAR TIMER COMPONENT (Omnitrix Style + Codefusion Logic) ---
function Countdown({ startTime, show }) {
  // We store numbers now to drive the circles, not just a text string
  const [timeLeft, setTimeLeft] = useState({ hrs: 0, mins: 0, secs: 0 });
  const [isEnded, setIsEnded] = useState(false);
  const [displayStartTime, setDisplayStartTime] = useState('');
  const [displayEndTime, setDisplayEndTime] = useState('');

  // Circle Config (Radius 54)
  const CIRCUMFERENCE = 339.292;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      // YOUR ORIGINAL LOGIC: Calculate elapsed since start
      const elapsed = now - new Date(startTime).getTime();
      // YOUR ORIGINAL LOGIC: 24 Hour Countdown
      const remaining = (24 * 60 * 60 * 1000) - elapsed;

      if (remaining <= 0) {
        setIsEnded(true);
        setTimeLeft({ hrs: 0, mins: 0, secs: 0 });
        // Optional: Do not return here if you want it to sit at 00:00:00
        return;
      }

      // Calculate units for the circles
      const hrs = Math.floor(remaining / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);

      setTimeLeft({ hrs, mins, secs });
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Helper to animate the SVG stroke
  const calculateOffset = (value, maxValue) => {
    const progress = value / maxValue;
    return CIRCUMFERENCE - (CIRCUMFERENCE * progress);
  };

  return (
    <div 
      className={`fixed inset-0 flex flex-col items-center justify-center bg-transparent transition-opacity duration-1000 ${
        show ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen gap-6 p-4">
        
        {/* Header - Omnitrix Style */}
        <div className="space-y-4 text-center">
          <h1
            className="
              text-3xl md:text-5xl lg:text-6xl
              font-bold text-white
              ml-6 md:ml-10 lg:ml-14
            "
            style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.15em' }}
          >
            CODEFUSION 2026
          </h1>


          <div className="h-1 w-24 md:w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>

        {/* Circular Timers Container */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-16 items-center mt-8 md:mt-12">
          
          {/* SVG Definition for the Gradient (Blue/Cyan to match Codefusion) */}
          <svg width="0" height="0">
            <defs>
              <linearGradient id="codefusion-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>

          {/* HOURS */}
          <div className="flex flex-col items-center">
            <div className="circular-timer">
              <svg className="circular-progress" viewBox="0 0 120 120">
                <circle className="circular-bg" cx="60" cy="60" r="54" />
                <circle
                  className="circular-progress-bar"
                  cx="60" cy="60" r="54"
                  style={{ strokeDashoffset: calculateOffset(timeLeft.hrs, 24) }}
                />
              </svg>
              <div className="circular-value">{String(timeLeft.hrs).padStart(2, '0')}</div>
            </div>
            <span className="circular-label">HOURS</span>
          </div>

          {/* MINUTES */}
          <div className="flex flex-col items-center">
            <div className="circular-timer">
              <svg className="circular-progress" viewBox="0 0 120 120">
                <circle className="circular-bg" cx="60" cy="60" r="54" />
                <circle
                  className="circular-progress-bar"
                  cx="60" cy="60" r="54"
                  style={{ strokeDashoffset: calculateOffset(timeLeft.mins, 60) }}
                />
              </svg>
              <div className="circular-value">{String(timeLeft.mins).padStart(2, '0')}</div>
            </div>
            <span className="circular-label">MINUTES</span>
          </div>

          {/* SECONDS */}
          <div className="flex flex-col items-center">
            <div className="circular-timer">
              <svg className="circular-progress" viewBox="0 0 120 120">
                <circle className="circular-bg" cx="60" cy="60" r="54" />
                <circle
                  className="circular-progress-bar"
                  cx="60" cy="60" r="54"
                  style={{ strokeDashoffset: calculateOffset(timeLeft.secs, 60) }}
                />
              </svg>
              <div className="circular-value">{String(timeLeft.secs).padStart(2, '0')}</div>
            </div>
            <span className="circular-label">SECONDS</span>
          </div>

        </div>

        {/* Timer Running Status */}
        <div className="flex items-center justify-center gap-2 text-cyan-400 border border-cyan-500/50 rounded-full px-6 py-3 mt-8">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          <span className="text-base font-semibold" style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.05em' }}>Timer Running</span>
        </div>

        {/* Start and End Times */}
        <div className="text-center text-gray-400 text-xs md:text-sm mt-4 space-y-1">
          <div style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.02em' }}>Started: {new Date(startTime).toLocaleString()}</div>
          <div style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.02em' }}>Ends: {new Date(new Date(startTime).getTime() + 24 * 60 * 60 * 1000).toLocaleString()}</div>
        </div>

        {isEnded && (
           <div className="text-4xl md:text-6xl font-bold text-red-500 animate-pulse font-mono mt-4">
             TIME UP
           </div>
        )}
      </div>

      {/* Fullscreen Toggle Button - Omnitrix Style */}
      <button
        onClick={() => {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen().catch(err => {
              console.log("Fullscreen blocked:", err);
            });
          }
        }}
        className="fixed bottom-4 right-4 z-50 p-4 rounded-full border-2 border-cyan-500 bg-transparent hover:bg-cyan-500/10 transition-all duration-300 flex items-center justify-center w-16 h-16"
        title={document.fullscreenElement ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {!document.fullscreenElement ? (
          /* ENTER FULLSCREEN ICON */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-cyan-400"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M16 3h3a2 2 0 0 1 2 2v3" />
            <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        ) : (
          /* EXIT FULLSCREEN ICON */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-cyan-400"
          >
            <path d="M9 3v3a2 2 0 0 1-2 2H4" />
            <path d="M15 3v3a2 2 0 0 0 2 2h3" />
            <path d="M15 21v-3a2 2 0 0 1 2-2h3" />
            <path d="M9 21v-3a2 2 0 0 0-2-2H4" />
          </svg>
        )}
      </button>


      {/* STYLES FROM OMNITRIX TIMER (ADAPTED) */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;900&display=swap');
        
        .circular-timer {
          position: relative;
          width: 100px;
          height: 100px;
        }

        @media (min-width: 640px) {
          .circular-timer { width: 120px; height: 120px; }
        }

        @media (min-width: 768px) {
          .circular-timer { width: 140px; height: 140px; }
        }

        @media (min-width: 1024px) {
          .circular-timer { width: 160px; height: 160px; }
        }

        .circular-progress {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .circular-bg {
          fill: none;
          stroke: rgba(59, 130, 246, 0.2);
          stroke-width: 6;
        }

        .circular-progress-bar {
          fill: none;
          stroke: url(#codefusion-gradient);
          stroke-width: 6;
          stroke-linecap: round;
          stroke-dasharray: 339.292;
          transition: stroke-dashoffset 1s linear;
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
        }

        .circular-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Orbitron', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
        }

        @media (min-width: 640px) {
          .circular-value { font-size: 1.5rem; }
        }

        @media (min-width: 768px) {
          .circular-value { font-size: 1.75rem; }
        }

        @media (min-width: 1024px) {
          .circular-value { font-size: 2rem; }
        }

        .circular-label {
          font-family: 'Orbitron', monospace;
          margin-top: 0.75rem;
          font-size: 0.65rem;
          color: #60a5fa;
          letter-spacing: 0.2em;
          text-align: center;
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
        }

        @media (min-width: 640px) {
          .circular-label { font-size: 0.75rem; margin-top: 0.9rem; }
        }

        @media (min-width: 768px) {
          .circular-label { font-size: 0.85rem; margin-top: 1rem; }
        }

        @media (min-width: 1024px) {
          .circular-label { font-size: 0.9rem; margin-top: 1.5rem; }
        }
      `}</style>
    </div>
  );
}

// --- START SCREEN (Your Original) ---

function StartScreen({ onStart }) {
  const particles = React.useMemo(() => 
    [...Array(50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3
    })),
    []
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden">
      <div className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full animate-pulse"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 text-center space-y-16 px-4">
        <div className="space-y-6">
          <h1 
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white"
            style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.15em' }}
          >
            CODEFUSION
          </h1>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-400"
            style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.1em' }}
          >
            2026
          </h2>
          <div className="h-1 w-32 md:w-40 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>

        <div className="group relative inline-block">
          {/* Transparent glow background */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl group-hover:from-cyan-500/40 group-hover:to-blue-500/40 transition-all duration-300"></div>
          
          {/* Button */}
          <button
            onClick={onStart}
            className="relative px-10 py-4 text-xl md:text-2xl font-bold text-white bg-transparent border-2 border-cyan-500 rounded-full overflow-hidden transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <div className="relative flex items-center justify-center">
              <span style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.05em' }}>ACTIVATE</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP (Your Original Logic) ---
export default function App() {
  const [stage, setStage] = useState('start'); // 'start', 'intro', 'celebration', 'countdown'
  const [startTime, setStartTime] = useState(null);

  // Single useEffect for all socket listeners
  useEffect(() => {
    // Connection event
    socket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    // Start event - triggers intro animation
    socket.on("START_EVENT", ({ startTime }) => {
      console.log("🔥 START_EVENT received", startTime);
      setStartTime(new Date(startTime));
      setStage("intro");
    });

    // Sync event - for clients joining after start
    socket.on("SYNC_RUNNING", ({ startTime }) => {
      console.log("🔄 SYNC_RUNNING received", startTime);
      setStartTime(new Date(startTime));
      setStage("countdown");
    });

    // Reset event - returns to start screen
    socket.on("RESET_EVENT", () => {
      console.log("🔄 RESET_EVENT received");
      setStage("start");
      setStartTime(null);
    });

    // Cleanup all listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("START_EVENT");
      socket.off("SYNC_RUNNING");
      socket.off("RESET_EVENT");
    };
  }, []);

  const handleStart = () => {
    console.log("▶️ Start clicked");

    // Emit the correct event name that matches backend
    socket.emit("START_REQUEST");

    // Request fullscreen
    document.documentElement.requestFullscreen().catch(err => {
      console.log("Fullscreen blocked:", err);
    });
  };

  const handleIntroFinish = () => {
    setStage('celebration');
  };

  const handleCelebrationFinish = () => {
    setStage('countdown');
  };

  // Auto-transition from celebration after 8 seconds (2 sec pause + 6 sec animation)
  useEffect(() => {
    if (stage === 'celebration') {
      const timer = setTimeout(handleCelebrationFinish, 8000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <div className="w-screen h-screen overflow-hidden">
      {stage === 'start' && <StartScreen onStart={handleStart} />}
      <IntroAnimation 
        show={stage === 'intro'} 
        onFinish={handleIntroFinish} 
      />
      <CelebrationActivated 
        show={stage === 'celebration'} 
      />
      <Countdown 
        startTime={startTime || new Date()} 
        show={stage === 'countdown'} 
      />
    </div>
  );
}