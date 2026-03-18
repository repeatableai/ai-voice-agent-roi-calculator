import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Users, FileText, Clock, DollarSign, ArrowLeft, Edit, Save, X } from 'lucide-react';

export default function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    domain: '',
    website: '',
    industry: '',
    subscriptionTier: 'free',
    subscriptionStatus: 'active',
    maxUsers: 10
  });

  useEffect(() => {
    if (id) {
      fetchCompanyData();
    }
  }, [id]);

  const fetchCompanyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';

      // Fetch company details
      const companyResponse = await fetch(`${apiUrl}/api/companies/${id}`, {
        credentials: 'include'
      });

      if (!companyResponse.ok) {
        throw new Error('Failed to fetch company');
      }

      const companyData = await companyResponse.json();
      setCompany(companyData.company);

      // Set edit form values
      setEditForm({
        name: companyData.company.name || '',
        domain: companyData.company.domain || '',
        website: companyData.company.website || '',
        industry: companyData.company.industry || '',
        subscriptionTier: companyData.company.subscription_tier || 'free',
        subscriptionStatus: companyData.company.subscription_status || 'active',
        maxUsers: companyData.company.max_users || 10
      });

      // Fetch employees
      const employeesResponse = await fetch(`${apiUrl}/api/companies/${id}/employees`, {
        credentials: 'include'
      });

      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData.employees || []);
      }

      // Fetch analytics
      const analyticsResponse = await fetch(`${apiUrl}/api/companies/${id}/analytics`, {
        credentials: 'include'
      });

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

    } catch (err) {
      console.error('Error fetching company data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: editForm.name,
          domain: editForm.domain || null,
          website: editForm.website || null,
          industry: editForm.industry || null,
          subscriptionTier: editForm.subscriptionTier,
          subscriptionStatus: editForm.subscriptionStatus,
          maxUsers: parseInt(editForm.maxUsers) || 10
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update company');
      }

      const data = await response.json();
      setCompany(data.company);
      setIsEditing(false);
      alert('Company updated successfully!');
    } catch (err) {
      console.error('Error updating company:', err);
      alert('Failed to update company: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to current company values
    setEditForm({
      name: company.name || '',
      domain: company.domain || '',
      website: company.website || '',
      industry: company.industry || '',
      subscriptionTier: company.subscription_tier || 'free',
      subscriptionStatus: company.subscription_status || 'active',
      maxUsers: company.max_users || 10
    });
    setIsEditing(false);
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
          <p className="text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl">
          <p className="text-red-600 text-lg mb-4">{error || 'Company not found'}</p>
          <Link
            to="/companies"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to="/companies"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{company.name}</h1>
              <p className="text-gray-600">{company.industry || 'No industry specified'}</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Company
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Company Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{employees.length}</span>
            </div>
            <p className="text-gray-600">Employees</p>
          </div>

          {analytics && (
            <>
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                  <span className="text-3xl font-bold text-gray-900">{analytics.metrics?.totalAnalyses || 0}</span>
                </div>
                <p className="text-gray-600">Total Analyses</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(analytics.metrics?.totalValueCreated || 0)}
                  </span>
                </div>
                <p className="text-gray-600">Total Value Created</p>
              </div>
            </>
          )}
        </div>

        {/* Company Details - Editable */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Domain</label>
                <input
                  type="text"
                  value={editForm.domain}
                  onChange={(e) => handleEditChange('domain', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                <input
                  type="text"
                  value={editForm.website}
                  onChange={(e) => handleEditChange('website', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={editForm.industry}
                  onChange={(e) => handleEditChange('industry', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Technology, Healthcare, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subscription Tier</label>
                <select
                  value={editForm.subscriptionTier}
                  onChange={(e) => handleEditChange('subscriptionTier', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={editForm.subscriptionStatus}
                  onChange={(e) => handleEditChange('subscriptionStatus', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="suspended">Suspended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Users</label>
                <input
                  type="number"
                  value={editForm.maxUsers}
                  onChange={(e) => handleEditChange('maxUsers', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Created</label>
                <p className="text-gray-900 py-2">
                  {new Date(company.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">Company Name</label>
                <p className="text-gray-900 mt-1">{company.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Domain</label>
                <p className="text-gray-900 mt-1">{company.domain || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Website</label>
                <p className="text-gray-900 mt-1">
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {company.website}
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Industry</label>
                <p className="text-gray-900 mt-1">{company.industry || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Subscription Tier</label>
                <p className="text-gray-900 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    company.subscription_tier === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                    company.subscription_tier === 'pro' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {company.subscription_tier || 'free'}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <p className="text-gray-900 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    company.subscription_status === 'active' ? 'bg-green-100 text-green-800' :
                    company.subscription_status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    company.subscription_status === 'suspended' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {company.subscription_status || 'active'}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Max Users</label>
                <p className="text-gray-900 mt-1">{company.max_users || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Created</label>
                <p className="text-gray-900 mt-1">
                  {new Date(company.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Employees List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Employees</h2>
          {employees.length === 0 ? (
            <p className="text-gray-600">No employees found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{employee.name || 'N/A'}</td>
                      <td className="py-3 px-4">{employee.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          employee.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {employee.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          employee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
