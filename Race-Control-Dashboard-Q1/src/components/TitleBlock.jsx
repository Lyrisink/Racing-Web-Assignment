export default function TitleBlock() {
  return (
    <div className="py-16 md:py-24 flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-widest leading-tight drop-shadow-xl text-race-text">
        <span className="text-race-red">APEX</span> F1
      </h1>
      <p className="mt-4 text-race-text font-medium tracking-wide text-sm md:text-base drop-shadow-md max-w-xl">
        Championship Standings & Live Telemetry
      </p>
    </div>
  );
}