export default function TitleBlock() {
  return (
    <div className="py-1 flex flex-col items-center text-center">
      <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-widest leading-none drop-shadow-xl text-race-text">
        <span className="text-race-red">APEX</span> F1
      </h1>
      <p className="mt-1 text-race-text font-medium tracking-wide text-xs md:text-sm drop-shadow-md max-w-xl">
        Championship Standings & Live Telemetry
      </p>
    </div>
  );
}