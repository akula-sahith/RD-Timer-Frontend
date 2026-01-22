import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalBackground from "./GlobalBackground";
import Home from "./home";
import Timer from "./timer";
import CSETimer from "./csetimer";
import "./App.css";
import Ecetimer from "./ecetimer";

function App() {
  return (
    <BrowserRouter>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background */}
        <GlobalBackground />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/it-timer" element={<Timer />} />
          <Route path="/cse-timer" element={<CSETimer />} />
          <Route path="/ece--timer" element={<Ecetimer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;