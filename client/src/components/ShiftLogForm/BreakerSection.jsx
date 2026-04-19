import { sf6TempCorrection, determineSF6Status } from '../../utils/sf6TempCorrection.js';

const BreakerSection = ({ data, onChange }) => {
  const breakers = [
    { name: '220 kV T/F Bay - Feeder 1', type: '220kV' },
    { name: '220 kV T/F Bay - Feeder 2', type: '220kV' },
    { name: '132 kV Incoming', type: '132kV' },
  ];

  const handleBreakerChange = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: isNaN(value) ? value : parseFloat(value) };

    // Auto-calculate corrected status
    if (field === 'SF6Pressure' || field === 'ambientTemp') {
      if (updated[index].SF6Pressure && updated[index].ambientTemp) {
        const corrected = sf6TempCorrection(updated[index].SF6Pressure, updated[index].ambientTemp);
        updated[index].SF6CorrectedStatus = determineSF6Status(corrected);
      }
    }

    onChange(updated);
  };

  const ensureBreakersExist = () => {
    if (!data || data.length === 0) {
      return breakers.map((b) => ({
        name: b.name,
        SF6Pressure: null,
        ambientTemp: 25,
        SF6CorrectedStatus: 'Normal',
      }));
    }
    return data;
  };

  const breaker_list = ensureBreakersExist();

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold mb-4">SF6 Circuit Breakers</h3>
      <p className="text-sm text-gray-600 mb-4">
        ℹ️ SF6 pressure is automatically temperature-corrected. Alarm: &lt;5.2 bar | Lockout: &lt;4.8 bar
      </p>
      <div className="space-y-4">
        {breaker_list.map((breaker, idx) => {
          const correctedPressure = breaker.SF6Pressure && breaker.ambientTemp ? sf6TempCorrection(breaker.SF6Pressure, breaker.ambientTemp) : null;
          const status = correctedPressure ? determineSF6Status(correctedPressure) : 'Normal';

          const statusBgColor = status === 'Lockout' ? 'bg-red-50' : status === 'Alarm' ? 'bg-yellow-50' : 'bg-green-50';

          return (
            <div key={idx} className={`p-4 border border-gray-300 rounded-lg ${statusBgColor}`}>
              <h4 className="font-semibold mb-3">{breaker.name}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pressure (bar)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={breaker.SF6Pressure || ''}
                    onChange={(e) => handleBreakerChange(idx, 'SF6Pressure', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ambient Temp (°C)</label>
                  <input
                    type="number"
                    step="1"
                    value={breaker.ambientTemp || ''}
                    onChange={(e) => handleBreakerChange(idx, 'ambientTemp', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Corrected Pressure</label>
                  <input
                    type="text"
                    value={correctedPressure ? correctedPressure.toFixed(2) : 'N/A'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <input
                    type="text"
                    value={status}
                    readOnly
                    className={`w-full px-3 py-2 border rounded-lg font-semibold ${
                      status === 'Lockout' ? 'bg-red-100 text-red-800 border-red-300' : status === 'Alarm' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-green-100 text-green-800 border-green-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BreakerSection;
