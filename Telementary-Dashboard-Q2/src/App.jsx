// TEMPORARY — remove once real telemetry data is wired up
import StatusBar from "./components/StatusBar/StatusBar";
import { PrimaryVitals, MeterBar, GearIndicator } from "./components/PrimaryVitals";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <StatusBar
        isConnected={true}
        isPaused={false}
        onPause={() => {}}
        onResume={() => {}}
        onReset={() => {}}
      />

      <div className="flex gap-6 p-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <PrimaryVitals speed={87} rpm={7200} redlineRpm={8000} criticalRpm={9000} />

          <div className="flex gap-6 justify-center">
            <MeterBar label="Throttle" value={65} colorClass="bg-primary" />
            <MeterBar label="Brake" value={20} colorClass="bg-primary" />
            <GearIndicator currentGear={3} maxGear={5} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;