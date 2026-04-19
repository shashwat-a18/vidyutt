const StatusCard = ({ title, status, details = [] }) => {
  const statusConfig = {
    Normal: {
      bg: 'bg-gradient-to-br from-emerald-900/20 to-emerald-800/10',
      border: 'border-l-4 border-emerald-500',
      indicator: '✓',
      indicatorBg: 'bg-emerald-500/20',
      indicatorColor: 'text-emerald-400',
      titleColor: 'text-emerald-400',
      pulse: 'animate-pulse',
    },
    Warning: {
      bg: 'bg-gradient-to-br from-amber-900/20 to-amber-800/10',
      border: 'border-l-4 border-amber-500',
      indicator: '⚠',
      indicatorBg: 'bg-amber-500/20',
      indicatorColor: 'text-amber-400',
      titleColor: 'text-amber-400',
      pulse: 'animate-pulse',
    },
    Critical: {
      bg: 'bg-gradient-to-br from-red-900/20 to-red-800/10',
      border: 'border-l-4 border-red-500',
      indicator: '⚡',
      indicatorBg: 'bg-red-500/20 animate-pulse',
      indicatorColor: 'text-red-400',
      titleColor: 'text-red-400',
      pulse: 'animate-pulse',
    },
  };

  const config = statusConfig[status] || statusConfig.Normal;

  return (
    <div className={`${config.bg} ${config.border} p-5 rounded-lg backdrop-blur-sm border border-slate-700/30`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-200">{title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${config.indicatorBg} ${config.indicatorColor}`}>
              {config.indicator}
            </div>
            <p className={`font-bold text-sm ${config.titleColor}`}>{status}</p>
          </div>
        </div>
      </div>

      {details.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-600/30">
          <ul className="text-xs space-y-1.5">
            {details.slice(0, 3).map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-cyan-400 mt-0.5">→</span>
                <span className="line-clamp-2">{detail}</span>
              </li>
            ))}
            {details.length > 3 && (
              <li className="text-xs font-semibold text-cyan-400 pt-1">
                +{details.length - 3} more issues
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusCard;
