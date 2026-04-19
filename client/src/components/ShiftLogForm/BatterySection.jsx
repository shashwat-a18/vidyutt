const BatterySection = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: isNaN(value) ? value : parseFloat(value),
    });
  };

  const floatVoltage = data?.floatVoltage;
  let voltageStatus = 'Normal';
  let voltageClass = 'bg-green-50';

  if (floatVoltage > 126) {
    voltageStatus = 'High';
    voltageClass = 'bg-yellow-50';
  } else if (floatVoltage < 120) {
    voltageStatus = 'Low';
    voltageClass = 'bg-red-50';
  }

  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 ${voltageClass}`}>
      <h3 className="text-lg font-bold mb-4">110V DC Battery Bank (Exide OPzS 300P, 55 cells)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Total Float Voltage (V)</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              step="0.1"
              value={data?.floatVoltage || ''}
              onChange={(e) => handleChange('floatVoltage', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="122.65"
            />
            <span className={`px-3 py-2 rounded font-semibold ${voltageStatus === 'High' ? 'bg-yellow-100 text-yellow-800' : voltageStatus === 'Low' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {voltageStatus}
            </span>
          </div>
          <span className="text-xs text-gray-500">Normal range: 120–126 V</span>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Float Current (A)</label>
          <input
            type="number"
            step="0.1"
            value={data?.floatCurrent || ''}
            onChange={(e) => handleChange('floatCurrent', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="0.0"
          />
          <span className="text-xs text-gray-500">Typical: 2–5 A at float</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Cell-Level Remarks</label>
        <textarea
          value={data?.remarks || ''}
          onChange={(e) => handleChange('remarks', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          placeholder="Individual cell voltages, specific gravity, breather condition, etc."
          rows="3"
        />
      </div>
    </div>
  );
};

export default BatterySection;
