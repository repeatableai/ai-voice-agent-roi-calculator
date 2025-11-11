# AIVA - AI Voice Partner ROI Calculator

A sophisticated React application that calculates and visualizes the ROI of implementing AI Voice Partners across different job roles and industries.

## Features

- **Interactive Input Form**: Collects job role, industry, company size, and compensation data
- **Dynamic ROI Calculations**: Real-time calculation of productivity multipliers, time savings, and financial impact
- **Role-Specific Analysis**: Detailed breakdowns for specific roles (e.g., Operations Manager - Manufacturing)
- **Top 5 Deliverables Visualization**: Story-based cards showing:
  - The Situation
  - The Old Way vs. AI Voice Way
  - Immediate Wins (time freed, payroll freed, multiplier)
  - Optional "Did You Know" insights
  - Additional downstream impact questions
  - Value-added reallocation suggestions
- **Freed Time Portfolio**: Strategic recommendations for reallocating saved time
- **Professional UI**: Blue-to-purple gradient design with responsive layout
- **Mobile-First Design**: Fully responsive across all device sizes

## Technology Stack

- **React 19.1**: Modern React with hooks
- **Vite 5.4**: Fast development server and build tool
- **Tailwind CSS 4.1**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **JavaScript**: ES6+ with modern features

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the local URL (typically `http://localhost:5173` or `http://localhost:5174`)

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
AIVA/
├── src/
│   ├── VoiceROICalculator.jsx   # Main calculator component
│   ├── App.jsx                   # Root application component
│   ├── index.css                 # Global styles with Tailwind
│   └── main.jsx                  # Application entry point
├── public/                       # Static assets
├── index.html                    # HTML template
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── vite.config.js                # Vite configuration
└── package.json                  # Project dependencies
```

## Key Components

### VoiceROICalculator

The main component that handles:
- Form input and validation
- ROI calculations based on role and industry
- Results visualization with deliverable cards
- Additional impact tracking
- Value-added suggestions

### Calculation Methodology

- **Hourly Rate**: Annual salary / 2080 hours or direct hourly input
- **Time Multipliers**: Realistic 6-15x productivity improvements
- **Implementation Costs**: Scaled by company size ($25K-$300K)
- **ROI**: (Payroll Freed - Implementation Cost) / Implementation Cost × 100

## Customization

### Adding New Roles

Edit the `JOB_ROLES` array in [VoiceROICalculator.jsx](src/VoiceROICalculator.jsx)

### Adding New Industries

Edit the `INDUSTRIES` array in [VoiceROICalculator.jsx](src/VoiceROICalculator.jsx)

### Customizing Deliverables

Modify the `generateDeliverables()` function to add role-specific deliverable data with your own scenarios, time savings, and value-added suggestions.

## Critical Vocabulary

The application uses specific terminology to emphasize value:
- "Payroll freed to reallocate" (not "savings")
- "Additional impact" (not "unmeasurable")
- Focus on reallocation to value-added work

## License

Private project

## Development

This project uses:
- ESLint for code linting
- Hot Module Replacement (HMR) for fast development
- Modern ES6+ JavaScript features
