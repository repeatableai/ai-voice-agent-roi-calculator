import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, TrendingUp, DollarSign, Clock, Mail, Plus, BarChart3, ArrowLeft, FileText, Building2, Eye, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CompanyDashboard() {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [companies, setCompanies] = useState([]); // For super admin
  const [selectedCompany, setSelectedCompany] = useState(null); // For super admin viewing a company
  const [employees, setEmployees] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteRole, setInviteRole] = useState('user');
  const [inviting, setInviting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isSuperAdminUser = isSuperAdmin();

  useEffect(() => {
    if (isSuperAdminUser) {
      fetchAllCompanies();
    } else {
      fetchCompanyData();
    }
  }, [isSuperAdminUser]);

  const fetchAllCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/admin/companies`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }

      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyData = async (companyId = null) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      let targetCompanyId = companyId;
      
      // If not provided, get from user
      if (!targetCompanyId) {
        const userResponse = await fetch(`${apiUrl}/api/auth/me`, {
          credentials: 'include'
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user info');
        }
        
        const userData = await userResponse.json();
        targetCompanyId = userData.user?.companyId || userData.user?.company_id;
        
        if (!targetCompanyId) {
          throw new Error('User does not belong to a company');
        }
      }

      // Fetch company details
      const companyResponse = await fetch(`${apiUrl}/api/companies/${targetCompanyId}`, {
        credentials: 'include'
      });
      
      if (!companyResponse.ok) {
        throw new Error('Failed to fetch company');
      }
      
      const companyData = await companyResponse.json();
      const companyDataObj = companyData.company;
      setCompany(companyDataObj);
      setSelectedCompany(companyDataObj);

      // Fetch employees
      const employeesResponse = await fetch(`${apiUrl}/api/companies/${targetCompanyId}/employees`, {
        credentials: 'include'
      });
      
      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData.employees || []);
      }

      // Fetch analytics
      const analyticsResponse = await fetch(`${apiUrl}/api/companies/${targetCompanyId}/analytics`, {
        credentials: 'include'
      });
      
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData.analytics);
      }

    } catch (err) {
      console.error('Error fetching company data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCompany = (companyId) => {
    setSelectedCompany(null);
    setEmployees([]);
    setAnalytics(null);
    fetchCompanyData(companyId);
  };

  const handleBackToList = () => {
    setSelectedCompany(null);
    setCompany(null);
    setEmployees([]);
    setAnalytics(null);
    fetchAllCompanies();
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setInviting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/auth/create-employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: inviteEmail,
          password: invitePassword,
          name: inviteName || inviteEmail.split('@')[0],
          role: inviteRole
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create employee');
      }

      const data = await response.json();
      alert(`Employee created successfully!\n\nEmail: ${data.employee.email}\nPassword: ${invitePassword}\n\nPlease share these credentials with the employee.`);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteName('');
      setInvitePassword('');
      setInviteRole('user');

      // Refresh employees list
      const targetCompanyId = selectedCompany?.id || company?.id;
      if (targetCompanyId) {
        fetchCompanyData(targetCompanyId);
      } else {
        fetchCompanyData();
      }
    } catch (err) {
      console.error('Error creating employee:', err);
      alert('Failed to create employee: ' + err.message);
    } finally {
      setInviting(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // Super Admin: Show all companies list
  if (isSuperAdminUser && !selectedCompany) {
    const filteredCompanies = companies.filter(c =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading companies...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
            <p className="text-gray-600">View and manage all companies on the platform</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies by name, domain, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {filteredCompanies.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No companies found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow cursor-pointer"
                  onClick={() => handleViewCompany(comp.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{comp.name}</h3>
                        {comp.industry && (
                          <p className="text-sm text-gray-500">{comp.industry}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{comp.total_users || 0} users</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>{comp.total_analyses || 0} analyses</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>{comp.total_annual_value_created || formatCurrency(0)} value</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      comp.subscription_status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {comp.subscription_status || 'active'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCompany(comp.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
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

  // Show company details (for admin or super admin viewing a company)
  const displayCompany = selectedCompany || company;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !displayCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <p className="text-gray-600">You may not have permission to access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              {isSuperAdminUser && (
                <button
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to All Companies
                </button>
              )}
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {displayCompany?.name} Dashboard
              </h1>
              <p className="text-gray-600">Company-wide analytics and employee management</p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/analyses"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FileText className="w-4 h-4" />
                View Analyses
              </Link>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">{analytics.totalAnalyses || 0}</span>
              </div>
              <p className="text-gray-600">Total Analyses</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">{analytics.totalUsers || 0}</span>
              </div>
              <p className="text-gray-600">Active Users</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {Math.round(analytics.totalHoursFreed || 0)}
                </span>
              </div>
              <p className="text-gray-600">Hours Freed/Year</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-yellow-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.totalValueCreated || 0)}
                </span>
              </div>
              <p className="text-gray-600">Total Value Created</p>
            </div>
          </div>
        )}

        {/* Employees Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>

          {employees.length === 0 ? (
            <p className="text-gray-600">No employees yet. Add your first employee!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Department</th>
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
                      <td className="py-3 px-4">{employee.department || 'N/A'}</td>
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

        {/* Create Employee Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Employee</h3>
              <form onSubmit={handleCreateEmployee}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="John Smith"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="employee@example.com"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Min 6 characters"
                  />
                  <p className="text-xs text-gray-500 mt-1">Share this password with the employee</p>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {inviting ? 'Creating...' : 'Create Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
