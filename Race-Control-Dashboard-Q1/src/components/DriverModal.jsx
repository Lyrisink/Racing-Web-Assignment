import { useEffect } from 'react';

// Scope Cut Note: Career stats and recent race history endpoints were intentionally 
// excluded from this modal to avoid extraneous API queries and latency. 
// We are presenting all immediate season standings data provided by Jolpica/Ergast.

export default function DriverModal({ driver, onClose }) {
  // Close modal when pressing the Escape key
  useEffect(() => {
    if (!driver) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [driver, onClose]);

  if (!driver) return null;

  // Extract properties safely whether driver object is flattened or raw Ergast format
  const name =
    driver.name ||
    (driver.Driver ? `${driver.Driver.givenName} ${driver.Driver.familyName}` : 'Unknown');
  const nationality = driver.nationality || driver.Driver?.nationality || 'N/A';
  const team =
    driver.team || driver.Constructors?.[0]?.name || driver.Constructor?.name || 'N/A';
  const position = driver.position || 'N/A';
  const points = driver.points ?? '0';
  const wins = driver.wins ?? '0';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-race-bg/80 backdrop-blur-sm p-4 transition-opacity duration-200 animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-md bg-race-card border border-race-border rounded-xl p-6 shadow-2xl transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside card
      >
        {/* Close Button (X) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close driver details"
          className="absolute top-4 right-4 text-race-muted hover:text-race-text text-xl font-bold p-1 rounded transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6 border-b border-race-border pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-race-red font-mono">
              #{position}
            </span>
            <div>
              <h2 className="text-2xl font-extrabold text-race-text leading-tight">
                {name}
              </h2>
              <p className="text-race-muted text-sm">{team}</p>
            </div>
          </div>
        </div>

        {/* Modal Body / Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-race-bg border border-race-border p-3 rounded-lg">
            <span className="text-xs text-race-muted uppercase font-semibold block mb-1">
              Nationality
            </span>
            <span className="text-race-text font-medium text-base">
              {nationality}
            </span>
          </div>

          <div className="bg-race-bg border border-race-border p-3 rounded-lg">
            <span className="text-xs text-race-muted uppercase font-semibold block mb-1">
              Championship Pos
            </span>
            <span className="text-race-text font-medium text-base font-mono">
              {position}
            </span>
          </div>

          <div className="bg-race-bg border border-race-border p-3 rounded-lg">
            <span className="text-xs text-race-muted uppercase font-semibold block mb-1">
              Season Points
            </span>
            <span className="text-race-red font-bold text-lg font-mono">
              {points} <span className="text-xs text-race-muted font-normal">pts</span>
            </span>
          </div>

          <div className="bg-race-bg border border-race-border p-3 rounded-lg">
            <span className="text-xs text-race-muted uppercase font-semibold block mb-1">
              Wins
            </span>
            <span className="text-race-text font-bold text-lg font-mono">
              {wins}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-race-bg hover:bg-race-border text-race-text text-sm font-semibold rounded border border-race-border transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}