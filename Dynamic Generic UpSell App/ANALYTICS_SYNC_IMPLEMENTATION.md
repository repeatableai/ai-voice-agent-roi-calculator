# Analytics Synchronization - Implementation Guide

## Status: Ready to Implement
All 22 zombie dev servers killed. Ready for clean implementation.

## File 1: `/src/components/admin/Analytics.jsx`

### Change: Replace Base44 API with localStorage (Lines 30-126)

**REPLACE THIS ENTIRE FUNCTION:**

```javascript
const loadAnalytics = async () => {
  try {
    // Load from localStorage instead of Base44 API
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

    console.log('📊 [ANALYTICS] Loaded data:', {
      interactions: interactionsData.length,
      orders: ordersData.length,
      technicians: techniciansData.length
    });

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    // Filter by date range
    const filteredInteractions = interactionsData.filter(i =>
      new Date(i.created_at) >= startDate
    );

    const filteredOrders = ordersData.filter(o =>
      new Date(o.submitted_at) >= startDate
    );

    // Calculate approval rate
    const approved = filteredInteractions.filter(i => i.decision === 'approved').length;
    const approvalRate = filteredInteractions.length > 0
      ? Math.round((approved / filteredInteractions.length) * 100)
      : 0;

    // Top technicians
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

    // Daily stats for chart
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
      totalInteractions: filteredInteractions.length,
      totalOrders: filteredOrders.length,
      approvalRate,
      topTechnicians,
      dailyStats,
      serviceBreakdown: []
    });

    console.log('✅ [ANALYTICS] Analytics updated:', {
      totalInteractions: filteredInteractions.length,
      totalOrders: filteredOrders.length,
      approvalRate: `${approvalRate}%`,
      topTechs: topTechnicians.length
    });

  } catch (error) {
    console.error("❌ [ANALYTICS] Error loading analytics:", error);
  }
};
```

## File 2: `/src/components/portals/CompanyAdminPortal.jsx`

### Step 1: Add state for recent activity (after line 80)

```javascript
const [recentActivity, setRecentActivity] = useState([]);
```

### Step 2: Add formatTimeAgo helper function (after loadData function)

```javascript
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};
```

### Step 3: Load recent activity in loadData() (add before final console.log)

```javascript
// Load recent activity
const savedInteractions = localStorage.getItem('fieldsell_demo_interactions');
const allInteractions = savedInteractions ? JSON.parse(savedInteractions) : [];
const recentActivityData = allInteractions
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  .slice(0, 20);
setRecentActivity(recentActivityData);
console.log('📋 [DASHBOARD] Loaded recent activity:', recentActivityData.length);
```

### Step 4: Add Recent Activity Card (AFTER line 434 - after Quick Actions card)

```javascript
{/* Recent Activity Feed */}
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
```

## File 3: `/src/components/portals/TechnicianApp.jsx`

### Step 1: Add state variables (after line 28)

```javascript
const [myStats, setMyStats] = useState({
  approvalRate: 0,
  totalOrders: 0,
  weekOrders: 0,
  avgOrderValue: 0
});
const [myRecentActivity, setMyRecentActivity] = useState([]);
```

### Step 2: Add import for icons (line 14)

Change:
```javascript
import { AlertCircle, CheckCircle, XCircle, LogOut, Wrench, DollarSign, Clock, FileText, Phone, Mail, MapPin, Building2 } from "lucide-react";
```

Make sure CheckCircle and XCircle are included.

### Step 3: Add formatTimeAgo helper (after handleLogout)

```javascript
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};
```

### Step 4: Load performance stats in loadUserData() (add before final } catch)

```javascript
// Load my interactions and orders for performance tracking
const savedInteractions = localStorage.getItem('fieldsell_demo_interactions');
const allInteractions = savedInteractions ? JSON.parse(savedInteractions) : [];
const myInteractions = allInteractions.filter(i => i.technician_id === techData.employee_id);

const savedOrders = localStorage.getItem('fieldsell_demo_orders');
const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
const myOrders = allOrders.filter(o => o.technician_id === techData.employee_id);

// Calculate stats
const approvedInteractions = myInteractions.filter(i => i.decision === 'approved');
const approvalRate = myInteractions.length > 0
  ? Math.round((approvedInteractions.length / myInteractions.length) * 100)
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
```

### Step 5: Add Performance & Activity Cards (AFTER line 528 - after Today's Stats)

```javascript
{/* My Performance */}
<Card className="mb-6">
  <CardHeader>
    <CardTitle className="text-lg">My Performance</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <p className="text-sm text-gray-600">Approval Rate</p>
        <p className="text-2xl font-bold text-green-600">
          {myStats.approvalRate}%
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">Total Orders</p>
        <p className="text-2xl font-bold text-purple-600">
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
```

## Testing Checklist

After implementing all changes:

1. ✅ Kill all dev servers and start ONE clean server
2. ✅ Reset demo data (localStorage.clear() in console)
3. ✅ Complete onboarding
4. ✅ Go to Admin > Analytics tab - should show 0 data initially
5. ✅ Go to Admin > Dashboard - Recent Activity should say "No activity yet"
6. ✅ Switch to Technician view
7. ✅ Check "My Performance" card - all zeros initially
8. ✅ Present a service and approve it
9. ✅ Submit an order
10. ✅ Check "My Recent Activity" - should show the interaction
11. ✅ Go back to Admin Dashboard - Recent Activity should show it
12. ✅ Go to Admin Analytics - charts should update with real data
13. ✅ Present more services (approve/deny mix)
14. ✅ Verify all stats sync across both dashboards

## Implementation Order

1. Analytics.jsx (20 min) - Foundation for all analytics
2. CompanyAdminPortal.jsx (25 min) - Recent activity feed
3. TechnicianApp.jsx (30 min) - Performance & activity
4. Test complete flow (15 min)

Total: ~90 minutes
