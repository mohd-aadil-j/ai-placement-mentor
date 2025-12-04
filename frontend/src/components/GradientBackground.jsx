import React, { useEffect, useRef, useState } from "react";

const GradientBackground = () => {
  const interactiveRef = useRef(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setCurX((prev) => prev + (tgX - prev) / 20);
      setCurY((prev) => prev + (tgY - prev) / 20);

      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      }
    }, 1000 / 60);

    return () => clearInterval(moveInterval);
  }, [curX, curY, tgX, tgY]);

  const handleMouseMove = (event) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{
        background: 'linear-gradient(40deg, rgb(108, 0, 162), rgb(0, 17, 82))'
      }}
    >
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="gradients-container h-full w-full"
        style={{
          filter: isSafari ? 'blur(60px)' : 'url(#blurMe) blur(40px)'
        }}
      >
        <div 
          className="absolute w-4/5 h-4/5 animate-first"
          style={{
            background: 'radial-gradient(circle at center, rgba(18, 113, 255, 0.8) 0%, rgba(18, 113, 255, 0) 50%)',
            mixBlendMode: 'hard-light',
            top: 'calc(50% - 40%)',
            left: 'calc(50% - 40%)',
            transformOrigin: 'center center',
            opacity: 1
          }}
        />
        <div 
          className="absolute w-4/5 h-4/5 animate-second"
          style={{
            background: 'radial-gradient(circle at center, rgba(221, 74, 255, 0.8) 0%, rgba(221, 74, 255, 0) 50%)',
            mixBlendMode: 'hard-light',
            top: 'calc(50% - 40%)',
            left: 'calc(50% - 40%)',
            transformOrigin: 'calc(50% - 400px)',
            opacity: 1
          }}
        />
        <div 
          className="absolute w-4/5 h-4/5 animate-third"
          style={{
            background: 'radial-gradient(circle at center, rgba(100, 220, 255, 0.8) 0%, rgba(100, 220, 255, 0) 50%)',
            mixBlendMode: 'hard-light',
            top: 'calc(50% - 40%)',
            left: 'calc(50% - 40%)',
            transformOrigin: 'calc(50% + 400px)',
            opacity: 1
          }}
        />
        <div 
          className="absolute w-4/5 h-4/5 animate-fourth"
          style={{
            background: 'radial-gradient(circle at center, rgba(200, 50, 50, 0.8) 0%, rgba(200, 50, 50, 0) 50%)',
            mixBlendMode: 'hard-light',
            top: 'calc(50% - 40%)',
            left: 'calc(50% - 40%)',
            transformOrigin: 'calc(50% - 200px)',
            opacity: 0.7
          }}
        />
        <div 
          className="absolute w-4/5 h-4/5 animate-fifth"
          style={{
            background: 'radial-gradient(circle at center, rgba(180, 180, 50, 0.8) 0%, rgba(180, 180, 50, 0) 50%)',
            mixBlendMode: 'hard-light',
            top: 'calc(50% - 40%)',
            left: 'calc(50% - 40%)',
            transformOrigin: 'calc(50% - 800px) calc(50% + 800px)',
            opacity: 1
          }}
        />

        <div
          ref={interactiveRef}
          onMouseMove={handleMouseMove}
          className="absolute w-full h-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(140, 100, 255, 0.8) 0%, rgba(140, 100, 255, 0) 50%)',
            mixBlendMode: 'hard-light',
            top: '-50%',
            left: '-50%',
            opacity: 0.7
          }}
        />
      </div>
    </div>
  );
};

export default GradientBackground;
