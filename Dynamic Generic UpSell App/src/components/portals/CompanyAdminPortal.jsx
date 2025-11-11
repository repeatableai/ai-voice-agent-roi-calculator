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
import {
  Building2,
  Users,
  Wrench,
  Settings,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  LogOut,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import ServiceForm from "@/components/admin/ServiceForm";
import TechnicianForm from "@/components/admin/TechnicianForm";
import CompanySettings from "@/components/admin/CompanySettings";
import Analytics from "@/components/admin/Analytics";
import { BrandingProvider, useBranding } from "@/components/BrandingProvider";

// Define sample data outside the component
const sampleServices = [
  {
    name: "Annual Maintenance Plan",
    price: "$240/yr",
    when_to_offer: "During any routine service or tune-up call.",
    benefits: ["Priority Service Scheduling", "15% Discount on All Repairs", "Two Comprehensive Tune-ups Per Year", "Extends System Lifespan"],
    technician_script: "I noticed you're not currently enrolled in our maintenance plan. It's a great way to ensure your system runs efficiently and prevent costly breakdowns. For just $240 a year, you get priority service, discounts, and two tune-ups. Is that something you might be interested in hearing more about?",
    customer_description: "Ensure your HVAC system runs at peak performance and efficiency year-round. Our plan includes two seasonal tune-ups, priority service, and discounts on any necessary repairs.",
    is_active: true,
    order_priority: 1
  },
  {
    name: "Smart Thermostat Upgrade",
    price: "$399 Installed",
    when_to_offer: "When the customer has an older, non-programmable thermostat.",
    benefits: ["Lower Monthly Energy Bills", "Control Temperature From Your Phone", "Learns Your Schedule Automatically", "Geofencing Capabilities"],
    technician_script: "I see you have a traditional thermostat. We could upgrade you to a new smart thermostat today. They're amazing for saving on energy bills and you can control it right from your phone. We can get one installed for you right now for $399. Would you like to do that?",
    customer_description: "Take full control of your home's comfort and energy usage. A smart thermostat learns your preferences and can be controlled from anywhere, saving you money and keeping you comfortable.",
    is_active: true,
    order_priority: 2
  }
];

const sampleTechnicians = [
    {
        user_email: "tech@example.com",
        full_name: "John Doe",
        employee_id: "TCH-001",
        phone: "555-987-6543",
        is_active: true,
        hire_date: "2023-05-15"
    }
];

export default function CompanyAdminPortal() {
  const [currentUser, setCurrentUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [services, setServices] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showTechnicianDialog, setShowTechnicianDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingTechnician, setEditingTechnician] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalServices: 0,
    totalTechnicians: 0,
    totalVisits: 0,
    productsPresented: 0,
    totalOrders: 0,
    approvalRate: 0,
    monthlyRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedCompany = localStorage.getItem('fieldsell_demo_company');
      let loadedServices = sampleServices;
      let loadedTechnicians = sampleTechnicians;
      let companyData = null;

      if (savedCompany) {
        companyData = JSON.parse(savedCompany);
        setCompany(companyData);

        loadedServices = companyData.services && companyData.services.length > 0
          ? companyData.services
          : sampleServices;
        setServices(loadedServices);

        loadedTechnicians = companyData.technicians && companyData.technicians.length > 0
          ? companyData.technicians
          : sampleTechnicians;
        setTechnicians(loadedTechnicians);

        console.log('📊 [DASHBOARD] Loaded company:', companyData.name);
        console.log('📊 [DASHBOARD] Loaded services:', loadedServices.length);
        console.log('👥 [DASHBOARD] Loaded technicians:', loadedTechnicians.length);
      } else {
        setCompany({ id: "demo-company", name: "Demo HVAC Company" });
        setServices(sampleServices);
        setTechnicians(sampleTechnicians);
        console.log('📊 [DASHBOARD] No saved company, using sample data');
      }

      setCurrentUser({ email: "demo@example.com", name: "Demo User" });

      // Load orders from localStorage for REAL stats
      const savedOrders = localStorage.getItem('fieldsell_demo_orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];

      const savedInteractions = localStorage.getItem('fieldsell_demo_interactions');
      const interactions = savedInteractions ? JSON.parse(savedInteractions) : [];

      // Count visits from is_new_visit flag
      const totalVisits = interactions.filter(i => i.is_new_visit === true).length;

      // Calculate products presented (any interaction where a product was offered)
      const productsPresented = interactions.length;

      // Count approved products: sum of service_items on signed forms
      const approvedProductsCount = orders.reduce((count, order) => {
        if (order.completed_signature === true && order.service_items) {
          // Count each service item on the signed form
          return count + order.service_items.length;
        }
        return count;
      }, 0);

      // Calculate approval rate: approved products / products presented
      const approvalRate = productsPresented > 0
        ? Math.round((approvedProductsCount / productsPresented) * 100)
        : 0;

      // Conversion rate = same as approval rate
      const conversionRate = approvalRate;

      // Calculate real revenue from orders
      const monthlyRevenue = orders.reduce((sum, order) => {
        const priceStr = order.service_price || '$0';
        const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
        return sum + price;
      }, 0);

      setDashboardStats({
        totalServices: loadedServices.length,
        totalTechnicians: loadedTechnicians.length,
        totalVisits: totalVisits,
        productsPresented: productsPresented,
        totalOrders: orders.length,
        approvalRate: approvalRate,
        conversionRate: conversionRate,
        monthlyRevenue: Math.round(monthlyRevenue)
      });

      // Load recent activity
      const recentActivityData = interactions
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 20);
      setRecentActivity(recentActivityData);

      console.log('📊 [DASHBOARD] Real Stats:', {
        services: loadedServices.length,
        technicians: loadedTechnicians.length,
        interactions: interactions.length,
        orders: orders.length,
        approvalRate: `${approvalRate}%`,
        revenue: `$${monthlyRevenue}`,
        recentActivity: recentActivityData.length
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const loadDashboardStats = async (companyId, serviceCount, techCount) => {
    try {
      const interactions = await CustomerInteraction.filter({ company_id: companyId });
      const orders = await Order.filter({ company_id: companyId });
      const approvedInteractions = interactions.filter(i => i.decision === 'approved');
      
      setDashboardStats({
        totalServices: serviceCount,
        totalTechnicians: techCount,
        totalInteractions: interactions.length,
        totalOrders: orders.length,
        approvalRate: interactions.length > 0 ? Math.round((approvedInteractions.length / interactions.length) * 100) : 0,
        monthlyRevenue: 0 // Would calculate from orders
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleServiceSave = async (serviceData) => {
    try {
      if (editingService) {
        await Service.update(editingService.id, serviceData);
      } else {
        await Service.create({ ...serviceData, company_id: company.id });
      }
      
      setShowServiceDialog(false);
      setEditingService(null);
      loadData();
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleServiceDelete = async (serviceId) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await Service.delete(serviceId);
        loadData();
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleTechnicianSave = async (technicianData) => {
    try {
      const savedCompany = localStorage.getItem('fieldsell_demo_company');
      const companyData = JSON.parse(savedCompany);

      if (editingTechnician) {
        companyData.technicians = companyData.technicians.map(t =>
          t.id === editingTechnician.id ? { ...t, ...technicianData } : t
        );
        console.log('✏️ [ADMIN] Updated technician:', technicianData.full_name);
      } else {
        const newTech = {
          id: `tech-${Date.now()}`,
          ...technicianData,
          company_id: companyData.id,
          is_active: true,
          hire_date: new Date().toISOString()
        };
        companyData.technicians = [...(companyData.technicians || []), newTech];
        console.log('➕ [ADMIN] Added technician:', newTech.full_name);
      }

      localStorage.setItem('fieldsell_demo_company', JSON.stringify(companyData));
      setShowTechnicianDialog(false);
      setEditingTechnician(null);
      loadData();
    } catch (error) {
      console.error("Error saving technician:", error);
      alert('Error saving technician. Please try again.');
    }
  };

  const handleTechnicianToggle = async (technician) => {
    try {
      const savedCompany = localStorage.getItem('fieldsell_demo_company');
      const companyData = JSON.parse(savedCompany);

      companyData.technicians = companyData.technicians.map(t =>
        t.id === technician.id ? { ...t, is_active: !t.is_active } : t
      );

      localStorage.setItem('fieldsell_demo_company', JSON.stringify(companyData));
      console.log(`🔄 [ADMIN] Toggled ${technician.full_name}: ${!technician.is_active ? 'active' : 'inactive'}`);
      loadData();
    } catch (error) {
      console.error("Error toggling technician:", error);
      alert('Error updating technician status.');
    }
  };

  const handleCompanyUpdate = async (companyData) => {
    try {
      await Company.update(company.id, companyData);
      setCompany({ ...company, ...companyData });
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  if (!currentUser || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2" style={{ borderColor: 'var(--brand-primary, #3B82F6)' }}></div>
      </div>
    );
  }

  return (
    <BrandingProvider company={company}>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="shadow-sm border-b" style={{ background: `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-hover) 50%, white 100%)` }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="w-12 h-12 object-contain bg-white/90 p-2 rounded-lg shadow-sm" />
              ) : (
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--brand-primary)' }}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold">{company.name}</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const johnDoe = {
                    id: 'tech-1',
                    employee_id: 'TCH-001',
                    full_name: 'John Doe',
                    company_id: company.id,
                    user_email: 'tech@example.com',
                    phone: '555-987-6543',
                    is_active: true,
                    logged_in_at: new Date().toISOString()
                  };
                  localStorage.setItem('fieldsell_demo_technician', JSON.stringify(johnDoe));
                  console.log('🚀 [ADMIN] Auto-logging in as John Doe');
                  window.location.href = '/technician';
                }}
                variant="outline"
                size="sm"
              >
                <Wrench className="w-4 h-4 mr-2" />
                View as Technician →
              </Button>
              <Button
                onClick={() => window.location.href = '/superadmin/login'}
                variant="outline"
                size="sm"
              >
                Super Admin
              </Button>
              <Button
                onClick={() => {
                  if (confirm('Are you sure you want to reset? This will clear all demo data.')) {
                    localStorage.clear();
                    window.location.href = '/';
                  }
                }}
                variant="ghost"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Reset & Start Over
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="services">
              <Wrench className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="technicians">
              <Users className="w-4 h-4 mr-2" />
              Technicians
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

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium text-gray-600">Visits</p>
                    <p className="text-3xl font-bold">{dashboardStats.totalVisits}</p>
                    <Building2 className="w-8 h-8 mt-2" style={{ color: 'var(--brand-primary)' }} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium text-gray-600">Products Presented</p>
                    <p className="text-3xl font-bold">{dashboardStats.productsPresented}</p>
                    <Wrench className="w-8 h-8 mt-2" style={{ color: 'var(--brand-primary)' }} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                    <p className="text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>{dashboardStats.approvalRate}%</p>
                    <CheckCircle className="w-8 h-8 mt-2" style={{ color: 'var(--brand-primary)' }} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>{dashboardStats.totalOrders}</p>
                    <DollarSign className="w-8 h-8 mt-2" style={{ color: 'var(--brand-primary)' }} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>${dashboardStats.monthlyRevenue.toLocaleString()}</p>
                    <TrendingUp className="w-8 h-8 mt-2" style={{ color: 'var(--brand-primary)' }} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => {
                      setActiveTab('services');
                      setEditingService(null);
                      setShowServiceDialog(true);
                    }}
                    className="w-full justify-start"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Service
                  </Button>
                  <Button
                    onClick={() => {
                      setActiveTab('technicians');
                      setEditingTechnician(null);
                      setShowTechnicianDialog(true);
                    }}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Technician
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {recentActivity.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No activity yet. Technicians will see their interactions here.</p>
                    ) : (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                          <div className="flex items-center gap-3">
                            {activity.decision === 'approved' ? (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{activity.service_name}</p>
                              <p className="text-sm text-gray-600">
                                {activity.technician_name} • <span className={activity.decision === 'approved' ? 'text-green-600' : 'text-red-600'}>{activity.decision}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500 flex-shrink-0 ml-2">
                            {formatTimeAgo(activity.created_at)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Service Management</h2>
              <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingService(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingService ? 'Edit Service' : 'Add New Service'}
                    </DialogTitle>
                  </DialogHeader>
                  <ServiceForm
                    service={editingService}
                    onSave={handleServiceSave}
                    onCancel={() => {
                      setShowServiceDialog(false);
                      setEditingService(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{service.name}</h3>
                          <Badge variant="secondary">{service.price}</Badge>
                          {!service.is_active && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>When to offer:</strong> {service.when_to_offer}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Script:</strong> {service.technician_script?.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingService(service);
                            setShowServiceDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleServiceDelete(service.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technicians" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Technician Management</h2>
              <Dialog open={showTechnicianDialog} onOpenChange={setShowTechnicianDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingTechnician(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Technician
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingTechnician ? 'Edit Technician' : 'Add New Technician'}
                    </DialogTitle>
                  </DialogHeader>
                  <TechnicianForm
                    technician={editingTechnician}
                    onSave={handleTechnicianSave}
                    onCancel={() => {
                      setShowTechnicianDialog(false);
                      setEditingTechnician(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {technicians.map((technician) => (
                <Card key={technician.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{technician.full_name}</h3>
                        <p className="text-sm text-gray-600">{technician.user_email}</p>
                        {technician.employee_id && (
                          <p className="text-sm text-gray-600">ID: {technician.employee_id}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={technician.is_active ? "default" : "secondary"}>
                          {technician.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTechnicianToggle(technician)}
                        >
                          {technician.is_active ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Analytics companyId={company.id} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <CompanySettings company={company} onUpdate={handleCompanyUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </BrandingProvider>
  );
}