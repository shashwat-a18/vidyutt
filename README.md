# Vidyutt - Substation Operations Monitor

Complete full-stack web application for digitizing shift operations at UPPTCL 220 kV Sub-Station, Banda, Uttar Pradesh.

## Overview

This application replaces the paper-based shift logbook with:
- ✅ Digital equipment readings entry
- ✅ Automatic anomaly detection against real thresholds
- ✅ PDF shift report generation
- ✅ Equipment parameter trend visualization
- ✅ AI-free guided fault diagnosis (decision tree)

**For**: Shashwat Awasthi (Roll No. 2202139), B.Tech Electrical Engineering, NIT Patna  
**Based on**: Real internship at UPPTCL Banda Sub-Station (Jan 2026)

## Quick Start

### Prerequisites

- Node.js 16+
- MongoDB Atlas account (free M0 cluster)
- Git

### Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run seed
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Project Structure

```
vidyutt/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # 6 main pages
│   │   ├── components/    # React components
│   │   └── utils/         # Helper functions
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                 # Node.js/Express backend
    ├── models/            # MongoDB schemas (5 collections)
    ├── controllers/       # Business logic
    ├── routes/            # API endpoints
    ├── utils/             # Anomaly detection, SF6 correction
    ├── seed/              # Database initialization
    ├── server.js
    └── package.json
```

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 18, React Router, Tailwind CSS, Recharts, jsPDF |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas (free M0) |
| Deployment | Vercel (frontend), Render (backend) |

## Features

### 1. Dashboard
Real-time health overview with:
- Bus voltage & frequency readings
- Equipment status cards (color-coded)
- Anomalies from latest shift
- Quick navigation CTA

### 2. Shift Log Entry
Comprehensive form with 5 collapsible sections:
1. Bus Readings (220 kV, 132 kV, frequency)
2. Transformers (OTI, WTI, OLTC, cooling)
3. SF6 Breakers (pressure + temp correction)
4. 132 kV Feeders (MW, MVAR loading)
5. DC Battery (float voltage, current)

Auto-generated anomalies on submit.

### 3. Analytics
Trend visualization with:
- Equipment/parameter selector
- 7-day or 30-day time range
- Alarm threshold reference line
- Anomaly badges on data points

### 4. Reports
Searchable table of all shifts with:
- Filter by operator/shift type
- Pagination
- One-click PDF download

PDF includes:
- UPPTCL header & shift details
- 4 data tables (formatted with jspdf-autotable)
- Red-highlighted anomalous values
- Footer with report ID & timestamp

### 5. Fault Diagnosis Chatbot
Interactive decision tree for protection troubleshooting:
- Q&A conversation interface
- 8 protection elements covered
- Resolution to specific fault + immediate actions
- 14-step investigation checklist (checkbox ticking)
- Based on real Feb 2026 CT failure incident

### 6. SLD Viewer
Single Line Diagram reference with:
- Zoom in/out & reset
- Equipment layout reference

## Real Equipment & Thresholds

### Transformers
- **Names**: 200 MVA T/F-1 (BHEL), 200 MVA T/F-2 (BHEL), 40 MVA T/F
- **OTI**: Alarm 85°C, Trip 95°C
- **WTI**: Alarm 90°C, Trip 100°C

### SF6 Breakers
- **Normal**: Corrected pressure >5.2 bar
- **Alarm**: 4.8–5.2 bar
- **Lockout**: <4.8 bar
- **Formula**: P_corrected = P_measured × (273+20)/(273+T_ambient)

### 132 kV Feeders
1. Banda Town
2. Atarra
3. Baberu
4. Pailani
5. Augasi
6. Karvi/Rajapur

### Battery
- **Type**: Exide OPzS 300P (55 cells × 2V nominal)
- **Float Voltage**: 120–126 V
- **Boost Voltage**: ~132 V

### Bus Voltage Tolerance
- **220 kV**: ±5% = 209–231 kV
- **132 kV**: ±5% = 125.4–138.6 kV
- **Frequency**: 49.5–50.5 Hz

## Anomaly Detection

Server-side detection runs before saving any shift log:

1. **Transformer OTI/WTI**: Thresholds for alarm/trip conditions
2. **SF6 Pressure**: Temperature-corrected before checking
3. **Battery Voltage**: Low (<120V) and high (>126V) flags
4. **Bus Voltages**: ±5% tolerance on nominal
5. **Grid Frequency**: ±0.5 Hz deviation

