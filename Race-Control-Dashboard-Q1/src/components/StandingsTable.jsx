import { useState, useEffect } from 'react';
import { getDriverStandings, getConstructorStandings } from '../api/jolpica';
import TabToggle from './TabToggle';
import SearchBar from './SearchBar';
import DriverModal from './DriverModal';

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
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchStandings() {
      setLoading(true);
      setError(null);
      setSelectedDriver(null);
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

  const filteredStandings = standings.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const name = getItemName(item).toLowerCase();
    const team = getItemTeam(item).toLowerCase();

    return name.includes(query) || team.includes(query);
  });

  // Podium distinction for Top 3
  const renderPositionBadge = (posStr) => {
    const pos = Number(posStr);
    if (pos === 1) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-race-red text-white text-xs font-extrabold font-mono shadow">
          1
        </span>
      );
    }
    if (pos === 2) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-race-border text-race-text text-xs font-bold font-mono">
          2
        </span>
      );
    }
    if (pos === 3) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-race-bg text-race-muted text-xs font-bold font-mono border border-race-border">
          3
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 text-race-muted text-xs font-mono">
        {posStr}
      </span>
    );
  };

  return (
    <div className="bg-race-card border border-race-border rounded-xl p-6 shadow-xl">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <TabToggle activeTab={activeTab} onChange={setActiveTab} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-race-muted py-12 text-center text-xs font-semibold uppercase tracking-wider animate-pulse">
          Loading telemetry...
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-race-red py-6 text-center text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Table Display */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-race-text border-collapse">
            <thead className="text-[11px] uppercase tracking-wider bg-race-bg text-race-muted border-b border-race-border">
              <tr>
                <th className="px-4 py-3 font-semibold text-center w-12">Pos</th>
                {activeTab === 'drivers' ? (
                  <>
                    <th className="px-4 py-3 font-semibold">Driver</th>
                    <th className="px-4 py-3 font-semibold">Team</th>
                  </>
                ) : (
                  <th className="px-4 py-3 font-semibold">Team</th>
                )}
                <th className="px-4 py-3 font-semibold">Nation</th>
                <th className="px-4 py-3 font-semibold text-right">Pts</th>
                <th className="px-4 py-3 font-semibold text-right">Wins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-race-border">
              {filteredStandings.length > 0 ? (
                filteredStandings.map((item, index) => {
                  const isDriverTab = activeTab === 'drivers';
                  return (
                    <tr
                      key={item.position || index}
                      onClick={() => isDriverTab && setSelectedDriver(item)}
                      className={`transition-colors duration-150 ${
                        isDriverTab
                          ? 'cursor-pointer hover:bg-race-card-hover'
                          : 'hover:bg-race-card-hover'
                      }`}
                    >
                      <td className="px-4 py-3.5 text-center">
                        {renderPositionBadge(item.position)}
                      </td>
                      {isDriverTab ? (
                        <>
                          <td className="px-4 py-3.5 font-semibold text-race-text">
                            {getItemName(item)}
                          </td>
                          <td className="px-4 py-3.5 text-race-muted text-xs">
                            {getItemTeam(item)}
                          </td>
                        </>
                      ) : (
                        <td className="px-4 py-3.5 font-semibold text-race-text">
                          {getItemName(item) || getItemTeam(item)}
                        </td>
                      )}
                      <td className="px-4 py-3.5 text-race-muted text-xs">
                        {getItemNationality(item)}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-right text-race-text">
                        {item.points}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-race-muted text-right text-xs">
                        {item.wins}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={activeTab === 'drivers' ? 6 : 5}
                    className="px-4 py-8 text-center text-race-muted text-xs uppercase tracking-wider"
                  >
                    No matching standings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Driver Detail Modal */}
      <DriverModal
        driver={selectedDriver}
        onClose={() => setSelectedDriver(null)}
      />
    </div>
  );
}