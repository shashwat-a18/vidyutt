# Substation Operations Dashboard - Backend

Node.js/Express backend for the UPPTCL Substation Operations Dashboard.

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file (copy from `.env.example`):

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/substation-dashboard?retryWrites=true&w=majority
PORT=4000
NODE_ENV=development
```

## Database Seeding

Run seed scripts to populate equipment and fault decision tree:

```bash
npm run seed
```

This will:
1. Clear existing data
2. Insert 12 equipment records
3. Insert 8 decision tree questions
4. Insert 15 fault checklists with investigation steps

## Development

```bash
npm run dev
```

Runs on http://localhost:4000

## Production

```bash
npm start
```

## API Routes

### Shift Logs
- `POST /api/shiftlogs` - Create new shift log
- `GET /api/shiftlogs` - Get all shift logs (paginated)
- `GET /api/shiftlogs/latest` - Get most recent shift
- `GET /api/shiftlogs/:id` - Get single shift

### Analytics
- `GET /api/analytics?equipment=...&parameter=...&days=7|30` - Get trend data

### Chatbot / Fault Diagnosis
- `GET /api/chatbot/start` - Get first question
- `POST /api/chatbot/session` - Create new session
- `POST /api/chatbot/next` - Get next question based on answer
- `POST /api/chatbot/progress` - Update checklist progress
- `GET /api/chatbot/session/:sessionId` - Get session details

### Reports
- `GET /api/reports/:shiftId` - Get shift data for PDF

### Equipment
- `GET /api/equipment` - Get all equipment with thresholds

## Real Equipment & Thresholds

All thresholds are based on actual 220 kV Banda Sub-Station specifications:

- **Transformers**: OTI alarm 85°C / trip 95°C, WTI alarm 90°C / trip 100°C
- **SF6 Breakers**: Alarm <5.2 bar (temperature-corrected), Lockout <4.8 bar
- **Battery**: Float voltage 120–126 V (55-cell bank)
- **Bus Voltage**: ±5% nominal (209–231 kV @ 220 kV, 125.4–138.6 kV @ 132 kV)

## Fault Diagnosis Decision Tree

The decision tree is stored in MongoDB and covers:
- CT failures and secondary protection faults
- Buchholz relay operations
- Overcurrent and distance relay tripping
- Temperature alarms
- SF6 pressure issues
- DC battery faults
- Busbar faults

Key incident: **CT Failure on 40 MVA Transformer (Feb 2026)** is the primary diagnostic path, with 10-step investigation checklist.

## Technology Stack

- Express.js 4.x
- Mongoose 7.x (MongoDB ODM)
- MongoDB Atlas (free M0 cluster)
- CORS enabled for Vercel frontend
- dotenv for environment variables
