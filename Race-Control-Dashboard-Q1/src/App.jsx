import { useEffect, useState } from 'react';
import { getUpcomingMeeting } from './api/openf1';
import { getDriverStandings, getConstructorStandings } from './api/jolpica';

function App() {
  const [data, setData] = useState({
    nextRace: null,
    drivers: [],
    constructors: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        // Fetch data from both APIs concurrently
        const [meetingData, driverData, constructorData] = await Promise.all([
          getUpcomingMeeting(),
          getDriverStandings(),
          getConstructorStandings()
        ]);

        setData({
          nextRace: meetingData,
          drivers: driverData.slice(0, 5), // Keep it to Top 5 for the dashboard widget
          constructors: constructorData.slice(0, 5)
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen p-8">
      {/* Dashboard Header */}
      <header className="mb-8 border-b border-race-border pb-4">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-race-text">
          Race Control <span className="text-race-red">Dashboard</span>
        </h1>
        <p className="text-race-muted mt-2">
          Live telemetry and championship standings
        </p>
      </header>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-race-red text-xl font-bold animate-pulse">
          Loading telemetry...
        </div>
      )}
      {error && (
        <div className="bg-red-900/20 border border-race-red text-race-red p-4 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Dashboard Grid */}
      {!loading && !error && (
        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1: Next Race (OpenF1 API) */}
          <div className="bg-race-card border border-race-border rounded-lg p-6 shadow-md">
            <h2 className="text-race-text text-xl font-bold mb-1">Next Meeting</h2>
            <p className="text-race-muted mb-6">OpenF1 API</p>
            
            {data.nextRace ? (
              <div>
                <div className="text-3xl font-bold text-race-red mb-2">
                  {data.nextRace.meeting_name}
                </div>
                <div className="text-race-text text-lg">
                  {data.nextRace.location}, {data.nextRace.country_name}
                </div>
                <div className="text-race-muted mt-4 text-sm font-mono bg-race-bg p-2 rounded border border-race-border">
                  Starts: {new Date(data.nextRace.date_start).toLocaleString()}
                </div>
              </div>
            ) : (
              <p className="text-race-muted">No upcoming races found.</p>
            )}
          </div>

          {/* Card 2: Driver Standings (Jolpica API) */}
          <div className="bg-race-card border border-race-border rounded-lg p-6 shadow-md">
            <h2 className="text-race-text text-xl font-bold mb-1">Top Drivers</h2>
            <p className="text-race-muted mb-4">Jolpica API</p>
            
            <div className="space-y-3">
              {data.drivers.map((driver) => (
                <div key={driver.name} className="flex items-center justify-between bg-race-bg p-3 rounded border border-race-border">
                  <div className="flex items-center gap-3">
                    <span className="text-race-red font-bold w-4">{driver.position}</span>
                    <div>
                      <div className="text-race-text font-semibold">{driver.name}</div>
                      <div className="text-race-muted text-xs">{driver.team}</div>
                    </div>
                  </div>
                  <div className="text-race-text font-mono">
                    {driver.points} <span className="text-race-muted text-xs">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Constructor Standings (Jolpica API) */}
          <div className="bg-race-card border border-race-border rounded-lg p-6 shadow-md">
            <h2 className="text-race-text text-xl font-bold mb-1">Top Constructors</h2>
            <p className="text-race-muted mb-4">Jolpica API</p>
            
            <div className="space-y-3">
              {data.constructors.map((team) => (
                <div key={team.name} className="flex items-center justify-between bg-race-bg p-3 rounded border border-race-border">
                  <div className="flex items-center gap-3">
                    <span className="text-race-red font-bold w-4">{team.position}</span>
                    <div className="text-race-text font-semibold">{team.name}</div>
                  </div>
                  <div className="text-race-text font-mono">
                    {team.points} <span className="text-race-muted text-xs">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      )}
    </div>
  );
}

export default App;