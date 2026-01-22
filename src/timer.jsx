import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import intro from "./assets/video.mp4";
import ad1 from "./assets/add1.mp4";
import ad2 from "./assets/add2.mp4";
import ad3 from "./assets/add3.mp4";
import ad4 from "./assets/add4.mp4";
import socket from "./socket";
import header from "./assets/header.png";

// Ad videos array
const AD_VIDEOS = [ad1, ad2, ad3, ad4];
const AD_INTERVAL = 1 * 60 * 1000; // 15 minutes in milliseconds

// --- CELEBRATION COMPONENT ---
function CelebrationActivated({ show }) {
  if (!show) return null;

  return (
    <div className="celebration-overlay">
      {/* Confetti */}
      {[...Array(50)].map((_, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random()}s`,
            background: Math.random() > 0.5 ? "#3b82f6" : "#22d3ee"
          }}
        />
      ))}

      {/* Sparkles */}
      {[...Array(25)].map((_, i) => (
        <span
          key={`s-${i}`}
          className="sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random()}s`
          }}
        />
      ))}

      {/* Center Message */}
      <div className="success-box">
        <div className="success-icon">✓</div>
        <h2>CODEFUSION ACTIVATED</h2>
        <p>Timer Started</p>
      </div>

      <style>{`
        .celebration-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,20,0.92);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Confetti */
        .confetti {
          position: absolute;
          top: -10px;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          animation: fall 2.8s linear forwards;
          will-change: transform;
        }

        @keyframes fall {
          to {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Sparkles */
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #60a5fa;
          animation: sparkle 1.8s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%,100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(2); }
        }

        /* Center Box */
        .success-box {
          z-index: 10;
          text-align: center;
          font-family: 'Orbitron', monospace;
          animation: zoomIn 0.5s ease-out;
        }

        @keyframes zoomIn {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-icon {
          width: 90px;
          height: 90px;
          margin: auto;
          border-radius: 50%;
          background: linear-gradient(135deg,#2563eb,#22d3ee);
          color: white;
          font-size: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-box h2 {
          margin-top: 1rem;
          font-size: 2rem;
          color: white;
          letter-spacing: 0.12em;
        }

        .success-box p {
          margin-top: 0.4rem;
          font-size: 1rem;
          color: #93c5fd;
        }
      `}</style>
    </div>
  );
}


// --- INTRO ANIMATION ---
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

