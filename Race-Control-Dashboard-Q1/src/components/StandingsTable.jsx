import { useState, useEffect } from 'react';
import { getDriverStandings, getConstructorStandings } from '../api/jolpica';
import TabToggle from './TabToggle';
import SearchBar from './SearchBar';

// Utility helpers to extract fields across flattened or raw Ergast structures
const getItemName = (item) =>
  item.name || (item.Driver ? `${item.Driver.givenName} ${item.Driver.familyName}` : '');

const getItemTeam = (item) =>
  item.team || item.Constructors?.[0]?.name || item.Constructor?.name || '';

const getItemNationality = (item) =>
  item.nationality || item.Driver?.nationality || item.Constructor?.nationality || '';

export default function StandingsTable({ type = 'drivers' }) {
  const [activeTab, setActiveTab] = useState(type);
  const [standings, setStandings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchStandings() {
      setLoading(true);
      setError(null);
      try {
        const data =
          activeTab === 'drivers'
            ? await getDriverStandings()
            : await getConstructorStandings();

        if (isMounted) {
          setStandings(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch standings data.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchStandings();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // Case-insensitive filtering against name or team
  const filteredStandings = standings.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const name = getItemName(item).toLowerCase();
    const team = getItemTeam(item).toLowerCase();

    return name.includes(query) || team.includes(query);
  });

  return (
    <div className="bg-race-card border border-race-border rounded-lg p-6 shadow-md">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <TabToggle activeTab={activeTab} onChange={setActiveTab} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-race-muted py-8 text-center text-sm font-semibold">
          Loading...
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-race-red py-4 text-center text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Table Display */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-race-text">
            <thead className="text-xs uppercase bg-race-bg text-race-muted border-b border-race-border">
              <tr>
                <th className="px-4 py-3">Position</th>
                {activeTab === 'drivers' ? (
                  <>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Team</th>
                  </>
                ) : (
                  <th className="px-4 py-3">Team</th>
                )}
                <th className="px-4 py-3">Nationality</th>
                <th className="px-4 py-3">Points</th>
                <th className="px-4 py-3">Wins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-race-border">
              {filteredStandings.length > 0 ? (
                filteredStandings.map((item, index) => (
                  <tr key={item.position || index} className="hover:bg-race-bg/50">
                    <td className="px-4 py-3 font-bold text-race-red">
                      {item.position}
                    </td>
                    {activeTab === 'drivers' ? (
                      <>
                        <td className="px-4 py-3 font-medium">
                          {getItemName(item)}
                        </td>
                        <td className="px-4 py-3 text-race-muted">
                          {getItemTeam(item)}
                        </td>
                      </>
                    ) : (
                      <td className="px-4 py-3 font-medium">
                        {getItemName(item) || getItemTeam(item)}
                      </td>
                    )}
                    <td className="px-4 py-3 text-race-muted">
                      {getItemNationality(item)}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold">
                      {item.points}
                    </td>
                    <td className="px-4 py-3 font-mono text-race-muted">
                      {item.wins}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={activeTab === 'drivers' ? 6 : 5}
                    className="px-4 py-6 text-center text-race-muted"
                  >
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}