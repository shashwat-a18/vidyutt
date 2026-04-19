import { useState } from 'react';

const SLD = () => {
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setScale(1);

  return (
    <div className="p-8 h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border border-cyan-500/30 text-white p-6 rounded-xl shadow-2xl mb-4">
        <h1 className="text-3xl font-bold mb-2 text-cyan-300">⚡ Single Line Diagram (SLD)</h1>
        <p className="text-slate-300 text-sm">UPPTCL 220/132 kV Sub-Station, Banda — Reference Only</p>
      </div>

      {/* Toolbar */}
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-4 rounded-lg backdrop-blur-sm mb-4 flex gap-2 items-center">
        <button
          onClick={zoomIn}
          className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-4 py-2 rounded-lg font-semibold transition shadow-lg shadow-cyan-500/30"
        >
          🔍 Zoom In
        </button>
        <button
          onClick={zoomOut}
          className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-4 py-2 rounded-lg font-semibold transition shadow-lg shadow-cyan-500/30"
        >
          🔍 Zoom Out
        </button>
        <button
          onClick={resetZoom}
          className="bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          ↻ Reset
        </button>
        <span className="ml-auto px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-cyan-300 font-semibold">Scale: {(scale * 100).toFixed(0)}%</span>
      </div>

      {/* Image Container */}
      <div className="flex-1 bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-600/50 rounded-lg shadow-2xl overflow-auto flex items-center justify-center backdrop-blur-sm p-4">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            transition: 'transform 0.2s ease',
          }}
        >
          <img
            src="/sld.png"
            alt="Single Line Diagram - UPPTCL 220/132 kV Sub-Station"
            className="max-w-full h-auto rounded-lg shadow-2xl border border-slate-600"
          />
        </div>
      </div>
    </div>
  );
};

export default SLD;
