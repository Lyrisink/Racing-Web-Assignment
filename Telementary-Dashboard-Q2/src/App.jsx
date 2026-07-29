// TEMPORARY — remove once the real simulator is wired up
import StatusBar from "./components/StatusBar/StatusBar";

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
    </div>
  );
}

export default App;