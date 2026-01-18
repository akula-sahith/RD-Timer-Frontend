import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import intro from "./assets/intro.mp4";
import socket from "./socket";

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
      const start = startTime ? new Date(startTime).getTime() : now;
const elapsed = now - start;

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

      <div className="relative z-10 text-center space-y-12 px-4">
        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CODEFUSION
          </h1>
          <p className="text-2xl md:text-3xl text-blue-300 font-light tracking-widest">
            24 HOUR CHALLENGE
          </p>
          <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>

        <button
          onClick={onStart}
          className="group relative px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(59,130,246,0.6)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-3">
            <Play className="fill-current" size={28} />
            <span>START TIMER</span>
          </div>
        </button>

        <div className="flex items-center justify-center gap-3 text-blue-400/70">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-400/50"></div>
          <span className="text-sm tracking-wider">CLICK TO BEGIN</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-400/50"></div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP (Your Original Logic) ---
export default function App() {
  const [stage, setStage] = useState('start'); // 'start', 'intro', 'countdown'
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
    setStage('countdown');
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      {stage === 'start' && <StartScreen onStart={handleStart} />}
      <IntroAnimation 
        show={stage === 'intro'} 
        onFinish={handleIntroFinish} 
      />
      <Countdown 
        startTime={startTime || new Date()} 
        show={stage === 'countdown'} 
      />
    </div>
  );
}