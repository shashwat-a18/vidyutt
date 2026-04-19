const TransformerSection = ({ data, onChange }) => {
  const transformerNames = ['200 MVA T/F-1 (BHEL)', '200 MVA T/F-2 (BHEL)', '40 MVA T/F'];

  const handleTransformerChange = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: isNaN(value) ? value : parseFloat(value) };
    onChange(updated);
  };

  const ensureTransformersExist = () => {
    if (!data || data.length === 0) {
      return transformerNames.map((name) => ({
        name,
        OTI: null,
        WTI: null,
        oilLevel: 'Normal',
        OLTCPosition: null,
        OLTCOperationCount: null,
        coolingFanStatus: 'Auto',
        remarks: '',
      }));
    }
    return data;
  };

  const transformers = ensureTransformersExist();

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold mb-4">Transformers</h3>
      <div className="space-y-4">
        {transformers.map((transformer, idx) => (
          <div key={idx} className="p-4 border border-gray-300 rounded-lg">
            <h4 className="font-semibold mb-3">{transformer.name}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">OTI (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={transformer.OTI || ''}
                  onChange={(e) => handleTransformerChange(idx, 'OTI', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
                <span className="text-xs text-red-500">Alarm: ≥85°C | Trip: ≥95°C</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">WTI (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={transformer.WTI || ''}
                  onChange={(e) => handleTransformerChange(idx, 'WTI', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
                <span className="text-xs text-red-500">Alarm: ≥90°C | Trip: ≥100°C</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Oil Level</label>
                <select
                  value={transformer.oilLevel || 'Normal'}
                  onChange={(e) => handleTransformerChange(idx, 'oilLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">OLTC Position (Tap)</label>
                <input
                  type="number"
                  value={transformer.OLTCPosition || ''}
                  onChange={(e) => handleTransformerChange(idx, 'OLTCPosition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">OLTC Ops (Count)</label>
                <input
                  type="number"
                  value={transformer.OLTCOperationCount || ''}
                  onChange={(e) => handleTransformerChange(idx, 'OLTCOperationCount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cooling Fan</label>
                <select
                  value={transformer.coolingFanStatus || 'Auto'}
                  onChange={(e) => handleTransformerChange(idx, 'coolingFanStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="Auto">Auto</option>
                  <option value="Manual-On">Manual-On</option>
                  <option value="Off">Off</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <textarea
                value={transformer.remarks || ''}
                onChange={(e) => handleTransformerChange(idx, 'remarks', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Any additional notes"
                rows="2"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransformerSection;
