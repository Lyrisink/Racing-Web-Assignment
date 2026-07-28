const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

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
    time: race.time, // Add main race time
    country: race.Circuit.Location.country,
    // Safely capture all possible nested session objects
    FirstPractice: race.FirstPractice,
    SecondPractice: race.SecondPractice,
    ThirdPractice: race.ThirdPractice,
    Qualifying: race.Qualifying,
    Sprint: race.Sprint,
    SprintQualifying: race.SprintQualifying || race.SprintShootout 
  }));
}