import { useState, useEffect } from 'react';

export default function HeaderBar() {
  const [time, setTime] = useState(new Date());

  // Live clock effect
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-between py-4 border-b border-race-border/40 text-xs font-mono uppercase tracking-widest text-race-muted">
      {/* Left: Minimal Logo/Tag */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-race-red animate-pulse"></div>
        <span className="font-bold text-race-text">RC//DASH</span>
      </div>
      
      {/* Right: Live Telemetry Clock */}
      <div className="font-semibold">
        {time.toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        })}
      </div>
    </div>
  );
}