'use client';
import { useEffect, useRef, useState } from 'react';

const CursorGlow = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Thêm event listeners
    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Handle hoverable elements
    const hoverableElements = document.querySelectorAll(
      'a, button, input, [data-hoverable]'
    );
    hoverableElements.forEach((element) => {
      element.addEventListener('mouseenter', () => setIsHovering(true));
      element.addEventListener('mouseleave', () => setIsHovering(false));
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);

      hoverableElements.forEach((element) => {
        element.removeEventListener('mouseenter', () => setIsHovering(true));
        element.removeEventListener('mouseleave', () => setIsHovering(false));
      });
    };
  }, []);

  return (
    <>
      {/* Main glow effect */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference transition-all duration-200 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: 1,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1}) ${
            isClicking ? 'scale(0.8)' : ''
          }`,
          background: 'transparent',
          filter: 'blur(2px)',
          backdropFilter: 'blur(2px)',
        }}
      >
        {/* Gradient layers */}
        <div
          className="absolute rounded-full"
          style={{
            width: isHovering ? '40px' : '30px',
            height: isHovering ? '40px' : '30px',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: isHovering ? '60px' : '45px',
            height: isHovering ? '60px' : '45px',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Optional: Subtle trail effect */}
      <div
        className="fixed pointer-events-none z-[9998] mix-blend-difference transition-all duration-300 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: 0.3,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.2 : 0.8})`,
          width: '15px',
          height: '15px',
          background: 'transparent',
          filter: 'blur(4px)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </>
  );
};

export default CursorGlow;
