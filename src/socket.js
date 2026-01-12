import { io } from "socket.io-client";

const socket = io("https://rd-timer-backend.onrender.com", {
  transports: ["websocket"],
  timeout: 20000
});

socket.on("connect", () => {
  console.log("✅ Connected to backend");
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket error:", err.message);
});

export default socket;
