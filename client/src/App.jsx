import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar.jsx';
import Sidebar from './components/shared/Sidebar.jsx';

// Pages
import Dashboard from './pages/Dashboard.jsx';
import ShiftLog from './pages/ShiftLog.jsx';
import Analytics from './pages/Analytics.jsx';
import Reports from './pages/Reports.jsx';
import Chatbot from './pages/Chatbot.jsx';
import SLD from './pages/SLD.jsx';

import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background transmission tower effect */}
        <div className="absolute inset-0 opacity-20 blur-md" style={{
          backgroundImage: 'url(/transmission-tower.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: 0,
        }}></div>

        {/* Content wrapper with relative positioning to appear above background */}
        <div className="relative z-10 flex flex-col h-screen">
          {/* Top Navbar */}
          <Navbar />

          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Page Content */}
            <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/shift-log" element={<ShiftLog />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/sld" element={<SLD />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
