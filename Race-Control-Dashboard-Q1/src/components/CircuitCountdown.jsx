import { useState, useEffect } from 'react';
import { getUpcomingMeeting, getLatestSessionKey } from '../api/openf1';

export default function CircuitCountdown() {
  const [meeting, setMeeting] = useState(null);
  const [liveSession, setLiveSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const [isOngoing, setIsOngoing] = useState(false); // Track if countdown hits zero

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const nextMeeting = await getUpcomingMeeting();
        if (isMounted) setMeeting(nextMeeting);

        try {
          const sessionKey = await getLatestSessionKey();
          const sessionRes = await fetch(`https://api.openf1.org/v1/sessions?session_key=${sessionKey}`);
          
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            if (sessionData && sessionData.length > 0) {
              const session = sessionData[0];
              const now = new Date();
              const start = new Date(session.date_start);
              const end = new Date(session.date_end);

              if (now >= start && now <= end) {
                if (isMounted) setLiveSession(session);
              }
            }
          }
        } catch (sessionError) {
          console.error("Live session check failed, falling back to countdown:", sessionError);
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

  useEffect(() => {
    if (!meeting || liveSession) return;

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
        setIsOngoing(false);
      } else {
        // Zero state triggered!
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsOngoing(true); 
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [meeting, liveSession]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <p className="text-race-muted text-xs uppercase tracking-widest">Loading telemetry...</p>
      </div>
    );
  }

  if (!meeting && !liveSession) return null;

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center my-2">
      
      {/* Sleek Glass Container matching the Carousel Cards */}
      <div className="relative z-10 py-5 px-8 md:px-12 flex justify-center items-center bg-race-card/80 backdrop-blur-md border border-race-border rounded-2xl shadow-2xl transition-all duration-500">
        
        {liveSession ? (
          <div className="flex items-center gap-4">
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-race-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-race-red"></span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-race-text uppercase drop-shadow-lg">
              LIVE &mdash; {liveSession.session_name || 'Track Session'}
            </h2>
          </div>
        ) : isOngoing ? (
          // Race Ongoing State
          <div className="flex flex-col items-center gap-2">
            <span className="relative flex h-4 w-4 mb-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-race-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-race-red"></span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-widest text-race-text uppercase drop-shadow-xl text-center">
              RACE <span className="text-race-red">ONGOING</span>
            </h2>
          </div>
        ) : (
          // Countdown Timer
          <div className="flex gap-6 sm:gap-10 text-center">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HRS', value: timeLeft.hours },
              { label: 'MIN', value: timeLeft.minutes },
              { label: 'SEC', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[4rem]">
                <span className="text-4xl sm:text-6xl font-mono font-black text-race-red tracking-tight leading-none drop-shadow-lg">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-race-text/80 font-bold tracking-widest mt-2 uppercase drop-shadow-sm">
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