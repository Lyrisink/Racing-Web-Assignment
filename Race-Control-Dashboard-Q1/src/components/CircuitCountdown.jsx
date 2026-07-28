import { useState, useEffect } from 'react';
import { getUpcomingMeeting, getLatestSessionKey } from '../api/openf1';

export default function CircuitCountdown() {
  const [meeting, setMeeting] = useState(null);
  const [liveSession, setLiveSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        // Fetch the upcoming meeting
        const nextMeeting = await getUpcomingMeeting();
        if (isMounted) setMeeting(nextMeeting);

        // Separately check for a live session
        try {
          const sessionKey = await getLatestSessionKey();
          // Assuming getLatestSessionKey only returns the ID, we fetch the full session details
          const sessionRes = await fetch(`https://api.openf1.org/v1/sessions?session_key=${sessionKey}`);
          
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            if (sessionData && sessionData.length > 0) {
              const session = sessionData[0];
              const now = new Date();
              const start = new Date(session.date_start);
              const end = new Date(session.date_end);

              // Session is active if current time is between start and end
              if (now >= start && now <= end) {
                if (isMounted) setLiveSession(session);
              }
            }
          }
        } catch (sessionError) {
          console.error("Live session check failed, falling back to countdown:", sessionError);
          // Gracefully continue; liveSession remains null
        }
      } catch (error) {
        console.error("Failed to fetch meeting data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Countdown Timer
  useEffect(() => {
    if (!meeting || liveSession) return; // Don't run timer if no meeting or if session is live

    const targetDate = new Date(meeting.date_start).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer(); // Call immediately on mount
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [meeting, liveSession]);

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <p className="text-race-muted text-sm uppercase tracking-widest">Loading telemetry...</p>
      </div>
    );
  }

  // If both fail to load, return nothing so it doesn't break the layout
  if (!meeting && !liveSession) return null;

  return (
    <div className="relative mt-12 mb-6 max-w-2xl mx-auto flex items-center justify-center min-h-[160px] p-6 bg-race-card/40 backdrop-blur-sm border border-race-border rounded-xl overflow-hidden">
      
      {/* Background Layer: Circuit SVG Placeholder 
          Centered absolutely, sized to ~80% of the parent container, 
          opacity responds to liveSession state 
      */}
      <div 
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] flex items-center justify-center pointer-events-none transition-opacity duration-700 ease-in-out ${
          liveSession ? 'opacity-100' : 'opacity-20'
        }`}
      >
        <div className="w-full h-full border border-race-border border-dashed rounded-lg flex items-center justify-center bg-race-bg/30">
          <span className="text-race-muted text-[10px] sm:text-xs uppercase tracking-widest text-center px-2">
            {/* TODO: circuit SVG */}
            Circuit Map
          </span>
        </div>
      </div>

      {/* Foreground Layer: Dynamic Display (Live Badge OR Countdown) */}
      <div className="relative z-10 w-full flex justify-center">
        {liveSession ? (
          <div className="flex items-center gap-4">
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-race-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-race-red"></span>
            </span>
            <h2 className="text-2xl font-bold tracking-wider text-race-text uppercase drop-shadow-md">
              LIVE &mdash; {liveSession.session_name || 'Track Session'}
            </h2>
          </div>
        ) : (
          <div className="flex gap-4 sm:gap-6 text-center drop-shadow-md">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HRS', value: timeLeft.hours },
              { label: 'MIN', value: timeLeft.minutes },
              { label: 'SEC', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[3.5rem]">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-race-red">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-xs text-race-muted font-bold tracking-widest mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}