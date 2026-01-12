import { useState, useEffect, useRef } from 'react';
import { Play, Maximize2 } from 'lucide-react';
import intro from "../assets/intro.mp4";
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
        className="w-full h-full object-cover"
        playsInline
        muted
      >
        <source src={intro} type="video/mp4" />
      </video>
    </div>
  );
}

export default IntroAnimation;