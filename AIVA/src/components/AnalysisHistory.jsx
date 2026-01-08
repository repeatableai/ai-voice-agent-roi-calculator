import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, DollarSign, TrendingUp, Trash2, Eye, Filter, Plus, User, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AnalysisHistory({ showAllAnalyses = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'my', 'company', 'all-companies' (super admin)
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userRole !== null) {
      fetchAnalyses();
    }
  }, [filter, showAllAnalyses, userRole, userId]);

  const fetchUserInfo = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        const role = data.user?.role || user?.role || 'user';
        const id = data.user?.id || user?.id || null;
        setUserRole(role);
        setUserId(id);
      } else {
        // Fallback to user from context
        setUserRole(user?.role || 'user');
        setUserId(user?.id || null);
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      // Fallback to user from context
      setUserRole(user?.role || 'user');
      setUserId(user?.id || null);
    }
  };

  const fetchAnalyses = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      // If showAllAnalyses is true, use admin endpoint
      if (showAllAnalyses) {
        const params = new URLSearchParams();
        const queryString = params.toString();
        const url = `${apiUrl}/api/admin/analyses${queryString ? `?${queryString}` : ''}`;
        const response = await fetch(url, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch all analyses');
        }

        const data = await response.json();
        setAnalyses(data.analyses || []);
      } else {
        // Regular endpoint with role-based filtering
        const params = new URLSearchParams();
        
        // For super admin viewing "My Analyses", filter by their user_id
        if (userRole === 'super_admin' && userId) {
          params.append('user_id', userId.toString());
        }
        
        if (filter === 'my') {
          // User filter is handled by backend based on role
        }
        
        const queryString = params.toString();
        const url = `${apiUrl}/api/aiva/analyses${queryString ? `?${queryString}` : ''}`;
        const response = await fetch(url, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analyses');
        }

        const data = await response.json();
        setAnalyses(data.analyses || []);
      }
    } catch (err) {
      console.error('Error fetching analyses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (id) => {
    if (!confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/aiva/analyses/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete analysis');
      }

      // Remove from list
      setAnalyses(analyses.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting analysis:', err);
      alert('Failed to delete analysis: ' + err.message);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {showAllAnalyses ? 'All Analyses' : userRole === 'super_admin' ? 'My Analyses' : userRole === 'admin' ? 'Company Analyses' : 'My Analyses'}
            </h1>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              New Analysis
            </button>
          </div>
          
          {/* Filter buttons - only show if not in "All Analyses" mode */}
          {!showAllAnalyses && (
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                {userRole === 'super_admin' ? 'My Analyses' : userRole === 'admin' ? 'Company Analyses' : 'My Analyses'}
              </button>
              {userRole === 'admin' && (
                <button
                  onClick={() => setFilter('my')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filter === 'my'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  My Analyses Only
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {analyses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-gray-600 text-lg">No analyses found.</p>
            <p className="text-gray-500 mt-2">Create your first analysis to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {analysis.title || `${analysis.job_title} - ${analysis.company_name}`}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {analysis.job_title} • {analysis.industry}
                  </p>
                  {/* Show user and company info when viewing all analyses */}
                  {showAllAnalyses && (analysis.user_name || analysis.user_email || analysis.company_name) && (
                    <div className="mt-2 space-y-1">
                      {analysis.user_name && (
                        <p className="text-xs text-gray-500 flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          Created by: {analysis.user_name} {analysis.user_email && `(${analysis.user_email})`}
                        </p>
                      )}
                      {analysis.company_name && (
                        <p className="text-xs text-gray-500 flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          Company: {analysis.company_name}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(analysis.created_at)}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-gray-700">
                      {Math.round(analysis.total_annual_hours_freed || 0)} hours/year freed
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-gray-700">
                      {formatCurrency(analysis.total_payroll_freed || 0)} payroll freed
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="text-gray-700">
                      {formatCurrency(analysis.annual_value_created || 0)} value created
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => navigate(`/analyses/${analysis.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => deleteAnalysis(analysis.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

