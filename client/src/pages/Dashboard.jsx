import { useEffect, useState } from 'react';
import axios from 'axios';
import StatusCard from '../components/shared/StatusCard.jsx';

const Dashboard = () => {
  const [latestShift, setLatestShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestShift = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/shiftlogs/latest`
        );
        setLatestShift(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch latest shift');
        setLatestShift(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestShift();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-cyan-500 mx-auto mb-4"></div>
          <p className="text-cyan-300 font-semibold">Loading system data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 m-6 bg-gradient-to-br from-red-900/20 to-red-800/10 border-l-4 border-red-500 rounded-lg backdrop-blur-sm">
        <p className="text-red-400 font-bold text-lg">⚠ System Error</p>
        <p className="text-red-300 text-sm mt-2">No shift logs found. Create a new shift log entry to initialize the system.</p>
      </div>
    );
  }

  if (!latestShift) {
    return (
      <div className="p-8 m-6 bg-gradient-to-br from-cyan-900/20 to-blue-800/10 border-l-4 border-cyan-500 rounded-lg backdrop-blur-sm">
        <p className="text-cyan-400 font-bold text-lg">ℹ No Data Available</p>
        <p className="text-cyan-300 text-sm mt-2">System ready. Create the first shift log entry to begin monitoring.</p>
      </div>
    );
  }

  // Determine equipment statuses based on anomalies
  const getEquipmentStatus = (anomalies, equipment) => {
    if (!anomalies) return { status: 'Normal', details: [] };
    const equipmentAnomalies = anomalies.filter((a) =>
      a.toLowerCase().includes(equipment.toLowerCase())
    );
    if (equipmentAnomalies.length === 0) {
      return { status: 'Normal', details: [] };
    }
    const hasCritical = equipmentAnomalies.some((a) => a.includes('CRITICAL') || a.includes('LOCKOUT'));
    return {
      status: hasCritical ? 'Critical' : 'Warning',
      details: equipmentAnomalies,
    };
  };

  const transformerStatus = getEquipmentStatus(latestShift.anomalies, 'T/F');
  const breakerStatus = getEquipmentStatus(latestShift.anomalies, 'SF6');
  const batteryStatus = getEquipmentStatus(latestShift.anomalies, 'Battery');
  const busStatus = getEquipmentStatus(latestShift.anomalies, 'Bus');

  return (
    <div className="p-8 space-y-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border border-cyan-500/30 text-white p-8 rounded-xl shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-cyan-300">System Health Overview</h1>
            <p className="text-slate-300 text-sm font-semibold">
              <span className="text-cyan-400">●</span> Last Updated: {new Date(latestShift.date).toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-900/50 border border-cyan-500/50 px-6 py-4 rounded-lg text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Shift Information</p>
            <p className="text-lg font-bold text-cyan-400">{latestShift.shiftType}</p>
            <p className="text-sm text-slate-300">Operator: {latestShift.operator}</p>
          </div>
        </div>
      </div>

      {/* Bus Readings - Key Metrics */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: '220 kV Bus', value: latestShift.busReadings?.bus220kV?.toFixed(2), unit: 'kV', normal: '209–231', icon: '⚡' },
          { label: '132 kV Bus', value: latestShift.busReadings?.bus132kV?.toFixed(2), unit: 'kV', normal: '125.4–138.6', icon: '⚡' },
          { label: 'Grid Frequency', value: latestShift.busReadings?.frequency?.toFixed(2), unit: 'Hz', normal: '49.5–50.5', icon: '~' },
        ].map((metric, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-6 rounded-lg backdrop-blur-sm hover:border-cyan-500/50 transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{metric.label}</p>
              </div>
              <span className="text-2xl">{metric.icon}</span>
            </div>
            <p className="text-3xl font-bold text-cyan-300 mb-2">
              {metric.value || '—'} <span className="text-lg text-slate-400">{metric.unit}</span>
            </p>
            <p className="text-xs text-slate-500">Normal Range: {metric.normal}</p>
          </div>
        ))}
      </div>

      {/* Equipment Status Grid */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-cyan-300 flex items-center gap-2">
            <span className="text-2xl">⚙</span> Equipment Status
          </h2>
          <p className="text-slate-400 text-sm mt-1">Real-time monitoring of critical components</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <StatusCard
            title="Power Transformers"
            status={transformerStatus.status}
            details={transformerStatus.details}
          />
          <StatusCard
            title="SF6 Breakers"
            status={breakerStatus.status}
            details={breakerStatus.details}
          />
          <StatusCard title="DC Battery Bank" status={batteryStatus.status} details={batteryStatus.details} />
          <StatusCard title="Bus Voltages" status={busStatus.status} details={busStatus.details} />
        </div>
      </div>

      {/* Anomalies Alert Section */}
      {latestShift.anomalies && latestShift.anomalies.length > 0 && (
        <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-l-4 border-red-500 p-6 rounded-lg backdrop-blur-sm">
          <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
            <span className="text-2xl">🚨</span> System Alerts
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-red-500/30">
                  <th className="p-3 text-left text-red-300 font-semibold">#</th>
                  <th className="p-3 text-left text-red-300 font-semibold">Alert Details</th>
                </tr>
              </thead>
              <tbody>
                {latestShift.anomalies.map((anomaly, idx) => (
                  <tr key={idx} className="border-b border-red-500/10 hover:bg-red-500/5 transition">
                    <td className="p-3 font-bold text-red-400">{idx + 1}</td>
                    <td className="p-3 text-red-300">{anomaly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-center pt-4">
        <a
          href="/shift-log"
          className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-cyan-500/30 transition duration-200 flex items-center gap-2"
        >
          <span>+</span> Create New Shift Entry
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
