import { useState, useEffect } from 'react';
import HeaderBar from './HeaderBar';
import TitleBlock from './TitleBlock';
import CircuitCountdown from './CircuitCountdown';
import RaceCarousel from './RaceCarousel';

import bg1 from '../assets/hero-bg-1.jpg';
import bg2 from '../assets/hero-bg-2.jpg';
import bg3 from '../assets/hero-bg-3.jpg';
import bg4 from '../assets/hero-bg-4.jpg';
import bg5 from '../assets/hero-bg-5.jpg';

const backgrounds = [bg1, bg2, bg3, bg4, bg5];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    backgrounds.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 20000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen border-b border-race-border overflow-hidden">
      
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

      <div 
        className="absolute inset-0 z-10 bg-black/40"
        style={{
          backgroundImage: `linear-gradient(to top, var(--color-race-bg) 0%, transparent 30%)`
        }}
      />

      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 md:px-8 flex flex-col h-full overflow-hidden">
        
        <HeaderBar />
        
        {/* Adjusted padding-bottom (pb-12 md:pb-20) to shift the evenly-spaced cluster higher up the screen */}
        <div className="flex-1 flex flex-col justify-evenly items-center pt-2 pb-12 md:pb-20 w-full overflow-hidden">
          <TitleBlock />
          <CircuitCountdown />
          <RaceCarousel />
        </div>

      </div>
    </section>
  );
}