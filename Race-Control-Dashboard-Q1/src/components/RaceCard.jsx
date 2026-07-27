export default function RaceCard() {
  return (
    <div className="bg-race-card border border-race-border rounded-lg p-6 shadow-md">
      <h2 className="text-race-text text-xl font-bold mb-2">Driver Standings</h2>
      <p className="text-race-muted mb-4">Current championship points.</p>
      <button className="bg-race-red hover:bg-race-red-hover text-white px-4 py-2 rounded transition-colors font-semibold">
        View Details
      </button>
    </div>
  )
}