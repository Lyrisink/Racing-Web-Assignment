export default function Footer() {
  return (
    // Uses standard max-width spacing to align perfectly with the rest of the app's content
    <footer className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 mt-12 border-t border-race-border">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-race-muted text-[10px] md:text-xs font-medium tracking-wider">
        <p className="uppercase">
          <span className="text-race-text font-bold">APEX F1</span> &mdash; Championship Standings & Live Telemetry
        </p>
        <p>
          Data provided by <span className="text-race-text/80">Jolpica-F1</span> & <span className="text-race-text/80">OpenF1</span>
        </p>
      </div>
    </footer>
  );
}