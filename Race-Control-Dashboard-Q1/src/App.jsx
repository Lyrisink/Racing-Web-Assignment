import StandingsSection from './components/StandingsSection';

function App() {
  return (
    <div className="min-h-screen bg-race-bg text-race-text p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="border-b border-race-border pb-4">
          <h1 className="text-3xl font-extrabold uppercase tracking-widest">
            Race Control <span className="text-race-red">Dashboard</span>
          </h1>
          <p className="text-race-muted mt-2 text-sm">
            Championship Standings & Live Telemetry
          </p>
        </header>

        <main>
          <StandingsSection />
        </main>
      </div>
    </div>
  );
}

export default App;