import React, { useState, useEffect } from "react";
import { Company } from "@/api/entities";
import { Service } from "@/api/entities";
import { Technician } from "@/api/entities";
import { CustomerInteraction } from "@/api/entities";
import { Order } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Users,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Crown,
  TrendingUp,
  DollarSign,
  CheckCircle,
  LogOut,
  XCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import CompanyOnboardingForm from "@/components/superadmin/CompanyOnboardingFormEnhanced";

export default function SuperAdminPortal() {
  const [currentUser, setCurrentUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [platformStats, setPlatformStats] = useState({
    totalCompanies: 0,
    totalTechnicians: 0,
    totalVisits: 0,
    productsPresented: 0,
    totalOrders: 0,
    monthlyGrowth: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('📊 [SUPERADMIN] Loading data from localStorage...');

      // Get super admin session
      const session = localStorage.getItem('fieldsell_superadmin_session');
      if (!session) {
        console.error('❌ [SUPERADMIN] No session found');
        return;
      }

      const sessionData = JSON.parse(session);
      setCurrentUser(sessionData.user);
      console.log('✅ [SUPERADMIN] Logged in as:', sessionData.user.full_name);

      // Load ALL companies from localStorage multi-company structure
      const savedAllCompanies = localStorage.getItem('fieldsell_all_companies');
      let companiesData = [];

      if (savedAllCompanies) {
        // Load from multi-company array
        companiesData = JSON.parse(savedAllCompanies);
        console.log('✅ [SUPERADMIN] Loaded companies from all_companies:', companiesData.length);
      } else {
        // Migration: Check if there's an old single company
        const savedCompany = localStorage.getItem('fieldsell_demo_company');
        if (savedCompany) {
          const companyData = JSON.parse(savedCompany);
          companiesData = [{
            id: companyData.id || 'demo-company-1',
            name: companyData.name || 'Demo HVAC Company',
            contact_email: companyData.contact_email || 'demo@example.com',
            admin_email: companyData.admin_email || 'admin@example.com',
            admin_name: companyData.admin_name || 'Demo Admin',
            logo_url: companyData.logo_url || '',
            primary_color: companyData.primary_color || '#3B82F6',
            industry: companyData.industry || 'hvac',
            business_type: companyData.business_type || 'both',
            services: companyData.services || [],
            technicians: companyData.technicians || [],
            status: companyData.status || 'active',
            order_routing_type: companyData.order_routing_type || 'email',
            order_routing_destination: companyData.order_routing_destination || '',
            created_date: companyData.created_date || new Date().toISOString()
          }];
          // Save to new multi-company structure
          localStorage.setItem('fieldsell_all_companies', JSON.stringify(companiesData));
          console.log('✅ [SUPERADMIN] Migrated old company to new structure');
        }
      }

      setCompanies(companiesData);
      loadPlatformStats(companiesData);

    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const loadPlatformStats = async (companiesData) => {
    try {
      // Load from localStorage
      const savedInteractions = localStorage.getItem('fieldsell_demo_interactions');
      const allInteractions = savedInteractions ? JSON.parse(savedInteractions) : [];

      const savedOrders = localStorage.getItem('fieldsell_demo_orders');
      const allOrders = savedOrders ? JSON.parse(savedOrders) : [];

      const savedCompany = localStorage.getItem('fieldsell_demo_company');
      const companyData = savedCompany ? JSON.parse(savedCompany) : null;
      const allTechnicians = companyData?.technicians || [];

      // Calculate products presented (any interaction where a product was offered)
      const productsPresented = allInteractions.length;

      // Count unique visits (group by date and technician)
      const uniqueVisits = new Set(
        allInteractions.map(i => `${i.technician_id}-${new Date(i.created_at).toDateString()}`)
      ).size || 0;

      console.log('📊 [SUPERADMIN] Stats:', {
        visits: uniqueVisits,
        productsPresented: productsPresented,
        orders: allOrders.length,
        technicians: allTechnicians.length
      });

      const monthlyData = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i, 1);
        const monthStr = date.toISOString().slice(0, 7); // YYYY-MM format

        const monthInteractions = allInteractions.filter(interaction =>
          interaction.created_at?.startsWith(monthStr)
        );
        const monthOrders = allOrders.filter(order =>
          order.submitted_at?.startsWith(monthStr)
        );

        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          productsPresented: monthInteractions.length,
          orders: monthOrders.length,
          companies: companiesData.filter(company =>
            company.created_date?.startsWith(monthStr)
          ).length
        });
      }

      setPlatformStats({
        totalCompanies: companiesData.length,
        totalTechnicians: allTechnicians.length,
        totalVisits: uniqueVisits,
        productsPresented: productsPresented,
        totalOrders: allOrders.length,
        monthlyGrowth: monthlyData
      });

    } catch (error) {
      console.error("Error loading platform stats:", error);
    }
  };

  const handleCompanyOnboard = async (companyData) => {
    try {
      console.log('➕ [SUPERADMIN] Onboarding new company:', companyData.name);

      // Create company object with unique ID
      const newCompany = {
        id: `company-${Date.now()}`,
        name: companyData.name,
        phone: companyData.phone || '',
        address: companyData.address || '',
        contact_email: companyData.contact_email || companyData.admin_email,
        admin_email: companyData.admin_email,
        admin_name: companyData.admin_name,
        logo_url: companyData.logo_url || '',
        primary_color: companyData.primary_color || '#3B82F6',
        industry: companyData.industry || '',
        business_type: companyData.business_type || 'both',
        company_size: companyData.company_size || '',
        website_url: companyData.website_url || '',
        services: companyData.services || [],
        technicians: [],
        order_routing_type: companyData.order_routing_type || 'email',
        order_routing_destination: companyData.order_routing_destination || companyData.admin_email,
        status: 'trial',
        created_date: new Date().toISOString()
      };

      // Load existing companies
      const savedAllCompanies = localStorage.getItem('fieldsell_all_companies');
      const allCompanies = savedAllCompanies ? JSON.parse(savedAllCompanies) : [];

      // Add new company
      allCompanies.push(newCompany);

      // Save back to localStorage
      localStorage.setItem('fieldsell_all_companies', JSON.stringify(allCompanies));

      console.log(`✅ [SUPERADMIN] Company "${newCompany.name}" onboarded successfully`);
      console.log(`📧 [SUPERADMIN] Would send invitation to: ${companyData.admin_email}`);

      setShowOnboardingDialog(false);
      loadData();

      alert(`✅ Company "${newCompany.name}" has been successfully onboarded!\n\nAdmin Email: ${newCompany.admin_email}\nPrimary Color: ${newCompany.primary_color}\nServices: ${newCompany.services.length} configured`);

    } catch (error) {
      console.error("❌ [SUPERADMIN] Error onboarding company:", error);
      alert('Error onboarding company. Please try again.');
    }
  };

  const handleCompanyStatusChange = async (companyId, newStatus) => {
    try {
      console.log(`🔄 [SUPERADMIN] Changing company ${companyId} status to:`, newStatus);

      // Load existing companies
      const savedAllCompanies = localStorage.getItem('fieldsell_all_companies');
      if (!savedAllCompanies) return;

      const allCompanies = JSON.parse(savedAllCompanies);

      // Update the company status
      const updatedCompanies = allCompanies.map(company =>
        company.id === companyId
          ? { ...company, status: newStatus }
          : company
      );

      // Save back to localStorage
      localStorage.setItem('fieldsell_all_companies', JSON.stringify(updatedCompanies));

      console.log(`✅ [SUPERADMIN] Company status updated to: ${newStatus}`);

      loadData();
    } catch (error) {
      console.error("❌ [SUPERADMIN] Error updating company status:", error);
    }
  };

  if (!currentUser) {
     return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">FieldSell Pro Admin</h1>
                <p className="text-sm text-gray-600">Super Administrator Dashboard</p>
              </div>
            </div>
            <Button onClick={() => {
              localStorage.removeItem('fieldsell_superadmin_session');
              console.log('🚪 [SUPERADMIN] Logged out');
              window.location.href = '/superadmin/login';
            }} variant="ghost">
               <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="companies">
              <Building2 className="w-4 h-4 mr-2" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Platform Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Companies</p>
                      <p className="text-3xl font-bold">{platformStats.totalCompanies}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Visits</p>
                      <p className="text-3xl font-bold">{platformStats.totalVisits}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Products Presented</p>
                      <p className="text-3xl font-bold">{platformStats.productsPresented}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-3xl font-bold">{platformStats.totalOrders}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Technicians</p>
                      <p className="text-3xl font-bold">{platformStats.totalTechnicians}</p>
                    </div>
                    <Users className="w-8 h-8 text-teal-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Growth Chart */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Platform Growth (Last 12 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformStats.monthlyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="productsPresented" fill="#8884d8" name="Products Presented" />
                    <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                    <Bar dataKey="companies" fill="#ffc658" name="New Companies" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Company Management</h2>
              <Dialog open={showOnboardingDialog} onOpenChange={setShowOnboardingDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Onboard Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Onboard New Company</DialogTitle>
                  </DialogHeader>
                  <CompanyOnboardingForm
                    onSave={handleCompanyOnboard}
                    onCancel={() => setShowOnboardingDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {companies.map((company) => (
                <Card key={company.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {company.logo_url ? (
                          <img src={company.logo_url} alt={company.name} className="w-16 h-16 object-contain rounded-lg border" />
                        ) : (
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">{company.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{company.contact_email}</p>
                          <div className="flex gap-2 mb-2">
                            <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                              {company.status}
                            </Badge>
                            <Badge variant="outline">
                              {company.order_routing_type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(company.created_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select
                          value={company.status}
                          onValueChange={(value) => handleCompanyStatusChange(company.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="trial">Trial</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCompany(company)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              {/* Revenue & Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      ${(() => {
                        const savedOrders = localStorage.getItem('fieldsell_demo_orders');
                        const orders = savedOrders ? JSON.parse(savedOrders) : [];
                        const total = orders.reduce((sum, order) => {
                          const price = parseFloat(order.service_price?.replace(/[^0-9.]/g, '')) || 0;
                          return sum + price;
                        }, 0);
                        return total.toLocaleString();
                      })()}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">All time across all companies</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">Avg Order Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      ${(() => {
                        const savedOrders = localStorage.getItem('fieldsell_demo_orders');
                        const orders = savedOrders ? JSON.parse(savedOrders) : [];
                        if (orders.length === 0) return '0';
                        const total = orders.reduce((sum, order) => {
                          const price = parseFloat(order.service_price?.replace(/[^0-9.]/g, '')) || 0;
                          return sum + price;
                        }, 0);
                        return Math.round(total / orders.length).toLocaleString();
                      })()}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Per order across platform</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {(() => {
                        const savedInteractions = localStorage.getItem('fieldsell_demo_interactions');
                        const interactions = savedInteractions ? JSON.parse(savedInteractions) : [];
                        const savedOrders = localStorage.getItem('fieldsell_demo_orders');
                        const orders = savedOrders ? JSON.parse(savedOrders) : [];

                        if (interactions.length === 0) return '0%';

                        // Count approved products: each service item on completed forms
                        const approvedProductsCount = orders.reduce((count, order) => {
                          if (order.completed_signature === true && order.service_items) {
                            return count + order.service_items.length;
                          }
                          return count;
                        }, 0);

                        return Math.round((approvedProductsCount / interactions.length) * 100) + '%';
                      })()}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Completed orders with signature</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performing Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const savedOrders = localStorage.getItem('fieldsell_demo_orders');
                      const orders = savedOrders ? JSON.parse(savedOrders) : [];

                      // Group by service
                      const serviceStats = {};
                      orders.forEach(order => {
                        const serviceName = order.service_name || 'Unknown';
                        if (!serviceStats[serviceName]) {
                          serviceStats[serviceName] = {
                            name: serviceName,
                            count: 0,
                            revenue: 0
                          };
                        }
                        serviceStats[serviceName].count++;
                        const price = parseFloat(order.service_price?.replace(/[^0-9.]/g, '')) || 0;
                        serviceStats[serviceName].revenue += price;
                      });

                      const topServices = Object.values(serviceStats)
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 5);

                      if (topServices.length === 0) {
                        return <p className="text-gray-500 text-center py-8">No service data yet</p>;
                      }

                      return topServices.map((service, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-sm text-gray-600">{service.count} orders</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">${service.revenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">revenue</p>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Technicians */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Technicians</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const savedOrders = localStorage.getItem('fieldsell_demo_orders');
                      const savedInteractions = localStorage.getItem('fieldsell_demo_interactions');
                      const orders = savedOrders ? JSON.parse(savedOrders) : [];
                      const interactions = savedInteractions ? JSON.parse(savedInteractions) : [];

                      // Group by technician
                      const techStats = {};
                      orders.forEach(order => {
                        const techName = order.technician_name || 'Unknown';
                        if (!techStats[techName]) {
                          techStats[techName] = {
                            name: techName,
                            orders: 0,
                            revenue: 0,
                            interactions: 0,
                            approved: 0
                          };
                        }
                        techStats[techName].orders++;
                        const price = parseFloat(order.service_price?.replace(/[^0-9.]/g, '')) || 0;
                        techStats[techName].revenue += price;
                      });

                      interactions.forEach(interaction => {
                        const techName = interaction.technician_name || 'Unknown';
                        if (!techStats[techName]) {
                          techStats[techName] = {
                            name: techName,
                            orders: 0,
                            revenue: 0,
                            interactions: 0,
                            approved: 0
                          };
                        }
                        techStats[techName].interactions++;
                        if (interaction.decision === 'approved') {
                          techStats[techName].approved++;
                        }
                      });

                      const topTechs = Object.values(techStats)
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 5);

                      if (topTechs.length === 0) {
                        return <p className="text-gray-500 text-center py-8">No technician data yet</p>;
                      }

                      return topTechs.map((tech, index) => {
                        const approvalRate = tech.interactions > 0
                          ? Math.round((tech.approved / tech.interactions) * 100)
                          : 0;

                        return (
                          <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{tech.name}</p>
                                <p className="text-sm text-gray-600">
                                  {tech.orders} orders • {approvalRate}% approval
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">${tech.revenue.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">total revenue</p>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Company Performance Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {companies.map((company, index) => {
                      const savedOrders = localStorage.getItem('fieldsell_demo_orders');
                      const savedInteractions = localStorage.getItem('fieldsell_demo_interactions');
                      const orders = savedOrders ? JSON.parse(savedOrders) : [];
                      const interactions = savedInteractions ? JSON.parse(savedInteractions) : [];

                      const companyOrders = orders.filter(o => o.company_id === company.id);
                      const companyInteractions = interactions.filter(i => i.company_id === company.id);

                      const revenue = companyOrders.reduce((sum, order) => {
                        const price = parseFloat(order.service_price?.replace(/[^0-9.]/g, '')) || 0;
                        return sum + price;
                      }, 0);

                      const approvalRate = companyInteractions.length > 0
                        ? Math.round((companyInteractions.filter(i => i.decision === 'approved').length / companyInteractions.length) * 100)
                        : 0;

                      return (
                        <div key={company.id} className="border-b pb-4 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {company.logo_url ? (
                                <img src={company.logo_url} alt={company.name} className="w-10 h-10 object-contain rounded" />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-white" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold">{company.name}</p>
                                <p className="text-sm text-gray-600">{company.contact_email}</p>
                              </div>
                            </div>
                            <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                              {company.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-600">Products Presented</p>
                              <p className="text-lg font-bold">{companyInteractions.length}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Orders</p>
                              <p className="text-lg font-bold">{companyOrders.length}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Revenue</p>
                              <p className="text-lg font-bold text-green-600">${revenue.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Conversion Rate</p>
                              <p className="text-lg font-bold text-purple-600">{approvalRate}%</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {companies.length === 0 && (
                      <p className="text-gray-500 text-center py-8">No companies onboarded yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              {/* Platform Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Platform Name</Label>
                      <p className="text-lg font-semibold">FieldSell Pro</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Version</Label>
                      <p className="text-lg font-semibold">v2.1.0</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Environment</Label>
                      <Badge variant="outline">Demo Mode</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Data Storage</Label>
                      <Badge variant="secondary">localStorage</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Default Service Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Default Service Templates</CardTitle>
                  <p className="text-sm text-gray-600">Pre-configured service templates available for all companies</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Annual Maintenance Plan</h4>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Recommended for: HVAC, Plumbing, Electrical</p>
                      <p className="text-sm">Typical Price Range: $200 - $400/year</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Smart Device Upgrade</h4>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Recommended for: HVAC, Security, Home Automation</p>
                      <p className="text-sm">Typical Price Range: $299 - $599 installed</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Emergency Service Package</h4>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Recommended for: All service industries</p>
                      <p className="text-sm">Typical Price Range: $150 - $300/year</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email & Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Email & Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="platform-email">Platform Email Address</Label>
                    <Input
                      id="platform-email"
                      type="email"
                      defaultValue="noreply@fieldsellpro.com"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Used for system notifications and alerts</p>
                  </div>
                  <div>
                    <Label htmlFor="support-email">Support Email Address</Label>
                    <Input
                      id="support-email"
                      type="email"
                      defaultValue="support@fieldsellpro.com"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Displayed to users for customer support</p>
                  </div>
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Company Onboarding</p>
                          <p className="text-xs text-gray-600">Send welcome email when new company joins</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Weekly Analytics Report</p>
                          <p className="text-xs text-gray-600">Send platform stats to super admins</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Order Notifications</p>
                          <p className="text-xs text-gray-600">Notify when orders are placed</p>
                        </div>
                        <input type="checkbox" className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Integration Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Webhook Integration</Label>
                    <p className="text-sm text-gray-600 mb-2">Configure global webhook endpoints for platform events</p>
                    <Input
                      placeholder="https://api.example.com/webhooks/fieldsell"
                      className="mt-1"
                    />
                  </div>
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium mb-3 block">Available Integrations</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Stripe</span>
                          <Badge variant="outline">Connected</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Payment processing</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">SendGrid</span>
                          <Badge variant="outline">Connected</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Email delivery</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Twilio</span>
                          <Badge variant="secondary">Not Connected</Badge>
                        </div>
                        <p className="text-xs text-gray-600">SMS notifications</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Zapier</span>
                          <Badge variant="outline">Connected</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Workflow automation</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Role Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle>User Role Permissions</CardTitle>
                  <p className="text-sm text-gray-600">Configure default permissions for each role type</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-purple-600" />
                        Super Admin
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Manage all companies</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>View all analytics</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Platform settings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Billing management</span>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        Company Admin
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Manage services</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Manage technicians</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>View company analytics</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Company settings</span>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        Technician
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>View services</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Create orders</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>View own performance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-gray-400">Manage company settings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <p className="text-sm text-gray-600">Manage platform data and storage</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{(() => {
                        const saved = localStorage.getItem('fieldsell_demo_company');
                        return saved ? '1' : '0';
                      })()}</p>
                      <p className="text-sm text-gray-600">Companies</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{(() => {
                        const saved = localStorage.getItem('fieldsell_demo_orders');
                        return saved ? JSON.parse(saved).length : 0;
                      })()}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{(() => {
                        const saved = localStorage.getItem('fieldsell_demo_interactions');
                        return saved ? JSON.parse(saved).length : 0;
                      })()}</p>
                      <p className="text-sm text-gray-600">Products Presented</p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium mb-3 block">Data Actions</Label>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const data = {
                            company: localStorage.getItem('fieldsell_demo_company'),
                            orders: localStorage.getItem('fieldsell_demo_orders'),
                            interactions: localStorage.getItem('fieldsell_demo_interactions'),
                            technician: localStorage.getItem('fieldsell_demo_technician')
                          };
                          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `fieldsell-backup-${new Date().toISOString().split('T')[0]}.json`;
                          a.click();
                          console.log('📦 [SUPERADMIN] Data exported');
                        }}
                      >
                        Export Platform Data
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (confirm('This will clear all demo data except super admin session. Continue?')) {
                            localStorage.removeItem('fieldsell_demo_company');
                            localStorage.removeItem('fieldsell_demo_orders');
                            localStorage.removeItem('fieldsell_demo_interactions');
                            localStorage.removeItem('fieldsell_demo_technician');
                            console.log('🗑️ [SUPERADMIN] Demo data cleared');
                            window.location.reload();
                          }
                        }}
                      >
                        Clear Demo Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save Settings Button */}
              <div className="flex justify-end">
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    alert('Settings saved successfully! (Demo mode - changes are not persisted)');
                  }}
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}