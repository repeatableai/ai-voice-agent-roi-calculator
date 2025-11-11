# FieldSell Pro

**AI-Powered White-Label Field Sales Platform with Dynamic Branding**

FieldSell Pro is a multi-tenant field sales platform for home service companies (HVAC, plumbing, electrical, etc.). It empowers field technicians to close more upsells using AI-generated service recommendations and SPIN selling methodology.

## 🚀 Key Features

- **White-Label Branding**: AI extracts logos and colors from company websites, applies dynamic theming
- **AI Service Generation**: Claude 3.5 Sonnet creates 10 industry-specific upsell services with SPIN scripts
- **Complete Analytics**: Real-time dashboards sync across admin and technician portals
- **Role-Based Portals**: Admin dashboard for management, technician app for field work
- **Data Export/Import**: Backup and restore all demo data

## 🛠️ Installation

```bash
git clone <repository-url>
cd field-sell-pro-78dfa513
npm install
```

## 🔐 Environment Setup

Create `.env` file:
```env
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

Get your API key from [Anthropic Console](https://console.anthropic.com/)

## 🏃 Running the App

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run kill-servers # Kill zombie dev servers
npm run build       # Build for production
npm run preview     # Preview production build
```

## 🎮 Demo Mode Quick Start

1. Visit `http://localhost:5173/`
2. Click "Start Company Onboarding"
3. Enter company details (try **tesla.com** for impressive branding!)
4. AI generates 10 custom services
5. Access **Admin Dashboard** to manage
6. Click "View as Technician" to test field tech experience

### LocalStorage Keys
- `fieldsell_demo_company` - Company, services, technicians
- `fieldsell_demo_technician` - Current logged-in tech
- `fieldsell_demo_interactions` - Service presentations
- `fieldsell_demo_orders` - Submitted orders

## 📊 Data Flow

### Onboarding
```
Company Details → AI Extracts Branding → Claude Generates Services
→ Save to localStorage → Create Default Tech (John Doe, TCH-001)
→ Redirect to Admin Dashboard
```

### Technician Workflow
```
Login → Select Service → Review SPIN Script → Present to Customer (Branded View)
→ Customer Approves/Declines → Save Interaction → If Approved: Submit Order
→ Admin Dashboard Updates Real-time
```

## 🏗️ Architecture

**Tech Stack**: React 18, Vite, Tailwind CSS, shadcn/ui, Anthropic Claude, Recharts

**Key Components**:
- `BrandingProvider.jsx` - Dynamic theming with CSS variables
- `CompanyAdminPortal.jsx` - Admin dashboard (KPIs, management, analytics)
- `TechnicianApp.jsx` - Field tech app (services, scripts, orders)
- `aiServiceGenerator.js` - Claude AI service generation
- `brandingExtractor.js` - Logo/color extraction (Clearbit → HTML scraping → Google Favicon)

## 🔌 API Integration

### Anthropic Claude
- **Service Generation**: Creates 10 upsell services with SPIN scripts
- **Brand Colors**: AI researches and returns company's primary HEX color

### External APIs
- **Clearbit Logo API**: `https://logo.clearbit.com/{domain}`
- **Google Favicon API**: `https://www.google.com/s2/favicons?domain={domain}&sz=256`

## 🚢 Deployment

```bash
npm run build  # Output: dist/
```

**Recommended Hosting**: Vercel, Netlify, AWS S3 + CloudFront

**Deploy to Vercel**:
```bash
npm install -g vercel
vercel
# Add VITE_ANTHROPIC_API_KEY in dashboard
```

## 📝 Features Implemented

✅ AI-powered service generation with SPIN methodology
✅ Dynamic brand theming (gradients, colors, logos)
✅ Complete analytics synchronization
✅ Admin dashboard with KPIs and recent activity
✅ Technician app with performance metrics
✅ Data export/import for backup/restore
✅ "Back to Services" button in customer view
✅ Multi-tenant architecture with isolated data

## 🧪 Testing Checklist

- [ ] Onboard with real company website
- [ ] Verify branding (logo + colors)
- [ ] Generate 10 AI services
- [ ] Add/edit technician
- [ ] Switch to technician view
- [ ] Present service, submit order
- [ ] Check analytics update
- [ ] Export and import data

## 📧 Support

For questions, create an issue in the GitHub repository.

**Built with ❤️ for field service companies**