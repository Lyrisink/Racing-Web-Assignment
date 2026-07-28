export default function TitleBlock() {
  return (
    <div className="py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-widest leading-tight drop-shadow-xl text-race-text">
        Race Control <br className="hidden md:block" />
        <span className="text-race-red">Dashboard</span>
      </h1>
      <p className="mt-4 text-race-text font-medium tracking-wide text-sm md:text-base drop-shadow-md max-w-xl">
        Championship Standings & Live Telemetry
      </p>
    </div>
  );
}