import { io } from "socket.io-client";

const socket = io("https://rd-timer-backend.onrender.com", {
  transports: ["websocket"],
});
