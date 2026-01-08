# AIVA ROI Calculator - Startup Guide

## Port Configuration

- **Backend Server**: Port `3003` (http://localhost:3003)
- **Frontend Dev Server**: Port `5175` (http://localhost:5175)

These ports are configured to avoid conflicts with other applications.

## Quick Start

### 1. Start Backend Server

```bash
cd backend
npm install  # If not already done
npm start
```

The backend will start on **http://localhost:3003**

### 2. Start Frontend Dev Server

In a new terminal:

```bash
cd AIVA
npm install  # If not already done
npm run dev
```

The frontend will start on **http://localhost:5175**

### 3. Access the Application

Open your browser to: **http://localhost:5175**

You'll see the login page.

## Test Accounts

Three test accounts have been created in the database:

### 1. User (Employee)
- **Email**: `user@example.com`
- **Password**: `password123`
- **Access**: Own analyses only

### 2. Admin (Company Head)
- **Email**: `admin@example.com`
- **Password**: `Admin123!`
- **Access**: All company analyses + employee management

### 3. Super Admin (Platform Owner)
- **Email**: `superadmin@aiva.com`
- **Password**: `SuperAdmin123!`
- **Access**: All companies, all analyses, system-wide access

## Database Status

✅ Database: `aivoice` (PostgreSQL)
✅ Migrations: Completed
✅ Test Users: Created
✅ Schema: Up to date

## Environment Variables

### Backend (.env)
- `PORT=3003`
- `DATABASE_URL=postgresql://localhost:5432/aivoice`
- `ANTHROPIC_API_KEY` (already configured)
- `SESSION_SECRET` (already configured)
- `JWT_SECRET` (already configured)

### Frontend (.env.local)
- `VITE_API_URL=http://localhost:3003`

## Troubleshooting

### Port Already in Use
If you get a port conflict:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change `port` in `AIVA/vite.config.js`

### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready

# Test connection
psql postgresql://localhost:5432/aivoice
```

### Login Not Working
1. Make sure backend is running on port 3003
2. Check browser console for errors
3. Verify `VITE_API_URL` in `AIVA/.env.local` points to backend

## Features Available

- ✅ Login/Registration
- ✅ Role-based access control (User, Admin, Super Admin)
- ✅ ROI Analysis Calculator
- ✅ Save Analyses (persistent storage)
- ✅ Analysis History (role-based filtering)
- ✅ Company Dashboard (admin only)
- ✅ Employee Management (admin only)

## Next Steps

1. Log in with one of the test accounts
2. Create an ROI analysis
3. Save the analysis
4. View analysis history
5. (Admin) Access company dashboard
6. (Admin) Invite employees

---

**Ready to go!** Start both servers and visit http://localhost:5175

