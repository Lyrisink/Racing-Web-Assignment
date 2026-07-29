/**
 * telemetrySimulator.js
 * 
 * Pure functions and state definitions for the Formula Student EV telemetry simulator.
 * No side-effects, making it highly testable and predictable.
 */

// --- Constants & Assumptions (Formula Student EV Context) ---
// Battery: 400V nominal pack (approx 96 series cells). 
// Motor: Single-speed direct drive or fixed reduction (gear is always 1). Max RPM ~10,000.
// Cooling: Passive/active hybrid; temps rise quickly under load and fall slowly.

export const BASELINE_STATE = {
  speed: 0,              // km/h
  rpm: 0,                // rev/min
  throttle: 0,           // 0-100 %
  brakePressure: 0,      // 0-100 bar/percent
  gear: 1,               // Single speed EV assumption
  steeringAngle: 0,      // -90 to +90 degrees
  batteryVoltage: 400,   // Volts (resting)
  batteryTemp: 25,       // °C
  motorTemp: 25,         // °C
  currentDraw: 0         // Amps
};

// Alert Thresholds
export const THRESHOLDS = {
  batteryTemp: { warning: 60, critical: 75 },
  batteryVoltage: { warning: 320, critical: 300 },
  motorTemp: { warning: 90, critical: 110 },
  rpm: { warning: 9000, critical: 9500 }
};

// Phases map to realistic driving states on a track.
export const PHASES = ['IDLE', 'ACCELERATING', 'CRUISING', 'BRAKING', 'CORNERING'];

// Utility: Linear interpolation for smooth gauge movements
const lerp = (start, end, factor) => start + (end - start) * factor;
// Utility: Random number in range
const randomRange = (min, max) => Math.random() * (max - min) + min;

/**
 * Determines if we should transition to a new phase based on elapsed time.
 * Cycles through a typical track sequence: Accel -> Cruise -> Brake -> Corner -> Accel...
 */
export function getNextPhase(currentPhase, phaseElapsedTime) {
  // Define randomized max durations for each phase to feel organic
  const durations = {
    IDLE: { min: 2000, max: 4000, next: 'ACCELERATING' },
    ACCELERATING: { min: 3000, max: 6000, next: 'CRUISING' },
    CRUISING: { min: 2000, max: 5000, next: 'BRAKING' },
    BRAKING: { min: 1500, max: 3000, next: 'CORNERING' },
    CORNERING: { min: 3000, max: 5000, next: 'ACCELERATING' }
  };

  const config = durations[currentPhase];
  
  // If time spent in current phase exceeds the random limit, transition
  if (phaseElapsedTime >= config.max || (phaseElapsedTime >= config.min && Math.random() > 0.95)) {
    // 5% chance to drop to IDLE from Braking for realism (simulating a full stop/traffic)
    if (currentPhase === 'BRAKING' && Math.random() > 0.95) return 'IDLE';
    return config.next;
  }
  
  return currentPhase; // Stay in current phase
}

/**
 * The core simulation tick.
 * @param {Object} prevState - The telemetry state from the previous tick.
 * @param {String} phase - The current driving phase.
 * @param {Number} dt - Time delta in seconds (used for thermal integration).
 * @returns {Object} A new state object with updated values.
 */
