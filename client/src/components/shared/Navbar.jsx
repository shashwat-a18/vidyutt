const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 shadow-2xl border-b-2 border-cyan-500">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold tracking-tight">
            <span className="text-cyan-400">⚡</span> Vidyutt
          </div>
          <div className="h-12 border-l-2 border-cyan-500"></div>
          <div className="text-sm">
            <p className="font-semibold text-cyan-300 text-lg">UPPTCL 220/132 kV Sub-Station</p>
            <p className="text-xs text-slate-400">Banda • Real-Time Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="bg-slate-700/50 px-3 py-2 rounded-lg border border-cyan-500/30">
            <p className="text-slate-300">System Status</p>
            <p className="text-green-400 font-bold">🟢 Online</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
