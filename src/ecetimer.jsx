import React, { useState, useEffect, useRef } from 'react';

const Timer = () => {
  // Configuration
  const TIMER_DURATION = 24 * 60 * 60; // 24 hours
  const START_TIME_KEY = 'techembed_start_time';
  const TIMER_STARTED_KEY = 'techembed_timer_started';
  const CHECKED_CHECKPOINTS_KEY = 'techembed_checked_checkpoints';

  const [time, setTime] = useState(TIMER_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState(null);
  const [checkedCheckpoints, setCheckedCheckpoints] = useState(new Set());
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
   
  const intervalRef = useRef(null);
  const checkpointCheckRef = useRef(null);

  // Generate 10 checkpoints evenly distributed
  const checkpoints = React.useMemo(() => {
    const points = [];
    const totalMinutes = TIMER_DURATION / 60;
    const intervalMinutes = totalMinutes / 10;
    
    for (let i = 1; i <= 10; i++) {
      const minutesFromStart = Math.floor(intervalMinutes * i);
      points.push({
        id: i,
        minutesFromStart,
        message: `System Milestone ${i}/10 - Protocol Synced ⚡`
      });
    }
    
    return points;
  }, [TIMER_DURATION]);

  // Initialize timer from storage
  useEffect(() => {
    const savedStartTime = localStorage.getItem(START_TIME_KEY);
    const timerStarted = localStorage.getItem(TIMER_STARTED_KEY);
    const savedCheckpoints = localStorage.getItem(CHECKED_CHECKPOINTS_KEY);
    
    if (savedStartTime && timerStarted === 'true') {
      const start = parseInt(savedStartTime);
      setStartTime(start);
      setIsRunning(true);
      
      if (savedCheckpoints) {
        setCheckedCheckpoints(new Set(JSON.parse(savedCheckpoints)));
      }
      
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      const remaining = Math.max(0, TIMER_DURATION - elapsed);
      setTime(remaining);
      
      if (remaining === 0) {
        handleTimerComplete();
      }
    }
  }, [TIMER_DURATION]);

  // Save checked checkpoints
  useEffect(() => {
    if (checkedCheckpoints.size > 0) {
      localStorage.setItem(CHECKED_CHECKPOINTS_KEY, JSON.stringify([...checkedCheckpoints]));
    }
  }, [checkedCheckpoints]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    localStorage.removeItem(START_TIME_KEY);
    localStorage.removeItem(TIMER_STARTED_KEY);
    localStorage.removeItem(CHECKED_CHECKPOINTS_KEY);
    setCheckedCheckpoints(new Set());
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(TIMER_DURATION);
    setStartTime(null);
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (checkpointCheckRef.current) clearInterval(checkpointCheckRef.current);
    
    localStorage.removeItem(START_TIME_KEY);
    localStorage.removeItem(TIMER_STARTED_KEY);
    localStorage.removeItem(CHECKED_CHECKPOINTS_KEY);
    
    setCheckedCheckpoints(new Set());
    setShowAlarm(false);
    setCurrentAlarm(null);
  };

  // Timer countdown
  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, TIMER_DURATION - elapsed);
        
        setTime(remaining);
        
        if (remaining === 0) {
          handleTimerComplete();
        }
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isRunning, startTime, TIMER_DURATION]);

  // Audio enablement
  useEffect(() => {
    const enableAudio = () => {
      if (!audioEnabled) setAudioEnabled(true);
    };
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => window.addEventListener(event, enableAudio));
    return () => events.forEach(event => window.removeEventListener(event, enableAudio));
  }, [audioEnabled]);

  // Checkpoint checking
  useEffect(() => {
    if (!isRunning || !startTime) return;

    const checkCheckpoints = () => {
      const now = Date.now();
      const elapsedMinutes = Math.floor((now - startTime) / 1000 / 60);

      checkpoints.forEach((checkpoint) => {
        const checkpointKey = `checkpoint-${checkpoint.id}`;
        if (
          Math.abs(elapsedMinutes - checkpoint.minutesFromStart) <= 1 &&
          !checkedCheckpoints.has(checkpointKey)
        ) {
          triggerAlarm(checkpoint);
          setCheckedCheckpoints(prev => {
            const newSet = new Set(prev);
            newSet.add(checkpointKey);
            return newSet;
          });
        }
      });
    };

    checkCheckpoints();
    checkpointCheckRef.current = setInterval(checkCheckpoints, 30000);

    return () => {
      if (checkpointCheckRef.current) clearInterval(checkpointCheckRef.current);
    };
  }, [isRunning, startTime, checkedCheckpoints, checkpoints]);

  const triggerAlarm = (checkpoint) => {
    setCurrentAlarm(checkpoint);
    setShowAlarm(true);

    if (audioEnabled) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 1200; // Higher pitch for tech feel
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      // eslint-disable-next-line no-unused-vars
      } catch (_e) {
        console.log('Audio not supported');
      }
    }

    setTimeout(() => {
      setShowAlarm(false);
      setTimeout(() => setCurrentAlarm(null), 600);
    }, 8000);
  };

  const handleStart = () => {
    if (time > 0 && !isRunning) {
      setTransitionType('initializing');
      setIsTransitioning(true);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          const now = Date.now();
          setStartTime(now);
          setIsRunning(true);
          localStorage.setItem(START_TIME_KEY, now.toString());
          localStorage.setItem(TIMER_STARTED_KEY, 'true');
        }, 3000);
      }, 2000);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  };

  const { hours, minutes, seconds } = formatTime(time);

  const TechTransition = () => (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-blue-500/10 border-4 border-cyan-400 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute inset-0 flex items-center justify-center text-5xl">⚙️</div>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping"></div>
        <div className="absolute inset-2 rounded-full border border-blue-300/30 animate-pulse"></div>
      </div>
      <div className="text-cyan-400 font-semibold animate-pulse text-xl" style={{ fontFamily: '"Orbitron", monospace' }}>
        {transitionType === 'initializing' ? 'SYSTEM INITIALIZING...' : 'PAUSING PROCESS...'}
      </div>
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );

  const CelebrationAnimation = () => (
    <div className="celebration-overlay">
      <div className="celebration-frame">
        {[...Array(100)].map((_, i) => (
          <div
            key={`confetti-${i}`}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2 className="success-title">SYSTEM ONLINE</h2>
          <p className="success-subtitle">Timer Synchronization Complete</p>
        </div>
      </div>
    </div>
  );

  const HoneycombTransition = () => (
    <div className="honeycomb-container">
      {[...Array(40)].map((_, i) => (
        <div key={i} className="hexagon" style={{ animationDelay: `${Math.random() * 0.5}s` }} />
      ))}
    </div>
  );

  const NotificationOverlay = () => {
    if (!currentAlarm) return null;
    return (
      <div className={`notification-overlay ${showAlarm ? 'show' : 'hide'}`}>
        <HoneycombTransition />
        <div className="notification-content-wrapper">
          <div className="notification-header">
            <div className="notification-icon">💠</div>
            <h2 className="notification-title">CHECKPOINT REACHED</h2>
          </div>
          <div className="notification-body">
            <div className="checkpoint-display">Status {currentAlarm.id}/10</div>
            <p className="notification-message">{currentAlarm.message}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-transparent flex flex-col items-center justify-center relative p-4 overflow-hidden">
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
      
      {currentAlarm && <NotificationOverlay />}
      
      {isTransitioning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-transparent border border-cyan-500/50 rounded-xl p-8 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
            <TechTransition />
          </div>
        </div>
      )}

      {showCelebration && <CelebrationAnimation />}

      <div className={`main-timer-container ${showAlarm ? 'hide-timer' : ''}`}>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider text-center mb-12"
          style={{
            fontFamily: '"Orbitron", monospace',
            color: '#cffafe', // Pale cyan text
            textShadow: '0 0 20px rgba(34, 211, 238, 0.6)'
          }}
        >
          TECHEMBED OS
        </h1>
        
        <div className="flex flex-col items-center justify-center gap-12">
          <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 flex-wrap">
            {['HOURS', 'MINUTES', 'SECONDS'].map((label, idx) => {
              const value = [hours, minutes, seconds][idx];
              const maxVal = idx === 0 ? Math.floor(TIMER_DURATION / 3600) : 60;
              return (
                <div key={label} className="flex flex-col items-center">
                  <div className="circular-timer">
                    <svg className="circular-progress" viewBox="0 0 120 120">
                      <circle className="circular-bg" cx="60" cy="60" r="54" />
                      <circle
                        className="circular-progress-bar"
                        cx="60" cy="60" r="54"
                        style={{
                          strokeDashoffset: 339.292 - (339.292 * (parseInt(value) / maxVal))
                        }}
                      />
                    </svg>
                    <div className="circular-value">{value}</div>
                  </div>
                  <span className="circular-label">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center" style={{ marginTop: '3rem' }}>
          {!isRunning && (
            <button
              onClick={handleStart}
              disabled={time <= 0 || isTransitioning || isRunning}
              className="control-button-small"
            >
              Initialize Timer
            </button>
          )}
          {isRunning && (
            <div className="status-indicator">
              <span className="status-dot"></span>
              System Running
            </div>
          )}
          {!isRunning && (
            <button
              onClick={handleReset}
              disabled={isTransitioning}
              className="control-button-small reset-button"
            >
              Reset System
            </button>
          )}
        </div>
        
        {startTime && (
          <div className="timer-info">
            <p className="info-text">T-Start: {new Date(startTime).toLocaleTimeString()}</p>
            <p className="info-text">T-End: {new Date(startTime + TIMER_DURATION * 1000).toLocaleTimeString()}</p>
          </div>
        )}
      </div>

      <button onClick={toggleFullscreen} className="fullscreen-button">
        {isFullscreen ? '↙' : '↗'}
      </button>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;900&family=Roboto:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        /* Main Container Transparent */
        .min-h-screen {
          min-height: 100vh;
          background-color: transparent;
        }

        /* Celebration */
        .celebration-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .celebration-frame {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .confetti {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #22d3ee;
          top: -20px;
          animation: confettiFall ease-out forwards;
          box-shadow: 0 0 10px #22d3ee;
        }

        @keyframes confettiFall {
          0% { top: -20px; opacity: 1; }
          100% { top: 120%; opacity: 0; }
        }

        .success-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          animation: zoomIn 0.8s ease-out;
          z-index: 10;
        }

        @keyframes zoomIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 4px solid #22d3ee;
          color: #22d3ee;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.5);
        }

        .success-title {
          font-family: 'Orbitron', monospace;
          font-size: 3rem;
          color: #22d3ee;
          text-shadow: 0 0 20px rgba(34, 211, 238, 0.8);
          margin: 0;
        }

        .success-subtitle {
          font-family: 'Inter', sans-serif;
          color: #a5f3fc;
          font-size: 1.2rem;
        }

        /* Timers */
        .main-timer-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: opacity 0.5s;
        }

        .hide-timer {
          opacity: 0;
          pointer-events: none;
        }

        .circular-timer {
          position: relative;
          width: 140px;
          height: 140px;
        }

        .circular-bg {
          fill: none;
          stroke: rgba(34, 211, 238, 0.1);
          stroke-width: 6;
        }

        .circular-progress {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .circular-progress-bar {
          fill: none;
          stroke: url(#gradient);
          stroke-width: 6;
          stroke-linecap: round;
          stroke-dasharray: 339.292;
          transition: stroke-dashoffset 1s linear;
          filter: drop-shadow(0 0 4px #22d3ee);
        }

        .circular-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Orbitron', monospace;
          font-size: 2.5rem;
          color: #cffafe;
          text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
        }

        .circular-label {
          font-family: 'Orbitron', monospace;
          font-size: 0.9rem;
          color: #67e8f9;
          margin-top: 1rem;
          letter-spacing: 0.1em;
        }

        /* Controls */
        .control-button-small {
          padding: 0.8rem 2rem;
          font-family: 'Orbitron', monospace;
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid #22d3ee;
          color: #22d3ee;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .control-button-small:hover:not(:disabled) {
          background: rgba(34, 211, 238, 0.2);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.4);
        }
        
        .control-button-small:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .reset-button {
          border-color: #f87171;
          color: #f87171;
          background: rgba(248, 113, 113, 0.1);
        }

        .reset-button:hover:not(:disabled) {
          background: rgba(248, 113, 113, 0.2);
          box-shadow: 0 0 15px rgba(248, 113, 113, 0.4);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #22d3ee;
          font-family: 'Orbitron', monospace;
          padding: 0.5rem 1rem;
          border: 1px solid rgba(34, 211, 238, 0.3);
          background: rgba(34, 211, 238, 0.05);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #22d3ee;
          border-radius: 50%;
          box-shadow: 0 0 8px #22d3ee;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .timer-info {
          margin-top: 2rem;
          padding: 1rem;
          border-top: 1px solid rgba(34, 211, 238, 0.2);
          text-align: center;
        }

        .info-text {
          font-family: 'Inter', sans-serif;
          color: rgba(207, 250, 254, 0.7);
          font-size: 0.9rem;
          margin: 0.2rem;
        }

        /* Notification */
        .notification-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none; /* Let clicks pass through if needed, or set auto */
        }
        
        .notification-overlay.show {
           opacity: 1;
           pointer-events: auto;
        }
        
        .notification-overlay.hide {
           opacity: 0;
        }

        .notification-content-wrapper {
          background: rgba(8, 51, 68, 0.9);
          border: 1px solid #22d3ee;
          padding: 3rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 0 50px rgba(34, 211, 238, 0.2);
          backdrop-filter: blur(10px);
          animation: slideUp 0.5s ease-out;
          position: relative;
          z-index: 2;
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .notification-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 10px #22d3ee);
        }

        .notification-title {
          font-family: 'Orbitron', monospace;
          color: #22d3ee;
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .checkpoint-display {
          font-family: 'Orbitron', monospace;
          font-size: 1.5rem;
          color: #cffafe;
          margin-bottom: 0.5rem;
        }

        .notification-message {
          font-family: 'Roboto', sans-serif;
          color: #a5f3fc;
          font-size: 1.1rem;
        }

        /* Hexagon Background */
        .honeycomb-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
        }

        .hexagon {
          position: absolute;
          width: 50px;
          height: 28px;
          background-color: rgba(34, 211, 238, 0.05);
          margin: 2px;
          top: 50%;
          left: 50%;
          animation: hexFloat 4s infinite ease-in-out;
        }
        
        .hexagon:before, .hexagon:after {
          content: "";
          position: absolute;
          width: 0;
          border-left: 25px solid transparent;
          border-right: 25px solid transparent;
        }
        .hexagon:before {
          bottom: 100%;
          border-bottom: 14px solid rgba(34, 211, 238, 0.05);
        }
        .hexagon:after {
          top: 100%;
          border-top: 14px solid rgba(34, 211, 238, 0.05);
        }

        @keyframes hexFloat {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
        }
        
        /* Fullscreen Button */
        .fullscreen-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 40px;
          height: 40px;
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid #22d3ee;
          color: #22d3ee;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          font-size: 1.2rem;
        }
        
        .fullscreen-button:hover {
          background: #22d3ee;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default Timer;