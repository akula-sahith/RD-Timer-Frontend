import { useEffect, useState } from "react";
import socket from "../socket";
import IntroAnimation from "../components/IntroAnimation.jsx";
import Countdown from "../components/Countdown";

export default function Timer() {
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    socket.on("START_EVENT", ({ startTime }) => {
      setStartTime(new Date(startTime));
      setShowIntro(true);
      setStarted(true);
    });

    socket.on("SYNC_RUNNING", ({ startTime }) => {
      setStartTime(new Date(startTime));
      setStarted(true);
    });

    return () => socket.off();
  }, []);

  const startHackathon = () => {
    socket.emit("START_REQUEST");
  };

  if (!started) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-cyan-400">
        <h1 className="text-6xl font-bold">CODEFUSION 2026</h1>
        <p className="mt-4 text-xl">Waiting for HoD to start…</p>
        <button
          onClick={startHackathon}
          className="mt-8 px-10 py-4 bg-cyan-500 text-black font-bold rounded-xl"
        >
          START HACKATHON
        </button>
      </div>
    );
  }

  if (showIntro) {
    return (
      <IntroAnimation
        onFinish={() => setShowIntro(false)}
      />
    );
  }

  return <Countdown startTime={startTime} />;
}
