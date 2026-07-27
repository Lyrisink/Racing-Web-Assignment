import StandingsTable from './StandingsTable';
import CircuitDetail from './CircuitDetail';

export default function StandingsSection() {
  return (
    <section className="pt-8 border-t border-race-border">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Circuit Detail (~30%) */}
        <div className="md:col-span-4">
          <CircuitDetail />
        </div>

        {/* Right Column: Standings Table (~70%) */}
        <div className="md:col-span-8">
          <StandingsTable type="drivers" />
        </div>
      </div>
    </section>
  );
}