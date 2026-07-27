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

  // Format ISO date string into readable format (e.g., "24 August 2026")
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

  return (
    <div className="bg-race-card border border-race-border rounded-xl p-6 shadow-xl flex flex-col justify-between h-full">
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
        <div className="space-y-6">
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

          {/* Track Map Visual Placeholder Area */}
          <div className="aspect-square w-full rounded-lg bg-race-bg border border-race-border border-dashed flex items-center justify-center p-4">
            {/* TODO: circuit layout image/SVG */}
            <span className="text-xs font-mono uppercase text-race-muted tracking-wider text-center">
              Circuit Track Layout
            </span>
          </div>
        </div>
      )}

      {!loading && !error && !meeting && (
        <div className="text-race-muted py-8 text-center text-xs uppercase tracking-wider">
          No race details available
        </div>
      )}
    </div>
  );
}