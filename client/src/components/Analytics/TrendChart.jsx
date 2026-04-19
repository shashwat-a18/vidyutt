import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import AnomalyBadge from './AnomalyBadge.jsx';

const TrendChart = ({ data, equipment, parameter, alarmThreshold }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-8 text-center rounded-lg backdrop-blur-sm">
        <p className="text-slate-400 text-sm">📊 No data available yet for <span className="text-cyan-300 font-semibold">{equipment} - {parameter}</span></p>
        <p className="text-slate-500 text-xs mt-2">Create shift log entries to generate analytics data</p>
      </div>
    );
  }

  // Find anomalies
  const anomalies = data.filter((d) => d.value > d.threshold);

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/50 p-6 rounded-lg backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-4 text-cyan-300">
        {equipment} — {parameter}
      </h3>

      <div className="mb-4 flex items-center space-x-4 flex-wrap">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-blue-400 rounded"></span>
          <span className="text-sm text-slate-300">Actual Value</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded"></span>
          <span className="text-sm text-slate-300">Alarm Threshold ({alarmThreshold})</span>
        </div>
        {anomalies.length > 0 && (
          <div className="ml-auto text-orange-400 font-bold text-sm">
            ⚠️ {anomalies.length} anomaly/anomalies detected
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#e2e8f0' }}
            cursor={{ stroke: '#0ea5e9', strokeWidth: 1 }}
          />
          <Legend 
            wrapperStyle={{ color: '#cbd5e1' }}
          />
          <ReferenceLine
            y={alarmThreshold}
            stroke="#ef4444"
            strokeDasharray="5 5"
            label={{ value: `Alarm: ${alarmThreshold}`, position: 'right', fill: '#fca5a5', fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (payload.value > payload.threshold) {
                return (
                  <AnomalyBadge key={payload.date} cx={cx} cy={cy} value={payload.value} threshold={payload.threshold} />
                );
              }
              return <circle cx={cx} cy={cy} r={3} fill="#3b82f6" />;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
