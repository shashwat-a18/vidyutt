import { useEffect, useState } from 'react';
import axios from 'axios';
import { generateShiftPDF } from '../utils/pdfGenerator.js';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [page, setPage] = useState(1);
  const [downloadingPDF, setDownloadingPDF] = useState(null);
  const limit = 10;

  useEffect(() => {
    fetchReports();
  }, [page, filterShift]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
      });

      if (filterShift) {
        params.append('shiftType', filterShift);
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/shiftlogs?${params}`);
      setReports(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) =>
    report.operator?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadPDF = async (reportData) => {
    setDownloadingPDF(reportData._id);
    try {
      generateShiftPDF(reportData);
      console.log('PDF generation completed');
    } catch (error) {
      console.error('PDF download error:', error);
    } finally {
      setDownloadingPDF(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border border-cyan-500/30 text-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-2 text-cyan-300">📄 Shift Reports</h1>
        <p className="text-slate-300 text-sm">View and analyze historical shift logs with filtering and export options</p>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-6 rounded-lg backdrop-blur-sm flex gap-4">
        <input
          type="text"
          placeholder="Search by operator name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-600 rounded-lg bg-slate-900 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
        />
        <select
          value={filterShift}
          onChange={(e) => {
            setFilterShift(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-slate-600 rounded-lg bg-slate-900 text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
        >
          <option value="">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Night">Night</option>
        </select>
      </div>

      {/* Reports Table */}
      {loading ? (
        <div className="text-center py-12 bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-12 rounded-lg backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-cyan-500 mx-auto mb-4"></div>
          <p className="text-cyan-300 font-semibold">Loading reports...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-8 rounded-lg backdrop-blur-sm text-center">
          <p className="text-slate-400">No reports found.</p>
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
                <th className="p-3 text-center text-cyan-300 font-bold">Bus Voltage (220 kV)</th>
                <th className="p-3 text-center text-cyan-300 font-bold">Avg Loading</th>
                <th className="p-3 text-center text-cyan-300 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => {
                const avgMW =
                  report.feeders && report.feeders.length > 0
                    ? (report.feeders.reduce((sum, f) => sum + (f.MW || 0), 0) / report.feeders.length).toFixed(2)
                    : 'N/A';

                return (
                  <tr key={report._id} className="border-b border-slate-600/30 hover:bg-slate-700/30 transition">
                    <td className="p-3 text-slate-200">{new Date(report.date).toLocaleDateString()}</td>
                    <td className="p-3 font-semibold text-cyan-400">{report.shiftType}</td>
                    <td className="p-3 text-slate-300">{report.operator}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${
                          !report.anomalies || report.anomalies.length === 0
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {report.anomalies?.length || 0}
                      </span>
                    </td>
                    <td className="p-3 text-center text-cyan-300 font-semibold">
                      {report.busReadings?.bus220kV?.toFixed(2) || 'N/A'} kV
                    </td>
                    <td className="p-3 text-center text-cyan-300 font-semibold">{avgMW} MW</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => downloadPDF(report)}
                        disabled={downloadingPDF === report._id}
                        className={`text-white px-4 py-1 rounded font-semibold text-sm transition ${
                          downloadingPDF === report._id
                            ? 'bg-slate-600 cursor-not-allowed opacity-60'
                            : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400'
                        }`}
                      >
                        {downloadingPDF === report._id ? '⏳ Generating...' : '📥 PDF'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold disabled:opacity-40 transition"
        >
          ← Previous
        </button>
        <span className="px-4 py-2 text-cyan-300 font-semibold">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Reports;
