import React, { useState, useEffect } from "react";
import { CustomerInteraction } from "@/api/entities";
import { Order } from "@/api/entities";
import { Technician } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Analytics({ companyId }) {
  const [timeRange, setTimeRange] = useState('30');
  const [interactions, setInteractions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    productsPresented: 0,
    totalOrders: 0,
    approvalRate: 0,
    conversionRate: 0,
    topTechnicians: [],
    dailyStats: [],
    serviceBreakdown: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, companyId]);

  const loadAnalytics = async () => {
    try {
      const savedInteractions = localStorage.getItem('fieldsell_demo_interactions');
      const interactionsData = savedInteractions ? JSON.parse(savedInteractions) : [];

      const savedOrders = localStorage.getItem('fieldsell_demo_orders');
      const ordersData = savedOrders ? JSON.parse(savedOrders) : [];

      const savedCompany = localStorage.getItem('fieldsell_demo_company');
      const companyData = savedCompany ? JSON.parse(savedCompany) : {};
      const techniciansData = companyData.technicians || [];

      setInteractions(interactionsData);
      setOrders(ordersData);
      setTechnicians(techniciansData);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      const filteredInteractions = interactionsData.filter(i =>
        new Date(i.created_at) >= startDate
      );

      const filteredOrders = ordersData.filter(o =>
        new Date(o.submitted_at) >= startDate
      );

      // Count visits from is_new_visit flag
      const totalVisits = filteredInteractions.filter(i => i.is_new_visit === true).length;

      // Products presented = total interactions (each interaction represents offering products)
      const productsPresented = filteredInteractions.length;

      // Count approved products: sum of service_items on signed forms
      const approvedProductsCount = filteredOrders.reduce((count, order) => {
        if (order.completed_signature === true && order.service_items) {
          // Count each service item on the signed form
          return count + order.service_items.length;
        }
        return count;
      }, 0);

      // Approval rate = approved products (service items on signed forms) / products presented
      const approvalRate = productsPresented > 0
        ? Math.round((approvedProductsCount / productsPresented) * 100)
        : 0;

      // Conversion rate = same as approval rate (approved products / products presented)
      const conversionRate = approvalRate;

      const techStats = {};
      filteredInteractions.forEach(interaction => {
        const techId = interaction.technician_id;
        if (!techStats[techId]) {
          techStats[techId] = {
            interactions: 0,
            approved: 0,
            orders: 0,
            technicianName: interaction.technician_name || 'Unknown'
          };
        }
        techStats[techId].interactions++;
        if (interaction.decision === 'approved') {
          techStats[techId].approved++;
        }
      });

      filteredOrders.forEach(order => {
        const techId = order.technician_id;
        if (techStats[techId]) {
          techStats[techId].orders++;
        }
      });

      const topTechnicians = Object.entries(techStats)
        .map(([techId, stats]) => ({
          technician: stats.technicianName,
          ...stats,
          approvalRate: Math.round((stats.approved / stats.interactions) * 100) || 0
        }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

      const dailyStats = [];
      for (let i = parseInt(timeRange) - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayInteractions = filteredInteractions.filter(i => {
          const interactionDate = new Date(i.created_at).toISOString().split('T')[0];
          return interactionDate === dateStr;
        });

        const dayOrders = filteredOrders.filter(o => {
          const orderDate = new Date(o.submitted_at).toISOString().split('T')[0];
          return orderDate === dateStr;
        });

        dailyStats.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          interactions: dayInteractions.length,
          orders: dayOrders.length,
          approved: dayInteractions.filter(i => i.decision === 'approved').length
        });
      }

      setAnalytics({
        totalVisits: totalVisits,
        productsPresented: productsPresented,
        totalOrders: filteredOrders.length,
        approvalRate,
        conversionRate,
        topTechnicians,
        dailyStats,
        serviceBreakdown: []
      });

      console.log('✅ [ANALYTICS] Loaded from localStorage:', {
        interactions: filteredInteractions.length,
        orders: filteredOrders.length,
        approvalRate: `${approvalRate}%`
      });

    } catch (error) {
      console.error("❌ [ANALYTICS] Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visits</p>
                <p className="text-3xl font-bold">{analytics.totalVisits}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products Presented</p>
                <p className="text-3xl font-bold">{analytics.productsPresented}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-3xl font-bold">{analytics.approvalRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold">{analytics.totalOrders}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="interactions" fill="#8884d8" name="Interactions" />
                <Bar dataKey="approved" fill="#82ca9d" name="Approved" />
                <Bar dataKey="orders" fill="#ffc658" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topTechnicians.map((tech, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{tech.technician}</p>
                    <p className="text-sm text-gray-600">
                      {tech.interactions} interactions • {tech.approvalRate}% approval
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{tech.orders}</p>
                    <p className="text-sm text-gray-600">orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}