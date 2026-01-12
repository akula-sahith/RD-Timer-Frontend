import { useState, useEffect, useRef } from 'react';
import { Play, Maximize2 } from 'lucide-react';
import './App.css';
import intro from "./assets/intro.mp4";
import socket from "./socket";
// // Mock socket for demo - replace with your actual socket import
// const socket = {
//   on: (event, callback) => {
//     console.log(`Listening for: ${event}`);
//   },
//   off: (event) => {
//     console.log(`Stopped listening: ${event}`);
//   },
//   emit: (event, data) => {
//     console.log(`Emitting: ${event}`, data);
//   }
// };

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
        {/* Replace with your actual video source */}
        <source src={intro} type="video/mp4" />
      </video>
    </div>
  );
}

function Countdown({ startTime, show }) {
  const [time, setTime] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime.getTime();
      const remaining = (24 * 60 * 60 * 1000) - elapsed;

      if (remaining <= 0) {
        setTime("HACKATHON ENDED");
        return;
      }

      const hrs = Math.floor(remaining / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);

      setTime(
        `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 transition-opacity duration-1000 ${
        show ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.3),transparent_50%)]"></div>
      
      <div className="relative z-10 text-center space-y-8 px-4">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
            HACKATHON
          </h1>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-cyan-500/20 rounded-full animate-pulse"></div>
          <div className="relative text-8xl md:text-9xl font-mono font-bold text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] tracking-wider">
            {time}
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-blue-300 text-xl">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="font-light tracking-widest">TIME REMAINING</span>
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-blue-400/50 text-sm flex items-center gap-2">
        <Maximize2 size={16} />
        <span>Press ESC to exit fullscreen</span>
      </div>
    </div>
  );
}

function StartScreen({ onStart }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(30,58,138,0.4),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.3),transparent_50%)]"></div>
      
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 text-center space-y-12 px-4">
        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            HACKATHON
          </h1>
          <p className="text-2xl md:text-3xl text-blue-300 font-light tracking-widest">
            24 HOUR CHALLENGE
          </p>
          <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>

        <button
          onClick={onStart}
          className="group relative px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(34,211,238,0.5)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
    // document.documentElement.requestFullscreen().catch(err => {
    //   console.log("Fullscreen blocked:", err);
    // });
  };

  const handleIntroFinish = () => {
    setStage('countdown');
  };

  return (
    <>
      <StartScreen onStart={handleStart} />
      <IntroAnimation 
        show={stage === 'intro'} 
        onFinish={handleIntroFinish} 
      />
      <Countdown 
        startTime={startTime || new Date()} 
        show={stage === 'countdown'} 
      />
    </>
  );
}