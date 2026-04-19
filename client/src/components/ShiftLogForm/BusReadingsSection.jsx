const BusReadingsSection = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: parseFloat(value) || 0,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold mb-4">Bus Readings</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">220 kV Bus (kV)</label>
          <input
            type="number"
            step="0.1"
            value={data.bus220kV || ''}
            onChange={(e) => handleChange('bus220kV', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="220.0"
          />
          <span className="text-xs text-gray-500">Normal: 209–231 kV</span>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">132 kV Bus (kV)</label>
          <input
            type="number"
            step="0.1"
            value={data.bus132kV || ''}
            onChange={(e) => handleChange('bus132kV', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="132.0"
          />
          <span className="text-xs text-gray-500">Normal: 125.4–138.6 kV</span>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Frequency (Hz)</label>
          <input
            type="number"
            step="0.01"
            value={data.frequency || ''}
            onChange={(e) => handleChange('frequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="50.0"
          />
          <span className="text-xs text-gray-500">Normal: 49.5–50.5 Hz</span>
        </div>
      </div>
    </div>
  );
};

export default BusReadingsSection;
