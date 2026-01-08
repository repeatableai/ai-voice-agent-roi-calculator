import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, FileText, TrendingUp, Plus, ArrowRight, BarChart3, Clock, DollarSign } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalUsers: 0,
    totalAnalyses: 0,
    totalHoursFreed: 0,
    totalValueCreated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const fetchPlatformStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      // Fetch all companies
      const companiesResponse = await fetch(`${apiUrl}/api/companies`, {
        credentials: 'include'
      });
      
      // Fetch all analyses
      const analysesResponse = await fetch(`${apiUrl}/api/aiva/analyses`, {
        credentials: 'include'
      });

      if (companiesResponse.ok && analysesResponse.ok) {
        const companiesData = await companiesResponse.json();
        const analysesData = await analysesResponse.json();
        
        const companies = companiesData.companies || [];
        const analyses = analysesData.analyses || [];

        // Calculate totals
        const totalHoursFreed = analyses.reduce((sum, a) => sum + (parseFloat(a.total_annual_hours_freed) || 0), 0);
        const totalValueCreated = analyses.reduce((sum, a) => sum + (parseFloat(a.annual_value_created) || 0), 0);

        // Get unique user count (would need backend endpoint for this)
        const uniqueUsers = new Set(analyses.map(a => a.user_id)).size;

        setStats({
          totalCompanies: companies.length,
          totalUsers: uniqueUsers,
          totalAnalyses: analyses.length,
          totalHoursFreed,
          totalValueCreated,
        });
      }
    } catch (err) {
      console.error('Error fetching platform stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading platform statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Platform Dashboard</h1>
          <p className="text-gray-600">System-wide overview and management</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalCompanies}</span>
            </div>
            <p className="text-gray-600">Total Companies</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalUsers}</span>
            </div>
            <p className="text-gray-600">Active Users</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalAnalyses}</span>
            </div>
            <p className="text-gray-600">Total Analyses</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
              <span className="text-3xl font-bold text-gray-900">
                {Math.round(stats.totalHoursFreed).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-600">Hours Freed/Year</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalValueCreated)}
              </span>
            </div>
            <p className="text-gray-600">Total Value Created</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/companies"
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">All Companies</h3>
            <p className="text-sm text-gray-600">View and manage all companies on the platform</p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-green-600" />
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">All Users</h3>
            <p className="text-sm text-gray-600">Manage users across all companies</p>
          </Link>

          <Link
            to="/analyses"
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">All Analyses</h3>
            <p className="text-sm text-gray-600">View all ROI analyses across the platform</p>
          </Link>

          <Link
            to="/admin/settings"
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-yellow-600" />
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">System Settings</h3>
            <p className="text-sm text-gray-600">Configure platform-wide settings</p>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

