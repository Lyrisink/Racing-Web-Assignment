const BASE_URL = 'https://api.openf1.org/v1';

// Returns array: [{ session_key: 9158, session_name: "Race", date_start: "2023-11-26T13:00:00+00:00", ... }, ...]
export async function getSessions(year) {
  const res = await fetch(`${BASE_URL}/sessions?year=${year}`);
  if (!res.ok) throw new Error(`Failed to fetch sessions: ${res.status}`);
  return await res.json();
}

// Returns object: { meeting_key: 1219, meeting_name: "Singapore Grand Prix", date_start: "2026-10-09T09:30:00+00:00", location: "Marina Bay", ... }
export async function getUpcomingMeeting() {
  const res = await fetch(`${BASE_URL}/meetings?year=2026`);
  if (!res.ok) throw new Error(`Failed to fetch meetings: ${res.status}`);
  const meetings = await res.json();
  
  // Sort chronologically by start date
  meetings.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
  
  const now = new Date();
  const nextMeeting = meetings.find(m => new Date(m.date_start) > now);
  
  // Return the next upcoming meeting, or default to the most recent past one if the season is over
  return nextMeeting || meetings[meetings.length - 1];
}

// Returns array: [{ driver_number: 1, full_name: "Max VERSTAPPEN", team_name: "Red Bull Racing", ... }, ...]
export async function getDrivers(sessionKey) {
  const res = await fetch(`${BASE_URL}/drivers?session_key=${sessionKey}`);
  if (!res.ok) throw new Error(`Failed to fetch drivers: ${res.status}`);
  return await res.json();
}

// Returns integer: 9158
export async function getLatestSessionKey() {
  const res = await fetch(`${BASE_URL}/sessions?session_key=latest`);
  if (!res.ok) throw new Error(`Failed to fetch latest session: ${res.status}`);
  const data = await res.json();
  return data[0]?.session_key;
}

// Returns array: [{ track_temperature: 32.5, air_temperature: 28.1, wind_direction: 130, date: "2024-03-02T15:00:00+00:00", ... }, ...]
export async function getWeather(sessionKey) {
  const res = await fetch(`${BASE_URL}/weather?session_key=${sessionKey}`);
  if (!res.ok) throw new Error(`Failed to fetch weather: ${res.status}`);
  return await res.json();
}