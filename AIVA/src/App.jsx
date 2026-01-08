import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Breadcrumbs from './components/Breadcrumbs';
import ProtectedRoute from './components/ProtectedRoute';
import VoiceROICalculator from './VoiceROICalculator';
import AnalysisHistory from './components/AnalysisHistory';
import AnalysisDetail from './components/AnalysisDetail';
import CompanyDashboard from './components/CompanyDashboard';
import CompanyDetails from './components/CompanyDetails';
import CompaniesList from './components/CompaniesList';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AllUsers from './components/AllUsers';
import SystemSettings from './components/SystemSettings';
import Unauthorized from './components/Unauthorized';

// Layout component for authenticated routes
function AuthenticatedLayout({ children }) {
  return (
    <div>
      <Navigation />
      <Breadcrumbs />
      {children}
    </div>
  );
}

// Login route wrapper
function LoginRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginRoute />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <VoiceROICalculator />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analyses"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <AnalysisHistory />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analyses/:id"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <AnalysisDetail />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analyses/all"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <AuthenticatedLayout>
                  <AnalysisHistory showAllAnalyses={true} />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/company"
            element={
              <ProtectedRoute requireAnyRole={['admin', 'super_admin']}>
                <AuthenticatedLayout>
                  <CompanyDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/employees"
            element={
              <ProtectedRoute requireAnyRole={['admin', 'super_admin']}>
                <AuthenticatedLayout>
                  <CompanyDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/analytics"
            element={
              <ProtectedRoute requireAnyRole={['admin', 'super_admin']}>
                <AuthenticatedLayout>
                  <CompanyDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          {/* Super Admin Routes */}
          <Route
            path="/companies"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <AuthenticatedLayout>
                  <CompaniesList />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/companies/:id"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <AuthenticatedLayout>
                  <CompanyDetails />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <AuthenticatedLayout>
                  <SuperAdminDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <AuthenticatedLayout>
                  <SystemSettings />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <AuthenticatedLayout>
                  <AllUsers />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          {/* Unauthorized Route */}
          <Route
            path="/unauthorized"
            element={
              <AuthenticatedLayout>
                <Unauthorized />
              </AuthenticatedLayout>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
