/**
 * useTelemetrySimulator.js
 * * Custom React Hook to drive the mock telemetry data on a timer.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BASELINE_STATE, 
  tick, 
  getNextPhase, 
  computeAlerts 
} from './telemetrySimulator'; // Removed unused PHASES import

export function useTelemetrySimulator(tickIntervalMs = 300, historyLimit = 100) {
  // Primary UI State
  const [currentValues, setCurrentValues] = useState(BASELINE_STATE);
  const [currentPhase, setCurrentPhase] = useState('IDLE'); // Added state specifically for the UI to read safely
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  // Internal Simulator State
  // Initialized with nulls to maintain strict render purity (no Date.now() during render)
  const simState = useRef({
    telemetry: { ...BASELINE_STATE },
    phase: 'IDLE',
    phaseStartTime: null, 
    lastTickTime: null
  });

  // Control Functions
  const pause = useCallback(() => setIsPaused(true), []);
  
  const resume = useCallback(() => {
    // Reset internal timers on resume so we don't get massive time-jump calculations
    const now = Date.now();
    simState.current.lastTickTime = now;
    simState.current.phaseStartTime = now;
    setIsPaused(false);
  }, []);
  
  const reset = useCallback(() => {
    setIsPaused(true); 
    simState.current = {
      telemetry: { ...BASELINE_STATE },
      phase: 'IDLE',
      phaseStartTime: null,
      lastTickTime: null
    };
    setCurrentValues(BASELINE_STATE);
    setCurrentPhase('IDLE');
    setHistory([]);
    setAlerts([]);
  }, []);

  // Main Simulation Loop
  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const state = simState.current;
      
      // Initialize timestamps on the first interval tick to satisfy React purity rules
      if (state.lastTickTime === null || state.phaseStartTime === null) {
        state.lastTickTime = now;
        state.phaseStartTime = now;
        return; // Skip the first calculation to establish a clean time delta
      }

      // Calculate dt (in seconds) for accurate thermal math
      const dt = (now - state.lastTickTime) / 1000;
      const phaseElapsedTime = now - state.phaseStartTime;

      // 1. Check if we need to transition phases
      const nextPhase = getNextPhase(state.phase, phaseElapsedTime);
      if (nextPhase !== state.phase) {
        state.phase = nextPhase;
        state.phaseStartTime = now;
        setCurrentPhase(nextPhase); // Safely update the React state for the UI
      }

      // 2. Compute next tick telemetry
      const newTelemetry = tick(state.telemetry, state.phase, dt);
      
      // 3. Update internal ref state
      state.telemetry = newTelemetry;
      state.lastTickTime = now;

      // 4. Update React State for UI consumption
      setCurrentValues(newTelemetry);
      setAlerts(computeAlerts(newTelemetry));
      
      setHistory(prevHistory => {
        const dataPoint = { ...newTelemetry, timestamp: now };
        return [dataPoint, ...prevHistory].slice(0, historyLimit);
      });

    }, tickIntervalMs);

    // Cleanup interval on unmount or pause
    return () => clearInterval(intervalId);
    
  }, [isPaused, tickIntervalMs, historyLimit]);

  // Expose the API to the UI components
  return {
    currentValues,
    history,
    alerts,
    isPaused,
    currentPhase, // Returning the state variable, not the ref
    pause,
    resume,
    reset
  };
}