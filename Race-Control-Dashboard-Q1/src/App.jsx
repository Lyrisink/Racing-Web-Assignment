import Hero from './components/Hero';
import StandingsSection from './components/StandingsSection';
import Footer from './components/Footer';

function App() {
  return (
    // Removed the bottom padding (pb-8) since the new Footer handles its own spacing
    <div className="min-h-screen bg-race-bg text-race-text">
      {/* Edge-to-edge Hero Section */}
      <Hero />

      {/* Main Content Area - Added id="standings" for the scroll target */}
      <main id="standings" className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-8">
        <StandingsSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;