import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊', desc: 'Health Overview' },
    { path: '/shift-log', label: 'Shift Log', icon: '📝', desc: 'Log Entries' },
    { path: '/analytics', label: 'Analytics', icon: '📈', desc: 'Trends & Data' },
    { path: '/reports', label: 'Reports', icon: '📄', desc: 'History' },
    { path: '/chatbot', label: 'Fault Diagnosis', icon: '🔧', desc: 'AI Assistant' },
    { path: '/sld', label: 'SLD Diagram', icon: '⚡', desc: 'Equipment Map' },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white h-screen shadow-2xl border-r border-cyan-500/20 overflow-y-auto">
      <div className="p-6">
        <div className="mb-8 pb-6 border-b border-cyan-500/30">
          <h2 className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-1">Navigation</h2>
          <p className="text-xs text-slate-400">Main Controls</p>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/50 border-l-4 border-cyan-300'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-cyan-300 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-opacity-70 text-slate-400">{item.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyan-500/20 bg-slate-900/50">
        <div className="text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-cyan-400">System Info</p>
          <p>© 2026 UPPTCL</p>
          <p>v1.0 Production</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