All anomalies stored in shift document and displayed in UI.

### Fault Decision Tree

### 15 Comprehensive Nodes
| Level | Questions | Coverage |
|-------|-----------|----------|
| Q1 | 5 protection elements | Buchholz, Differential, SF6, Overvoltage, Battery |
| Q2 | 5 follow-up questions | Fault classification & severity assessment |
| Q3 | 5 diagnostic questions | Root cause identification |
| **Resolution** | **4 fault types** | Transformer, Breaker, Bus, Battery |

### Resolved Faults
- **TF_OVERHEAT_001** – Transformer overheating (🔴 Critical)
- **BREAKER_SF6_LOW_001** – SF6 pressure low (🟠 High)
- **BUS_VOLTAGE_OOR_001** – Bus voltage out of range (🟠 High)
- **BATTERY_VOLTAGE_ABNORMAL_001** – Battery float voltage abnormal (🟡 Medium)

Each resolution includes 6-step investigation checklist + 4 immediate actions.

## Deployment

### Frontend (Vercel)
1. Push `client/` to GitHub
2. Connect repo in Vercel
3. Set environment variable `VITE_API_URL=<render-backend-url>`

### Backend (Render)
1. Push `server/` to GitHub  
2. Create new "Web Service" on Render
3. Set environment variables `MONGO_URI` and `PORT=5000`
4. Start command: `npm start`

### Database (MongoDB Atlas)
1. Create free M0 cluster
2. Set connection string in `.env`
3. Whitelist all IPs (0.0.0.0/0) for Render
4. Run seed scripts locally before deployment

## File Descriptions

### Backend Key Files

**Models/**
- `ShiftLog.js` – Shift entries with readings + anomalies
- `Equipment.js` – Equipment catalog with thresholds
- `FaultChecklist.js` – Fault descriptions + investigation steps
- `FaultDecisionTree.js` – Question/answer tree structure

**Controllers/**
- `shiftLogController.js` – CRUD + anomaly detection
- `analyticsController.js` – Aggregation queries
- `chatbotController.js` – Decision tree navigation

**Utils/**
- `anomalyDetector.js` – Threshold logic (server-side)
- `sf6TempCorrection.js` – Temperature correction formula

**Seed/**
- `seedEquipment.js` – 12 equipment records
- `seedFaultChecklists.js` – Full decision tree + 15 fault definitions

### Frontend Key Files

**Pages/**
- `Dashboard.jsx` – Station health overview
- `ShiftLog.jsx` – Entry form + history table
- `Analytics.jsx` – Trend charting
- `Reports.jsx` – PDF download list
- `Chatbot.jsx` – Fault diagnosis interface
- `SLD.jsx` – Diagram viewer

**Components/**
- `ShiftLogForm/*` – 5 collapsible form sections
- `Chatbot/*` – Chat UI, questions, checklists
- `Analytics/*` – Trend chart, anomaly badges
- `shared/*` – Navbar, sidebar, status cards

**Utils/**
- `pdfGenerator.js` – jsPDF formatting
- `anomalyDetector.js` – Client-side preview
- `sf6TempCorrection.js` – Temperature correction

## Security Notes

- All anomaly detection is rule-based (no external AI API)
- MongoDB user should have minimal permissions
- Vercel env vars should NOT contain sensitive keys
- Render backend is behind CORS restrictions

## Monitoring & Logs

Backend logs:
- MongoDB connection status
- Server port
- API errors

Frontend logs:
- API call failures
- Component render errors (React strict mode)

No external logging service is configured; use platform-native logs.

## Future Enhancements

- [ ] Real-time SCADA integration
- [ ] Email alerts for critical anomalies
- [ ] Historical anomaly trends
- [ ] Equipment maintenance scheduling
- [ ] Multi-user authentication
- [ ] Mobile app version

## Contact & Support

**Developed for**: UPPTCL Banda 220 kV Sub-Station  
**Developer**: Shashwat Awasthi (2202139)  
**Institution**: NIT Patna  
**Period**: Jan–March 2026 (Research Project II)

---

**Status**: ✅ Production Ready | **Last Updated**: April 2026