// --- AD BREAK COMPONENT ---
function AdBreak({ videoSrc, show, onFinish }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (show && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;   // ⬅️ reset
      video.loop = false;      // ⬅️ NO LOOP
      video.play().catch(() => {});
    }
  }, [show, videoSrc]);

  const handleEnded = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    onFinish(); // ⬅️ return to countdown
  };

  return (
    <div className={`fixed inset-0 z-50 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <video
        ref={videoRef}
        onEnded={handleEnded}
        className="w-full h-full object-cover bg-black"
        playsInline
        muted
        preload="auto"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="absolute top-4 right-4 bg-black/70 text-cyan-400 px-4 py-2 rounded-full">
        AD BREAK
      </div>
    </div>
  );
}


// --- CIRCULAR TIMER COMPONENT ---
function Countdown({ startTime, show, onAdBreak }) {
  const [timeLeft, setTimeLeft] = useState({ hrs: 0, mins: 0, secs: 0 });
  const [isEnded, setIsEnded] = useState(false);
  const lastAdCheckRef = useRef(0);

  const CIRCUMFERENCE = 339.292;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - new Date(startTime).getTime();
      const remaining = (24 * 60 * 60 * 1000) - elapsed;

      if (remaining <= 0) {
        setIsEnded(true);
        setTimeLeft({ hrs: 0, mins: 0, secs: 0 });
        return;
      }

      // Check for ad break every 15 minutes (starting from 15 min, not 0)
      // currentAdSlot will be: 0 at 0-14:59, 1 at 15:00-29:59, 2 at 30:00-44:59, etc.
      const currentAdSlot = Math.floor(elapsed / AD_INTERVAL);
      
      // Trigger ad when we enter a new 15-min slot (but not at slot 0, which is first 15 minutes)
      if (currentAdSlot > 0 && currentAdSlot > lastAdCheckRef.current && currentAdSlot <= AD_VIDEOS.length) {
        lastAdCheckRef.current = currentAdSlot;
        // Pick random ad from available videos
        const randomAdIndex = Math.floor(Math.random() * AD_VIDEOS.length);
        onAdBreak(randomAdIndex);
      }

      const hrs = Math.floor(remaining / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);

      setTimeLeft({ hrs, mins, secs });
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, onAdBreak]);

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
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <img
            src={header}
            alt="CODEFUSION 2026"
            className="
              ml-6 md:ml-10 lg:ml-14
              w-[360px] md:w-[560px] lg:w-[760px]
            "
          />

          <div className="h-1 w-24 md:w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>

        {/* Circular Timers Container */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-16 items-center mt-8 md:mt-12">
          
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

      {/* Fullscreen Toggle Button */}
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

// --- START SCREEN ---
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
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl group-hover:from-cyan-500/40 group-hover:to-blue-500/40 transition-all duration-300"></div>
          
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

// --- MAIN APP ---
export default function App() {
  const CELEBRATION_DURATION = 4000; // 4 seconds celebration
  
  const [stage, setStage] = useState('start'); // 'start', 'intro', 'celebration', 'ad', 'countdown'
  const [rawStartTime, setRawStartTime] = useState(null);
  const [countdownStartTime, setCountdownStartTime] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Socket listeners
  useEffect(() => {
    socket.emit("join-room", "it");

    socket.on("START_EVENT", ({ startTime }) => {
      console.log("🔥 START_EVENT received", startTime);
      const backendTime = new Date(startTime);
      
      setRawStartTime(backendTime);
      setCountdownStartTime(
        new Date(backendTime.getTime() + CELEBRATION_DURATION)
      );
      setStage("intro");
    });

    socket.on("SYNC_RUNNING", ({ startTime }) => {
      console.log("🔄 SYNC_RUNNING received", startTime);
      const backendTime = new Date(startTime);
      
      setRawStartTime(backendTime);
      setCountdownStartTime(
        new Date(backendTime.getTime() + CELEBRATION_DURATION)
      );
      setStage("countdown");
    });

    socket.on("RESET_EVENT", () => {
      console.log("🔄 RESET_EVENT received");
      setStage("start");
      setRawStartTime(null);
      setCountdownStartTime(null);
      setCurrentAdIndex(0);
    });

    return () => {
      socket.off("connect");
      socket.off("START_EVENT");
      socket.off("SYNC_RUNNING");
      socket.off("RESET_EVENT");
    };
  }, [CELEBRATION_DURATION]);

  const handleStart = () => {
    console.log("▶️ Start clicked");
    socket.emit("START_REQUEST","it");

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

  const handleAdBreak = (adSlot) => {
    console.log("📺 Ad break triggered:", adSlot);
    setCurrentAdIndex(adSlot);
    setStage('ad');
  };

  const handleAdFinish = () => {
    console.log("📺 Ad finished, returning to countdown");
    setStage('countdown');
  };

  // Auto-transition from celebration
  useEffect(() => {
    if (stage === 'celebration') {
      const timer = setTimeout(handleCelebrationFinish, CELEBRATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [stage, CELEBRATION_DURATION]);

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

      <AdBreak
        videoSrc={AD_VIDEOS[currentAdIndex]}
        show={stage === 'ad'}
        onFinish={handleAdFinish}
      />

      {(stage === 'countdown') && countdownStartTime && (
        <Countdown 
          startTime={countdownStartTime}
          show={stage === 'countdown'}
          onAdBreak={handleAdBreak}
        />
      )}

    </div>
  );
}