import React, { useMemo, useEffect } from "react";

const GlobalBackground = () => {
  useEffect(() => {
    const styleId = "global-bg-animations";
    
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();
    
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes flowFullScreen {
        0% { left: -5%; opacity: 0; }
        5% { opacity: 0.9; }
        95% { opacity: 0.9; }
        100% { left: 105%; opacity: 0; }
      }

      @keyframes fastFullScreen {
        0% { left: -3%; opacity: 0; }
        10% { opacity: 0.7; }
        90% { opacity: 0.7; }
        100% { left: 103%; opacity: 0; }
      }

      @keyframes pulseAndMove {
        0%, 100% { transform: scale(1); filter: brightness(1); }
        50% { transform: scale(1.2); filter: brightness(1.3); }
      }

      @keyframes randomMove {
        0% { transform: translate(0, 0); }
        25% { transform: translate(18px, -12px); }
        50% { transform: translate(-25px, 22px); }
        75% { transform: translate(12px, -18px); }
        100% { transform: translate(0, 0); }
      }

      @keyframes liquidBlob {
        0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        25% { transform: translate(15px, -25px) scale(1.1); opacity: 0.5; }
        50% { transform: translate(-20px, 30px) scale(0.9); opacity: 0.4; }
        75% { transform: translate(25px, -15px) scale(1.05); opacity: 0.5; }
        100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
      }

      @keyframes orbitPath {
        0% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(40px, -40px) scale(1.1); }
        50% { transform: translate(0, -60px) scale(0.9); }
        75% { transform: translate(-40px, -30px) scale(1.05); }
        100% { transform: translate(0, 0) scale(1); }
      }

      @keyframes slowFloatLeft {
        0% { left: 105%; opacity: 0; }
        5% { opacity: 0.8; }
        95% { opacity: 0.8; }
        100% { left: -5%; opacity: 0; }
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  const circuitNodes = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * 4 + 1.5,
        move: 8 + Math.random() * 12,
        delay: Math.random() * 5,
      })),
    []
  );

  const flowingDots = useMemo(
    () =>
      Array.from({ length: 200 }, (_, i) => ({
        id: i,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 1,
        speed: Math.random() * 15 + 8,
        delay: Math.random() * 8,
      })),
    []
  );

  const fastParticles = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        y: Math.random() * 100,
        speed: Math.random() * 6 + 4,
        delay: Math.random() * 10,
      })),
    []
  );

  const orbitingPoints = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 25 + 20,
        delay: Math.random() * 5,
      })),
    []
  );

  const blueBlobs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 150 + 100,
        opacity: Math.random() * 0.15 + 0.05,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden -z-10">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950 to-black" />

      {/* Blue Liquid Blobs */}
      <div className="absolute inset-0 opacity-40">
        {blueBlobs.map((b) => (
          <div
            key={`blob-${b.id}`}
            className="absolute bg-blue-500 rounded-full blur-3xl"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              opacity: b.opacity,
              animation: `liquidBlob ${b.duration}s ease-in-out infinite`,
              animationDelay: `${b.delay}s`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.25) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Circuit nodes */}
      <div className="absolute inset-0">
        {circuitNodes.map((n) => (
          <div
            key={n.id}
            className="absolute bg-blue-400 rounded-full"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              width: `${n.size}px`,
              height: `${n.size}px`,
              opacity: n.opacity,
              animation: `pulseAndMove ${n.pulse}s ease-in-out infinite, randomMove ${n.move}s linear infinite`,
              animationDelay: `${n.delay}s`,
              boxShadow:
                "0 0 8px rgba(59,130,246,.8), 0 0 16px rgba(37,99,235,.4)",
            }}
          />
        ))}
      </div>

      {/* Flowing dots */}
      <div className="absolute inset-0">
        {flowingDots.map((d) => (
          <div
            key={d.id}
            className="absolute bg-blue-400 rounded-full"
            style={{
              left: "-5%",
              top: `${d.y}%`,
              width: `${d.size}px`,
              height: `${d.size}px`,
              opacity: 0,
              animation: `flowFullScreen ${d.speed}s linear infinite`,
              animationDelay: `${d.delay}s`,
              boxShadow:
                "0 0 6px rgba(59,130,246,1), 0 0 12px rgba(37,99,235,.7)",
            }}
          />
        ))}
      </div>

      {/* Orbiting Points with Loops */}
      <div className="absolute inset-0">
        {orbitingPoints.map((o) => (
          <div
            key={`orbit-${o.id}`}
            className="absolute bg-blue-300 rounded-full"
            style={{
              left: `${o.x}%`,
              top: `${o.y}%`,
              width: `${o.size}px`,
              height: `${o.size}px`,
              opacity: 0.6,
              animation: `orbitPath ${o.duration}s ease-in-out infinite`,
              animationDelay: `${o.delay}s`,
              boxShadow: `0 0 ${o.size}px rgba(147,197,253,.9), inset 0 0 ${o.size / 2}px rgba(191,219,254,.5)`,
            }}
          />
        ))}
      </div>

      Fast particles
      <div className="absolute inset-0">
        {fastParticles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-cyan-400 rounded-full"
            style={{
              left: "-3%",
              top: `${p.y}%`,
              width: "1.5px",
              height: "1.5px",
              opacity: 0,
              animation: `fastFullScreen ${p.speed}s linear infinite`,
              animationDelay: `${p.delay}s`,
              boxShadow: "0 0 4px rgba(34,211,238,.8)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GlobalBackground;