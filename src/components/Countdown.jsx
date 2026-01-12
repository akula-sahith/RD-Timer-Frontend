import { useState, useEffect, useRef } from "react";
import { Maximize2 } from "lucide-react";
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

  useEffect(() => {
    if (show && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.log('Fullscreen failed:', err);
      });
    }
  }, [show]);

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

export default Countdown;