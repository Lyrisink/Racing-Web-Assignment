import { useEffect } from 'react';

export default function SessionScheduleModal({ race, onClose }) {
  useEffect(() => {
    if (!race) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [race, onClose]);

  if (!race) return null;

  // Helper to accurately format date + time into readable strings
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return 'TBA';
    // Use 'Z' for UTC if a time is provided, otherwise default to midnight UTC
    const isoString = timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T00:00:00Z`;
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return dateStr;

    const formattedDate = dateObj.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    if (timeStr) {
      const formattedTime = dateObj.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
      return `${formattedDate} • ${formattedTime}`;
    }
    return formattedDate;
  };

  // Dynamically compile only the sessions that actually exist for this specific weekend
  const sessions = [];
  
  if (race.FirstPractice) sessions.push({ label: 'Practice 1', ...race.FirstPractice });
  if (race.SecondPractice) sessions.push({ label: 'Practice 2', ...race.SecondPractice });
  if (race.ThirdPractice) sessions.push({ label: 'Practice 3', ...race.ThirdPractice });
  if (race.SprintQualifying) sessions.push({ label: 'Sprint Qualifying', ...race.SprintQualifying });
  if (race.Sprint) sessions.push({ label: 'Sprint', ...race.Sprint });
  if (race.Qualifying) sessions.push({ label: 'Qualifying', ...race.Qualifying });
  
  // The main race itself
  sessions.push({ label: 'Grand Prix', date: race.date, time: race.time });

  // Chronologically sort them just in case Ergast API order fluctuates
  sessions.sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time || '00:00:00Z'}`).getTime();
    const timeB = new Date(`${b.date}T${b.time || '00:00:00Z'}`).getTime();
    return timeA - timeB;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-race-bg/80 backdrop-blur-sm p-4 transition-opacity duration-200 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-race-card border border-race-border rounded-xl p-6 shadow-2xl transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close session details"
          className="absolute top-4 right-4 text-race-muted hover:text-race-text text-xl font-bold p-1 rounded transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="mb-6 border-b border-race-border pb-4">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-race-red tracking-widest uppercase mb-1">
              Round {race.round}
            </span>
            <h2 className="text-2xl font-black text-race-text uppercase leading-tight">
              {race.name}
            </h2>
            <p className="text-race-muted text-sm mt-1">{race.circuit} • {race.country}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {sessions.map((session, idx) => (
            <div key={idx} className="bg-race-bg border border-race-border p-3 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="text-sm text-race-text font-bold uppercase tracking-wide">
                {session.label}
              </span>
              <span className="text-xs text-race-muted font-medium bg-race-card px-2 py-1 rounded border border-race-border/50 text-center sm:text-right shadow-inner">
                {formatDateTime(session.date, session.time)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-race-bg hover:bg-race-border text-race-text text-sm font-semibold rounded border border-race-border transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}