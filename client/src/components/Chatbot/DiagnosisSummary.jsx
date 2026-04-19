import ChecklistDisplay from './ChecklistDisplay.jsx';

const DiagnosisSummary = ({ fault, sessionData }) => {
  if (!fault) return null;

  const severityColors = {
    Critical: 'bg-red-900/20 border-red-500/50 text-red-300',
    High: 'bg-orange-900/20 border-orange-500/50 text-orange-300',
    Medium: 'bg-yellow-900/20 border-yellow-500/50 text-yellow-300',
    Low: 'bg-green-900/20 border-green-500/50 text-green-300',
  };

  const severityIcons = {
    Critical: '🚨',
    High: '⚠️',
    Medium: '⚡',
    Low: 'ℹ️',
  };

  const severityBadgeColors = {
    Critical: 'bg-red-600 text-white',
    High: 'bg-orange-600 text-white',
    Medium: 'bg-yellow-600 text-white',
    Low: 'bg-green-600 text-white',
  };

  const colorClass = severityColors[fault.severity] || severityColors.Medium;
  const badgeClass = severityBadgeColors[fault.severity] || severityBadgeColors.Medium;
  const icon = severityIcons[fault.severity] || '❓';

  return (
    <div>
      {/* Fault Title and Severity */}
      <div className={`border-l-4 p-6 rounded-lg mb-6 ${colorClass} backdrop-blur-sm`}>
        <div className="flex items-start space-x-4">
          <span className="text-4xl">{icon}</span>
          <div>
            <h2 className="text-2xl font-bold mb-2 text-cyan-300">{fault.faultTitle}</h2>
            <p className={`inline-block px-3 py-1 rounded font-semibold ${badgeClass}`}>
              Severity: {fault.severity}
            </p>
            {fault.basedOnIncident && (
              <p className="text-sm font-semibold mt-2 text-slate-300">Based on: {fault.basedOnIncident}</p>
            )}
          </div>
        </div>
      </div>

      {/* Immediate Actions */}
      {fault.immediateActions && fault.immediateActions.length > 0 && (
        <div className="bg-red-900/20 border-l-4 border-red-500/50 p-4 rounded-lg mb-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-red-400 mb-3">🔴 IMMEDIATE ACTIONS</h3>
          <ul className="space-y-2">
            {fault.immediateActions.map((action, idx) => (
              <li key={idx} className="text-red-300/90 flex items-start space-x-2">
                <span className="font-bold">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Investigation Checklist */}
      {fault.checklist && fault.checklist.length > 0 && (
        <ChecklistDisplay checklist={fault.checklist} sessionData={sessionData} />
      )}
    </div>
  );
};

export default DiagnosisSummary;
