import { useState, useEffect } from 'react';
import axios from 'axios';
import BusReadingsSection from '../components/ShiftLogForm/BusReadingsSection.jsx';
import TransformerSection from '../components/ShiftLogForm/TransformerSection.jsx';
import BreakerSection from '../components/ShiftLogForm/BreakerSection.jsx';
import FeederSection from '../components/ShiftLogForm/FeederSection.jsx';
import BatterySection from '../components/ShiftLogForm/BatterySection.jsx';
import { generateShiftPDF } from '../utils/pdfGenerator.js';

const ShiftLog = () => {
  const [mode, setMode] = useState('entry'); // 'entry' or 'history'
  const [formData, setFormData] = useState({
    operator: '',
    shiftType: 'Morning',
    date: new Date().toISOString().split('T')[0],
    busReadings: { bus220kV: null, bus132kV: null, frequency: null },
    transformers: [],
    breakers: [],
    feeders: [],
    battery: { floatVoltage: null, floatCurrent: null, remarks: '' },
    generalRemarks: '',
  });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    busReadings: true,
    transformers: true,
    breakers: true,
    feeders: true,
    battery: true,
  });

  useEffect(() => {
    if (mode === 'history') {
      fetchShiftHistory();
    }
  }, [mode]);

  const fetchShiftHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/shiftlogs?limit=20`);
      setHistory(response.data.data || []);
    } catch (error) {
      console.error('Error fetching shift history:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/shiftlogs`, formData);
      alert('Shift log created successfully!');
      setFormData({
        operator: '',
        shiftType: 'Morning',
        date: new Date().toISOString().split('T')[0],
        busReadings: { bus220kV: null, bus132kV: null, frequency: null },
        transformers: [],
        breakers: [],
        feeders: [],
        battery: { floatVoltage: null, floatCurrent: null, remarks: '' },
        generalRemarks: '',
      });
      setMode('history');
    } catch (error) {
      alert('Error creating shift log: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const downloadPDF = async (shiftData) => {
    setDownloadingPDF(shiftData._id);
    try {
      generateShiftPDF(shiftData);
      console.log('PDF generation completed');
    } catch (error) {
      console.error('PDF download error:', error);
    } finally {
      setDownloadingPDF(null);
    }
  };

  if (mode === 'entry') {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border border-cyan-500/30 text-white p-8 rounded-xl shadow-2xl">
          <h1 className="text-4xl font-bold mb-2 text-cyan-300">📝 Shift Log Entry</h1>
          <p className="text-slate-300 text-sm">Record equipment status and operational parameters</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Operator and Shift Info */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-6 rounded-lg backdrop-blur-sm border-l-4 border-cyan-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">Operator Name *</label>
                <input
                  type="text"
                  required
                  value={formData.operator}
                  onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-900 text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                  placeholder="Enter operator name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">Shift Type *</label>
                <select
                  required
                  value={formData.shiftType}
                  onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-900 text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                >
                  <option value="Morning">Morning (06:00–14:00)</option>
                  <option value="Afternoon">Afternoon (14:00–22:00)</option>
                  <option value="Night">Night (22:00–06:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-900 text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                />
              </div>
            </div>
          </div>

          {/* Collapsible Sections */}
          {/* Section 1: Bus Readings */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-lg backdrop-blur-sm overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 cursor-pointer hover:from-blue-500 hover:to-blue-400 transition flex justify-between items-center"
              onClick={() => toggleSection('busReadings')}
            >
              <h2 className="text-lg font-bold">⚡ Section 1: Bus Readings</h2>
              <span className="text-xl">{expandedSections.busReadings ? '▼' : '▶'}</span>
            </div>
            {expandedSections.busReadings && (
              <div className="p-6">
                <BusReadingsSection
                  data={formData.busReadings}
                  onChange={(data) => setFormData({ ...formData, busReadings: data })}
                />
              </div>
            )}
          </div>

          {/* Section 2: Transformers */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-lg backdrop-blur-sm overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 cursor-pointer hover:from-emerald-500 hover:to-emerald-400 transition flex justify-between items-center"
              onClick={() => toggleSection('transformers')}
            >
              <h2 className="text-lg font-bold">🔥 Section 2: Transformers</h2>
              <span className="text-xl">{expandedSections.transformers ? '▼' : '▶'}</span>
            </div>
            {expandedSections.transformers && (
              <div className="p-6">
                <TransformerSection
                  data={formData.transformers}
                  onChange={(data) => setFormData({ ...formData, transformers: data })}
                />
              </div>
            )}
          </div>

          {/* Section 3: Breakers */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-lg backdrop-blur-sm overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-600 to-amber-500 text-white p-4 cursor-pointer hover:from-amber-500 hover:to-amber-400 transition flex justify-between items-center"
              onClick={() => toggleSection('breakers')}
            >
              <h2 className="text-lg font-bold">⚙ Section 3: SF6 Breakers</h2>
              <span className="text-xl">{expandedSections.breakers ? '▼' : '▶'}</span>
            </div>
            {expandedSections.breakers && (
              <div className="p-6">
                <BreakerSection
                  data={formData.breakers}
                  onChange={(data) => setFormData({ ...formData, breakers: data })}
                />
              </div>
            )}
          </div>

          {/* Section 4: Feeders */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-lg backdrop-blur-sm overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-600 to-violet-500 text-white p-4 cursor-pointer hover:from-violet-500 hover:to-violet-400 transition flex justify-between items-center"
              onClick={() => toggleSection('feeders')}
            >
              <h2 className="text-lg font-bold">📡 Section 4: Feeder Loading</h2>
              <span className="text-xl">{expandedSections.feeders ? '▼' : '▶'}</span>
            </div>
            {expandedSections.feeders && (
              <div className="p-6">
                <FeederSection
                  data={formData.feeders}
                  onChange={(data) => setFormData({ ...formData, feeders: data })}
                />
              </div>
            )}
          </div>

          {/* Section 5: Battery */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-lg backdrop-blur-sm overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-600 to-red-500 text-white p-4 cursor-pointer hover:from-red-500 hover:to-red-400 transition flex justify-between items-center"
              onClick={() => toggleSection('battery')}
            >
              <h2 className="text-lg font-bold">🔋 Section 5: Battery Bank</h2>
              <span className="text-xl">{expandedSections.battery ? '▼' : '▶'}</span>
            </div>
            {expandedSections.battery && (
              <div className="p-6">
                <BatterySection
                  data={formData.battery}
                  onChange={(data) => setFormData({ ...formData, battery: data })}
                />
              </div>
            )}
          </div>

          {/* General Remarks */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-6 rounded-lg backdrop-blur-sm">
            <label className="block text-xs font-bold text-cyan-300 mb-3 uppercase tracking-wider">General Remarks</label>
            <textarea
              value={formData.generalRemarks}
              onChange={(e) => setFormData({ ...formData, generalRemarks: e.target.value })}
              className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-900 text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
              placeholder="Any additional notes for this shift"
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-emerald-500/30 disabled:opacity-50 transition"
            >
              {submitting ? '⏳ Submitting...' : '✓ Submit Shift Log'}
            </button>
            <button
              type="button"
              onClick={() => setMode('history')}
              className="flex-1 bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition"
            >
              View History
            </button>
          </div>
        </form>
      </div>
    );
  }

  // History Mode
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-cyan-300">📋 Shift Log History</h1>
          <p className="text-slate-300 text-sm mt-1">View and manage previous shift entries</p>
        </div>
        <button
          onClick={() => setMode('entry')}
          className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-cyan-500/30 transition"
        >
          + New Entry
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-12 rounded-lg backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-cyan-500 mx-auto mb-4"></div>
          <p className="text-cyan-300 font-semibold">Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-8 rounded-lg backdrop-blur-sm text-center">
          <p className="text-slate-400">No shift logs found.</p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-lg backdrop-blur-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/80 border-b border-slate-600/50">
              <tr>
                <th className="p-3 text-left text-cyan-300 font-bold">Date</th>
                <th className="p-3 text-left text-cyan-300 font-bold">Shift</th>
                <th className="p-3 text-left text-cyan-300 font-bold">Operator</th>
                <th className="p-3 text-center text-cyan-300 font-bold">Anomalies</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((shift) => (
                <tr key={shift._id} className="border-b border-slate-600/30 hover:bg-slate-700/30 transition">
                  <td className="p-3 text-slate-200">{new Date(shift.date).toLocaleDateString()}</td>
                  <td className="p-3 font-semibold text-cyan-400">{shift.shiftType}</td>
                  <td className="p-3 text-slate-300">{shift.operator}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${
                        !shift.anomalies || shift.anomalies.length === 0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {shift.anomalies?.length || 0}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => downloadPDF(shift)}
                      disabled={downloadingPDF === shift._id}
                      className={`inline-block text-white px-3 py-1 rounded font-semibold text-sm transition ${
                        downloadingPDF === shift._id
                          ? 'bg-slate-600 cursor-not-allowed opacity-60'
                          : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400'
                      }`}
                    >
                      {downloadingPDF === shift._id ? '⏳ Generating...' : '📥 PDF'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShiftLog;
