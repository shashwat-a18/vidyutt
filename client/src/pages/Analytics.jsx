import { useState, useEffect } from 'react';
import axios from 'axios';
import TrendChart from '../components/Analytics/TrendChart.jsx';

const Analytics = () => {
  const [equipment, setEquipment] = useState('200 MVA T/F-1 (BHEL)');
  const [parameter, setParameter] = useState('OTI');
  const [days, setDays] = useState(7);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alarmThreshold, setAlarmThreshold] = useState(85);

  const equipmentOptions = {
    Transformers: ['200 MVA T/F-1 (BHEL)', '200 MVA T/F-2 (BHEL)', '40 MVA T/F'],
    Feeders: ['Banda Town', 'Atarra', 'Baberu', 'Pailani', 'Augasi', 'Karvi/Rajapur'],
    Bus: ['220 kV Bus', '132 kV Bus'],
    Battery: ['110V DC Battery Bank (Exide OPzS 300P, 55 cells)'],
  };

  const parametersByEquipment = {
    '200 MVA T/F-1 (BHEL)': ['OTI', 'WTI'],
    '200 MVA T/F-2 (BHEL)': ['OTI', 'WTI'],
    '40 MVA T/F': ['OTI', 'WTI'],
    'Banda Town': ['MW', 'MVAR'],
    'Atarra': ['MW', 'MVAR'],
    'Baberu': ['MW', 'MVAR'],
    'Pailani': ['MW', 'MVAR'],
    'Augasi': ['MW', 'MVAR'],
    'Karvi/Rajapur': ['MW', 'MVAR'],
    '220 kV Bus': ['Voltage'],
    '132 kV Bus': ['Voltage'],
    '110V DC Battery Bank (Exide OPzS 300P, 55 cells)': ['floatVoltage', 'floatCurrent'],
  };

  const thresholds = {
    OTI: 85,
    WTI: 90,
    MW: 150,
    MVAR: 100,
    Voltage: 220,
    floatVoltage: 122.65,
    floatCurrent: 10,
  };

  useEffect(() => {
    // Reset parameter when equipment changes
    const availableParams = parametersByEquipment[equipment];
    if (availableParams && !availableParams.includes(parameter)) {
      setParameter(availableParams[0]);
    }
  }, [equipment]);

  useEffect(() => {
    setAlarmThreshold(thresholds[parameter] || 0);
  }, [parameter]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/analytics?equipment=${equipment}&parameter=${parameter}&days=${days}`
        );
        setData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [equipment, parameter, days]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border border-cyan-500/30 text-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-2 text-cyan-300">📈 Analytics & Trends</h1>
        <p className="text-slate-300 text-sm">Monitor equipment performance over time with anomaly detection</p>
      </div>

      {/* Controls Section */}
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-6 rounded-lg backdrop-blur-sm">
        <h2 className="text-cyan-300 font-semibold mb-4 text-sm uppercase tracking-wider">Query Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">Equipment</label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-900 text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
            >
              {Object.entries(equipmentOptions).map(([category, items]) => (
                <optgroup key={category} label={category} className="bg-slate-800">
                  {items.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">Parameter</label>
            <select
              value={parameter}
              onChange={(e) => setParameter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-900 text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
            >
              {parametersByEquipment[equipment]?.map((param) => (
                <option key={param} value={param}>
                  {param}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">Time Range</label>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-900 text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">Alarm Threshold</label>
            <input
              type="number"
              value={alarmThreshold}
              readOnly
              className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-900/50 text-cyan-300 font-semibold cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {loading ? (
        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-12 rounded-lg backdrop-blur-sm text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-cyan-500 mx-auto mb-4"></div>
          <p className="text-cyan-300 font-semibold">Loading data...</p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-6 rounded-lg backdrop-blur-sm">
          <TrendChart data={data} equipment={equipment} parameter={parameter} alarmThreshold={alarmThreshold} />
        </div>
      )}
    </div>
  );
};

export default Analytics;
