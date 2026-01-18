import React from "react";
import GlobalBackground from "./GlobalBackground";
import Timer from "./timer";
import "./App.css";

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <GlobalBackground />

      {/* Home Page Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6">
        

        <Timer />
      </div>
    </div>
  );
}

export default App;
