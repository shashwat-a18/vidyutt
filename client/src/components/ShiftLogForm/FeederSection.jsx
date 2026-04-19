const FeederSection = ({ data, onChange }) => {
  const feederNames = ['Banda Town', 'Atarra', 'Baberu', 'Pailani', 'Augasi', 'Karvi/Rajapur'];

  const handleFeederChange = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: isNaN(value) ? value : parseFloat(value) };
    onChange(updated);
  };

  const ensureFeedersExist = () => {
    if (!data || data.length === 0) {
      return feederNames.map((name) => ({
        name,
        MW: null,
        MVAR: null,
        status: 'Energised',
      }));
    }
    return data;
  };

  const feeders = ensureFeedersExist();

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold mb-4">132 kV Outgoing Feeders</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feeders.map((feeder, idx) => (
          <div key={idx} className="p-4 border border-gray-300 rounded-lg">
            <h4 className="font-semibold mb-3">{feeder.name}</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">MW</label>
                <input
                  type="number"
                  step="0.1"
                  value={feeder.MW || ''}
                  onChange={(e) => handleFeederChange(idx, 'MW', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">MVAR</label>
                <input
                  type="number"
                  step="0.1"
                  value={feeder.MVAR || ''}
                  onChange={(e) => handleFeederChange(idx, 'MVAR', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={feeder.status || 'Energised'}
                  onChange={(e) => handleFeederChange(idx, 'status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="Energised">Energised</option>
                  <option value="On-Maintenance">On-Maintenance</option>
                  <option value="Tripped">Tripped</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeederSection;
