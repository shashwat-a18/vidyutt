# Vidyutt - Frontend

This is the React frontend for Vidyutt, the UPPTCL Substation Operations Monitor.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs on http://localhost:3000

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:4000/api
```

For production (Vercel):

```
VITE_API_URL=https://your-render-backend.com/api
```

## Features

- **Dashboard**: Real-time station health overview
- **Shift Log**: Comprehensive equipment data entry
- **Analytics**: Trend visualization with anomaly detection
- **Reports**: PDF generation for shift records
- **Fault Diagnosis**: Decision tree-based troubleshooting
- **SLD Viewer**: Single line diagram reference

## Built With

- React 18
- React Router 6
- Tailwind CSS
- Recharts (visualization)
- jsPDF (PDF generation)
- Axios (HTTP client)
