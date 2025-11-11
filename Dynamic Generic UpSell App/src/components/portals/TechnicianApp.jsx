import React, { useState, useEffect } from "react";
import { Company } from "@/api/entities";
import { Service } from "@/api/entities";
import { Technician } from "@/api/entities";
import { CustomerInteraction } from "@/api/entities";
import { Order } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle, XCircle, LogOut, Wrench, DollarSign, Clock, FileText, Phone, Mail, MapPin, Building2, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BindingOrderForm from "@/components/technician/BindingOrderForm";

export default function TechnicianApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [company, setCompany] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showCustomerMode, setShowCustomerMode] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerDecision, setCustomerDecision] = useState(null);
  const [orderData, setOrderData] = useState({});
  const [isNewVisit, setIsNewVisit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todayStats, setTodayStats] = useState({ visits: 0, offered: 0, approved: 0, orders: 0 });
  const [myStats, setMyStats] = useState({
    approvalRate: 0,
    totalOrders: 0,
    weekOrders: 0,
    avgOrderValue: 0
  });
  const [myRecentActivity, setMyRecentActivity] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      console.log('👤 [TECHNICIAN] Loading user data from localStorage...');

      // Load logged-in technician from localStorage
      const savedTechnician = localStorage.getItem('fieldsell_demo_technician');
      if (!savedTechnician) {
        console.error('❌ [TECHNICIAN] No logged-in technician found');
        window.location.href = '/technician/login';
        return;
      }

      const techData = JSON.parse(savedTechnician);
      setCurrentUser({ email: `${techData.employee_id}@demo.com`, name: techData.full_name });
      setTechnician({
        id: techData.employee_id,
        employee_id: techData.employee_id,
        full_name: techData.full_name,
        company_id: techData.company_id
      });

      console.log('✅ [TECHNICIAN] Logged in as:', techData.full_name);

      // Load company data from localStorage
      const savedCompany = localStorage.getItem('fieldsell_demo_company');
      if (savedCompany) {
        const companyData = JSON.parse(savedCompany);
        setCompany(companyData);
        console.log('✅ [TECHNICIAN] Loaded company:', companyData.name);

        // Load services from company data and add IDs if missing
        const servicesData = companyData.services || [];
        const servicesWithIds = servicesData.map((service, idx) => ({
          ...service,
          id: service.id || `service-${idx}-${Date.now()}` // Add unique ID if missing
        }));
        setServices(servicesWithIds.filter(s => s.is_active !== false));
        console.log(`✅ [TECHNICIAN] Loaded ${servicesWithIds.length} services`);
      } else {
        console.error('❌ [TECHNICIAN] No company data found');
      }

      // Load my interactions and orders for performance tracking
      const savedInteractions = localStorage.getItem('fieldsell_demo_interactions');
      const allInteractions = savedInteractions ? JSON.parse(savedInteractions) : [];
      const myInteractions = allInteractions.filter(i => i.technician_id === techData.employee_id);

      const savedOrders = localStorage.getItem('fieldsell_demo_orders');
      const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
      const myOrders = allOrders.filter(o => o.technician_id === techData.employee_id);

      // Calculate today's stats from actual data
      const today = new Date().toDateString();
      const todayInteractions = myInteractions.filter(i => new Date(i.created_at).toDateString() === today);
      const todayOrders = myOrders.filter(o => new Date(o.submitted_at).toDateString() === today);

      // Count visits from is_new_visit flag
      const todayVisits = todayInteractions.filter(i => i.is_new_visit === true).length;

      // Count offered products: 1 per interaction initially, but will be updated when order is submitted
      // For now, count interactions as offered products (will be replaced by service_items count later)
      const todayOffered = todayInteractions.length;

      // Count approved products: sum of service_items on today's completed orders
      const todayApproved = todayOrders.reduce((count, order) => {
        if (order.completed_signature === true && order.service_items) {
          return count + order.service_items.length;
        }
        return count;
      }, 0);

      setTodayStats({
        visits: todayVisits,
        offered: todayOffered,
        approved: todayApproved,
        orders: todayOrders.length
      });

      // Calculate approval rate: approved products (service items on signed orders) / products offered (interactions)
      const approvedProductsCount = myOrders.reduce((count, order) => {
        if (order.completed_signature === true && order.service_items) {
          return count + order.service_items.length;
        }
        return count;
      }, 0);

      const approvalRate = myInteractions.length > 0
        ? Math.round((approvedProductsCount / myInteractions.length) * 100)
        : 0;

      // Week stats
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekOrders = myOrders.filter(o => new Date(o.submitted_at) >= weekAgo).length;

      // Avg order value
      const totalRevenue = myOrders.reduce((sum, order) => {
        const price = parseFloat(order.service_price.replace(/[^0-9.]/g, '')) || 0;
        return sum + price;
      }, 0);
      const avgOrderValue = myOrders.length > 0 ? Math.round(totalRevenue / myOrders.length) : 0;

      setMyStats({
        approvalRate,
        totalOrders: myOrders.length,
        weekOrders,
        avgOrderValue
      });

      // Recent activity
      const myRecentActivityData = myInteractions
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);
      setMyRecentActivity(myRecentActivityData);

      console.log('📊 [TECHNICIAN] Performance stats loaded:', {
        approvalRate: `${approvalRate}%`,
        totalOrders: myOrders.length,
        weekOrders,
        avgValue: `$${avgOrderValue}`
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadTodayStats = async (technicianId) => {
    const today = new Date().toISOString().split('T')[0];
    
    const interactions = await CustomerInteraction.filter({
      technician_id: technicianId,
      created_date: { '$gte': today }
    });
    
    const orders = await Order.filter({
      technician_id: technicianId,
      created_date: { '$gte': today }
    });
    
    setTodayStats({
      offered: interactions.length,
      approved: interactions.filter(i => i.decision === 'approved').length,
      orders: orders.length
    });
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowCustomerMode(false);
    setCustomerDecision(null);
    setShowOrderForm(false);
    setOrderData({});
  };

  const handlePresentToCustomer = () => {
    setShowCustomerMode(true);
  };

  const handleCustomerDecision = async (decision) => {
    setCustomerDecision(decision);

    console.log(`📝 [TECHNICIAN] Customer decision: ${decision}`);

    const interactionId = `interaction-${Date.now()}`;

    // Save interaction to localStorage
    const interaction = {
      id: interactionId,
      company_id: technician.company_id,
      technician_id: technician.id,
      technician_name: technician.full_name,
      service_id: selectedService.id,
      service_name: selectedService.name,
      decision: decision,
      is_new_visit: isNewVisit,
      job_number: orderData.job_number || '',
      created_at: new Date().toISOString()
    };

    const savedInteractions = localStorage.getItem('fieldsell_demo_interactions');
    const interactions = savedInteractions ? JSON.parse(savedInteractions) : [];
    interactions.push(interaction);
    localStorage.setItem('fieldsell_demo_interactions', JSON.stringify(interactions));
    console.log(`💾 [TECHNICIAN] Saved interaction (${decision})`);

    // Reload data to update stats in real-time
    await loadUserData();

    if (decision === 'approved') {
      setShowOrderForm(true);
      setOrderData(prev => ({ ...prev, customer_interaction_id: interactionId }));
    } else {
      setSelectedService(null);
      setShowCustomerMode(false);
      setIsNewVisit(false); // Reset the checkbox
    }
  };

  const handleOrderSubmit = async (bindingOrderData) => {
    // Enhanced handling for binding orders with signature
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const order = {
        id: `order-${Date.now()}`,
        company_id: technician.company_id,
        technician_id: technician.id,
        technician_name: technician.full_name,
        service_id: selectedService?.id || 'multiple',
        service_name: bindingOrderData.service_name,
        service_price: bindingOrderData.service_price,
        customer_name: bindingOrderData.customer_name,
        customer_email: bindingOrderData.customer_email,
        customer_phone: bindingOrderData.customer_phone || '',
        service_address: bindingOrderData.service_address || '',
        job_number: bindingOrderData.job_number || '',
        submitted_at: new Date().toISOString(),
        technician_notes: bindingOrderData.technician_notes || '',
        service_items: bindingOrderData.service_items || [],
        subtotal: bindingOrderData.subtotal || 0,
        tax_rate: bindingOrderData.tax_rate || 0,
        tax_amount: bindingOrderData.tax_amount || 0,
        grand_total: bindingOrderData.grand_total || 0,
        payment_method: bindingOrderData.payment_method || 'Credit Card on File',
        signature: bindingOrderData.signature || '',
        completed_signature: bindingOrderData.completed_signature || false,
        binding_order: bindingOrderData.binding_order || false,
        status: 'submitted'
      };

      // Save order to localStorage
      const savedOrders = localStorage.getItem('fieldsell_demo_orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      orders.push(order);
      localStorage.setItem('fieldsell_demo_orders', JSON.stringify(orders));

      console.log("✅ [TECHNICIAN] Binding order submitted and saved:", order);

      if (company?.order_routing_type === 'email') {
        console.log("📧 [TECHNICIAN] Would send order via email to:", company.order_routing_destination);
      } else if (company?.order_routing_type === 'webhook') {
        console.log("🔗 [TECHNICIAN] Would send order via webhook to:", company.order_routing_destination);
      }

      setSelectedService(null);
      setShowCustomerMode(false);
      setShowOrderForm(false);
      setOrderData({});
      setIsNewVisit(false); // Reset the checkbox

      // Reload all data to update stats in real-time
      await loadUserData();

      alert(`✅ Binding Order submitted successfully!\nGrand Total: ${bindingOrderData.service_price}`);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error submitting order. Please try again.");
    }

    setIsSubmitting(false);
  };

  const handleLogout = () => {
    console.log('🚪 [TECHNICIAN] Logging out...');
    // Clear technician session from localStorage
    localStorage.removeItem('fieldsell_demo_technician');
    // Redirect to technician login page
    window.location.href = '/technician/login';
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

  if (!currentUser || !technician) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Customer-facing mode
  if (showCustomerMode && selectedService && !customerDecision) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-md mx-auto">
          <Button
            onClick={() => {
              setShowCustomerMode(false);
              setSelectedService(null);
            }}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
          <div className="text-center mb-8">
            {company?.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="w-32 h-16 mx-auto mb-4 object-contain" />
            ) : (
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8 text-white" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{company?.name || 'HVAC Services'}</h1>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-center">{selectedService.name}</CardTitle>
              <div className="text-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <DollarSign className="w-5 h-5 mr-1" />
                  {selectedService.price}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-700">{selectedService.customer_description || 'Professional HVAC service for your home.'}</p>
                {selectedService.benefits && selectedService.benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {selectedService.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mb-6">
            <p className="text-lg font-medium text-gray-900 mb-4">
              Would you like to proceed with this service?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleCustomerDecision('declined')}
              variant="outline"
              className="h-16 text-lg border-red-200 text-red-700 hover:bg-red-50"
            >
              <XCircle className="w-6 h-6 mr-2" />
              Decline
            </Button>
            <Button
              onClick={() => handleCustomerDecision('approved')}
              className="h-16 text-lg bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Order form - Enhanced Binding Order
  if (showOrderForm && selectedService) {
    return (
      <BindingOrderForm
        selectedService={selectedService}
        technician={technician}
        company={company}
        onSubmit={handleOrderSubmit}
        onCancel={() => {
          setShowOrderForm(false);
          setSelectedService(null);
          setShowCustomerMode(false);
        }}
      />
    );
  }

  // Service detail view
  if (selectedService && !showCustomerMode) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={() => setSelectedService(null)} variant="outline" size="sm">
              ← Back
            </Button>
            <h1 className="font-semibold">Service Details</h1>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{selectedService.name}</CardTitle>
              <Badge variant="secondary" className="w-fit">
                <DollarSign className="w-4 h-4 mr-1" />
                {selectedService.price}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">WHEN TO OFFER:</h4>
                <p className="text-sm bg-yellow-50 p-2 rounded">{selectedService.when_to_offer}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">YOUR SCRIPT:</h4>
                <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  {selectedService.technician_script}
                </p>
              </div>
              
              {selectedService.benefits && selectedService.benefits.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">BENEFITS TO MENTION:</h4>
                  <ul className="space-y-1">
                    {selectedService.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-4 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="new-visit"
                  checked={isNewVisit}
                  onCheckedChange={setIsNewVisit}
                />
                <label
                  htmlFor="new-visit"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Is this a new customer visit?
                </label>
              </div>
              <p className="text-xs text-gray-600 mt-2 ml-7">
                Check this box if this is a new visit to track visits accurately
              </p>
            </CardContent>
          </Card>

          <Button
            onClick={handlePresentToCustomer}
            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
          >
            Present to Customer
          </Button>
        </div>
      </div>
    );
  }

  // Main app dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="shadow-sm border-b p-4" style={{ background: `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-hover) 50%, white 100%)` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company?.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="w-10 h-10 object-contain bg-white/90 p-2 rounded-lg shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--brand-primary)' }}>
                <Wrench className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h1 className="font-semibold">{company?.name || 'HVAC Services'}</h1>
              <p className="text-sm text-gray-600">Hello, {technician?.full_name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.location.href = '/admin'} variant="outline" size="sm">
              <Building2 className="w-4 h-4 mr-1" />
              Admin
            </Button>
            <Button onClick={() => window.location.href = '/superadmin/login'} variant="outline" size="sm">
              Super Admin
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Today's Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>{todayStats.visits}</div>
              <div className="text-xs text-gray-600">Visits</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>{todayStats.offered}</div>
              <div className="text-xs text-gray-600">Offered</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>{todayStats.approved}</div>
              <div className="text-xs text-gray-600">Approved</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>{todayStats.orders}</div>
              <div className="text-xs text-gray-600">Orders</div>
            </CardContent>
          </Card>
        </div>

        {/* My Performance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">My Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                  {myStats.approvalRate}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                  {myStats.totalOrders}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-xl font-bold">{myStats.weekOrders} orders</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-xl font-bold">${myStats.avgOrderValue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Recent Activity */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">My Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {myRecentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No activity yet. Start presenting services!</p>
              ) : (
                myRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {activity.decision === 'approved' ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{activity.service_name}</p>
                        <p className="text-xs text-gray-600">
                          <span className={activity.decision === 'approved' ? 'text-green-600' : 'text-red-600'}>
                            {activity.decision}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatTimeAgo(activity.created_at)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Available Services */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Services</h2>
          {services.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No services configured. Contact your admin to set up services.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <Card 
                  key={service.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleServiceSelect(service)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{service.name}</h3>
                      <Badge variant="secondary">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {service.price}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {service.when_to_offer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}