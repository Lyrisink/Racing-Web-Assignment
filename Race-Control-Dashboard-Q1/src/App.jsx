import Hero from './components/Hero';
import StandingsSection from './components/StandingsSection';

function App() {
  return (
    <div className="min-h-screen bg-race-bg text-race-text pb-8">
      {/* Edge-to-edge Hero Section */}
      <Hero />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-8">
        <StandingsSection />
      </main>
    </div>
  );
}

export default App;