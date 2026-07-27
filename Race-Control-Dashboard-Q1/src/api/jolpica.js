const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

// Returns array: [{ position: "1", name: "Max Verstappen", team: "Red Bull", points: "400", wins: "15", nationality: "Dutch" }, ...]
export async function getDriverStandings() {
  const res = await fetch(`${BASE_URL}/current/driverStandings.json`);
  if (!res.ok) throw new Error(`Failed to fetch driver standings: ${res.status}`);
  const data = await res.json();
  
  const standings = data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
  
  return standings.map(driver => ({
    position: driver.position,
    name: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
    team: driver.Constructors[0]?.name || 'Unknown',
    points: driver.points,
    wins: driver.wins,
    nationality: driver.Driver.nationality
  }));
}

// Returns array: [{ position: "1", name: "Red Bull", points: "700", wins: "18", nationality: "Austrian" }, ...]
export async function getConstructorStandings() {
  const res = await fetch(`${BASE_URL}/current/constructorStandings.json`);
  if (!res.ok) throw new Error(`Failed to fetch constructor standings: ${res.status}`);
  const data = await res.json();
  
  const standings = data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
  
  return standings.map(team => ({
    position: team.position,
    name: team.Constructor.name,
    points: team.points,
    wins: team.wins,
    nationality: team.Constructor.nationality
  }));
}

// Returns array: [{ round: "1", name: "Bahrain Grand Prix", circuit: "Bahrain International Circuit", date: "2024-03-02", country: "Bahrain" }, ...]
export async function getRaceSchedule() {
  const res = await fetch(`${BASE_URL}/current.json`);
  if (!res.ok) throw new Error(`Failed to fetch race schedule: ${res.status}`);
  const data = await res.json();
  
  const races = data.MRData.RaceTable.Races || [];
  
  return races.map(race => ({
    round: race.round,
    name: race.raceName,
    circuit: race.Circuit.circuitName,
    date: race.date,
    country: race.Circuit.Location.country
  }));
}