import StandingsTable from './components/StandingsTable';

function App() {
  return (
    <div className="min-h-screen p-8 bg-race-bg text-race-text">
      <header className="mb-8 border-b border-race-border pb-4">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest">
          Race Control <span className="text-race-red">Dashboard</span>
        </h1>
        <p className="text-race-muted mt-2">
          Championship Standings
        </p>
      </header>

      <main className="max-w-5xl mx-auto">
        <StandingsTable type="drivers" />
      </main>
    </div>
  );
}

export default App;