export function tick(prevState, phase, dt) {
  const next = { ...prevState };
  const smooth = 0.15; // How quickly mechanical inputs reach their targets

  // 1. Set driver input targets based on phase
  let targetThrottle = 0;
  let targetBrake = 0;
  let targetSteering = 0;

  switch (phase) {
    case 'IDLE':
      targetBrake = 100; // Holding brakes
      break;
    case 'ACCELERATING':
      targetThrottle = randomRange(80, 100);
      targetBrake = 0;
      targetSteering = randomRange(-5, 5); // Slight wheel wobble
      break;
    case 'CRUISING':
      targetThrottle = randomRange(30, 50); // Just enough to maintain speed
      targetBrake = 0;
      targetSteering = randomRange(-2, 2);
      break;
    case 'BRAKING':
      targetThrottle = 0;
      targetBrake = randomRange(70, 100);
      targetSteering = randomRange(-5, 5);
      break;
    case 'CORNERING':
      targetThrottle = randomRange(20, 40); // Trail braking / maintenance throttle
      targetBrake = randomRange(0, 15);
      // Pick a hard left or right randomly for the duration of the corner
      targetSteering = prevState.steeringAngle > 0 ? randomRange(30, 70) : randomRange(-70, -30);
      // Initialize cornering direction if just entered from straight
      if (Math.abs(prevState.steeringAngle) < 10) {
        targetSteering = Math.random() > 0.5 ? 45 : -45;
      }
      break;
    default:
      break;
  }

  // 2. Interpolate driver inputs for smooth UI curves
  next.throttle = lerp(prevState.throttle, targetThrottle, smooth);
  next.brakePressure = lerp(prevState.brakePressure, targetBrake, smooth * 1.5); // Brakes apply faster
  next.steeringAngle = lerp(prevState.steeringAngle, targetSteering, smooth * 0.8);

  // 3. Calculate Speed and RPM based on inputs
  // Acceleration is positive from throttle, negative from drag (speed * const) and brakes
  const acceleration = (next.throttle * 0.5) - (next.brakePressure * 0.8) - (prevState.speed * 0.05);
  next.speed = Math.max(0, Math.min(120, prevState.speed + acceleration));
  
  // Single-speed EV assumption: RPM is directly proportional to speed.
  // 120 km/h = ~10,000 RPM. Added a tiny bit of random noise for realism.
  next.rpm = (next.speed * (10000 / 120)) + randomRange(-50, 50);
  if (next.speed < 1) next.rpm = 0; 
  next.gear = 1; // Constant for single-speed

  // 4. Electrical load calculations
  // Current spikes under high throttle, especially at lower speeds (torque curve)
  const baseCurrent = 5; // Systems on, standby
  const driveCurrent = (next.throttle / 100) * 280; // Max 280A draw
  next.currentDraw = lerp(prevState.currentDraw, baseCurrent + driveCurrent, smooth);

  // Voltage sags proportional to current draw (V = V_nominal - I*R_internal)
  const packNominal = 400;
  const internalResistance = 0.08; // ohms
  const voltageSag = next.currentDraw * internalResistance;
  next.batteryVoltage = lerp(prevState.batteryVoltage, packNominal - voltageSag, smooth * 2);

  // 5. Thermal simulation (Euler integration using dt)
  // Heat is generated by current^2 (copper losses) and RPM (iron/friction losses).
  // Cooling is proportional to (Temp - Ambient) and airflow (speed).
  const ambient = 25;
  
  // Battery thermal mass is high (changes slowly)
  const battHeat = (next.currentDraw * next.currentDraw) * 0.000005;
  const battCooling = (prevState.batteryTemp - ambient) * 0.001 * (1 + next.speed * 0.01);
  next.batteryTemp = prevState.batteryTemp + (battHeat - battCooling) * dt;

  // Motor thermal mass is lower (heats/cools faster than battery)
  const motorHeat = (next.currentDraw * next.rpm) * 0.0000002;
  const motorCooling = (prevState.motorTemp - ambient) * 0.005 * (1 + next.speed * 0.02);
  next.motorTemp = Math.min(130, prevState.motorTemp + (motorHeat - motorCooling) * dt);

  return next;
}

/**
 * Derives current alert states based on the telemetry tick.
 * This runs every tick, creating a reactive derived layer.
 */
export function computeAlerts(state) {
  const alerts = [];

  const check = (metric, name, unit) => {
    const val = state[metric];
    const limits = THRESHOLDS[metric];
    if (val >= limits.critical || (metric === 'batteryVoltage' && val <= limits.critical)) {
      alerts.push({ id: metric, level: 'CRITICAL', message: `${name} Critical: ${val.toFixed(1)}${unit}` });
    } else if (val >= limits.warning || (metric === 'batteryVoltage' && val <= limits.warning)) {
      alerts.push({ id: metric, level: 'WARNING', message: `${name} Warning: ${val.toFixed(1)}${unit}` });
    }
  };

  check('batteryTemp', 'Battery Temp', '°C');
  check('motorTemp', 'Motor Temp', '°C');
  check('rpm', 'Motor RPM', ' rpm');
  check('batteryVoltage', 'Battery Voltage', 'V');

  return alerts;
}