import { useState, useEffect } from 'react';
import { getUpcomingMeeting } from '../api/openf1';

export default function CircuitDetail() {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMeeting() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUpcomingMeeting();
        if (isMounted) {
          setMeeting(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch race details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMeeting();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isPastRace = meeting?.date_start
    ? new Date(meeting.date_start) < new Date()
    : false;

  // Refined path: increased the Y-gap between the parallel bottom straights 
  // (y=185 for main straight, y=175 for back straight) to prevent any overlap
  const trackPath = "M 150 185 L 30 185 C 5 185, 5 160, 30 155 C 55 150, 45 165, 75 140 C 95 120, 50 85, 50 45 C 50 5, 125 5, 125 45 C 125 80, 85 80, 115 120 C 135 150, 195 110, 195 150 C 195 175, 175 175, 140 175 L 90 175 C 65 175, 65 185, 90 185 L 150 185";

  return (
    <div className="bg-race-card border border-race-border rounded-xl p-6 shadow-xl space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="text-race-muted py-12 text-center text-xs font-semibold uppercase tracking-wider animate-pulse">
          Loading circuit details...
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-race-red py-6 text-center text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Circuit Content */}
      {!loading && !error && meeting && (
        <>
          {/* Header & Status Badge */}
          <div>
            <span className="inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded bg-race-red/10 text-race-red border border-race-red/20 mb-3">
              {isPastRace ? 'Last Race' : 'Next Race'}
            </span>
            <h2 className="text-2xl font-extrabold text-race-text uppercase tracking-wide leading-tight">
              {meeting.circuit_short_name || meeting.location}
            </h2>
            <p className="text-race-muted text-xs font-medium mt-1">
              {meeting.meeting_official_name || meeting.meeting_name}
            </p>
          </div>

          {/* Location & Date Metadata */}
          <div className="space-y-3 pt-4 border-t border-race-border">
            <div>
              <span className="text-[10px] uppercase font-bold text-race-muted tracking-wider block mb-0.5">
                Location
              </span>
              <p className="text-sm font-semibold text-race-text">
                {meeting.location}, {meeting.country_name}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-race-muted tracking-wider block mb-0.5">
                Date
              </span>
              <p className="text-sm font-mono font-semibold text-race-text">
                {formatDate(meeting.date_start)}
              </p>
            </div>
          </div>

          {/* Animated Track Map Visual Area */}
          <div className="aspect-square w-full rounded-lg bg-[#0d0d0d] border border-race-border flex items-center justify-center p-6 overflow-hidden relative shadow-inner">
            
            {/* Subtle graph-paper grid background */}
            <div 
              className="absolute inset-0 opacity-[0.06]" 
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
            />

            <svg 
              viewBox="0 0 200 200" 
              className="w-full h-full max-w-[280px] drop-shadow-2xl relative z-10" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Single thin racing line */}
              <path
                d={trackPath}
                fill="none"
                stroke="#666" // Smooth greyish color
                strokeWidth="4" // Thin stroke prevents overlapping
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Start/Finish Line Indicator */}
              <line x1="120" y1="181" x2="120" y2="189" stroke="#fff" strokeWidth="1.5" />
              <line x1="124" y1="181" x2="124" y2="189" stroke="#fff" strokeWidth="1.5" />

              {/* Animated Red Dot representing a car */}
              <circle r="3.5" fill="var(--color-race-red)" className="drop-shadow-[0_0_6px_var(--color-race-red)]">
                {/* 
                  Slowed down to 10s. 
                  keyTimes still throttle the speed through corners and accelerate it down the straights.
                */}
                <animateMotion 
                  dur="10s" 
                  repeatCount="indefinite"
                  path={trackPath}
                  calcMode="linear"
                  keyTimes="0; 0.15; 0.25; 0.35; 0.47; 0.59; 0.69; 0.81; 0.89; 0.94; 0.98; 1"
                />
              </circle>
            </svg>
          </div>
        </>
      )}

      {!loading && !error && !meeting && (
        <div className="text-race-muted py-8 text-center text-xs uppercase tracking-wider">
          No race details available
        </div>
      )}
    </div>
  );
}