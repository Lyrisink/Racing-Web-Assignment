import { useState, useEffect } from 'react';
import HeaderBar from './HeaderBar';
import TitleBlock from './TitleBlock';
import CircuitCountdown from './CircuitCountdown';

// Import all 5 background images
import bg1 from '../assets/hero-bg-1.jpg';
import bg2 from '../assets/hero-bg-2.jpg';
import bg3 from '../assets/hero-bg-3.jpg';
import bg4 from '../assets/hero-bg-4.jpg';
import bg5 from '../assets/hero-bg-5.jpg';

const backgrounds = [bg1, bg2, bg3, bg4, bg5];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload approach: We instantiate new Image objects on mount so the 
  // browser fetches them immediately. This guarantees the first rotation 
  // won't have a sudden pop-in while waiting for a network request.
  useEffect(() => {
    backgrounds.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Rotation logic: Transition to the next image every 20 seconds, looping back to 0
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 20000); 

    // Cleanup interval on unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full border-b border-race-border overflow-hidden">
      
      {/* Layer 1: The Crossfading Images
        We stack them absolutely and toggle opacity based on the current index.
      */}
      <div className="absolute inset-0 z-0 bg-race-bg">
        {backgrounds.map((bg, index) => (
          <div
            key={bg}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1500 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
      </div>

      {/* Layer 2: Symmetrical Dark Overlay
        Removed the heavy left-to-right gradient. Added a uniform semi-transparent
        black overlay so the centered text remains readable across all images, 
        and kept the bottom gradient to blend smoothly into the section below.
      */}
      <div 
        className="absolute inset-0 z-10 bg-black/40"
        style={{
          backgroundImage: `linear-gradient(to top, var(--color-race-bg) 0%, transparent 30%)`
        }}
      />

      {/* Layer 3: The Content
        Elevated with z-20 to ensure it's on top of both the images and the overlay.
        Now uses min-h-screen to fill the entire viewport.
      */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 md:px-8 flex flex-col min-h-screen">
        
        {/* Top anchored HeaderBar */}
        <HeaderBar />
        
        {/* Vertically centered main content area */}
        <div className="flex-1 flex flex-col justify-center pb-12 md:pb-16">
          <TitleBlock />
          <CircuitCountdown />
        </div>

      </div>
    </section>
  );
}