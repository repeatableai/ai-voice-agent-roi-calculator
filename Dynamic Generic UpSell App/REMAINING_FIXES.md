# Remaining Fixes to Implement

## Status: 2/8 Complete

### ✅ Completed
1. Save initial technician (John Doe/TCH-001) during onboarding in `/src/pages/Home.jsx`
2. Load technicians from localStorage in `CompanyAdminPortal.jsx`

### ⏳ Remaining Fixes

## Fix 3: Update Technician CRUD Operations

### File: `/src/components/portals/CompanyAdminPortal.jsx`

Replace `handleTechnicianSave` (lines 192-206):
```javascript
const handleTechnicianSave = async (technicianData) => {
  try {
    const savedCompany = localStorage.getItem('fieldsell_demo_company');
    const companyData = JSON.parse(savedCompany);

    if (editingTechnician) {
      // Update existing
      companyData.technicians = companyData.technicians.map(t =>
        t.id === editingTechnician.id ? { ...t, ...technicianData } : t
      );
      console.log('✏️ [ADMIN] Updated technician:', technicianData.full_name);
    } else {
      // Add new
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
```

Replace `handleTechnicianToggle` (lines 208-215):
```javascript
const handleTechnicianToggle = async (technician) => {
  try {
    const savedCompany = localStorage.getItem('fieldsell_demo_company');
    const companyData = JSON.parse(savedCompany);

    companyData.technicians = companyData.technicians.map(t =>
      t.id === technician.id ? { ...t, is_active: !t.is_active } : t
    );

    localStorage.setItem('fieldsell_demo_company', JSON.stringify(companyData));
    console.log(`🔄 [ADMIN] Toggled technician ${technician.full_name}: ${!technician.is_active ? 'active' : 'inactive'}`);
    loadData();
  } catch (error) {
    console.error("Error toggling technician:", error);
    alert('Error updating technician status. Please try again.');
  }
};
```

## Fix 4: Fix "Reset & Start Over" Button

### File: `/src/components/portals/CompanyAdminPortal.jsx` (lines 256-267)

Replace:
```javascript
<Button
  onClick={() => {
    if (confirm('Are you sure you want to reset? This will clear all demo data.')) {
      localStorage.clear();
      window.location.href = '/'; // Direct to home, not reload
    }
  }}
  variant="ghost"
  size="sm"
>
  <LogOut className="w-4 h-4 mr-2" />
  Reset & Start Over
</Button>
```

## Fix 5: Change "Technician Portal" to Auto-Login

### File: `/src/components/portals/CompanyAdminPortal.jsx` (line 248)

Replace:
```javascript
<Button
  onClick={() => {
    // Auto-login as John Doe and go directly to dashboard
    const demoTech = {
      id: 'tech-1',
      employee_id: 'TCH-001',
      full_name: 'John Doe',
      company_id: company.id,
      user_email: 'tech@example.com',
      phone: '555-987-6543',
      is_active: true,
      logged_in_at: new Date().toISOString()
    };
    localStorage.setItem('fieldsell_demo_technician', JSON.stringify(demoTech));
    console.log('🚀 [ADMIN] Auto-logging in as John Doe');
    window.location.href = '/technician'; // Direct to dashboard, not login
  }}
  variant="outline"
  size="sm"
>
  <Wrench className="w-4 h-4 mr-2" />
  View as Technician →
</Button>
```

## Fix 6: Update TechnicianLogin Demo Button

### File: `/src/pages/TechnicianLogin.jsx` (lines 68-82)

Replace `handleDemoLogin`:
```javascript
const handleDemoLogin = () => {
  setIsLoading(true);
  setError(null);

  try {
    if (!companyData || !companyData.technicians) {
      throw new Error('No technicians available. Please contact admin.');
    }

    // Find John Doe in the company's technician list
    const johnDoe = companyData.technicians.find(t => t.employee_id === 'TCH-001');

    if (!johnDoe) {
      throw new Error('Default technician not found. Please use employee ID.');
    }

    if (!johnDoe.is_active) {
      throw new Error('This technician account is inactive.');
    }

    // Auto-login as John Doe
    const technicianData = {
      ...johnDoe,
      logged_in_at: new Date().toISOString()
    };

    localStorage.setItem('fieldsell_demo_technician', JSON.stringify(technicianData));
    console.log('🚀 [LOGIN] Auto-logged in as John Doe (TCH-001)');
    navigate('/technician');
  } catch (err) {
    setError(err.message);
    setIsLoading(false);
  }
};
```

## Fix 7: Add Technician Validation

### File: `/src/pages/TechnicianLogin.jsx` (lines 32-66)

Replace `handleLogin`:
```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!companyData) {
      throw new Error('No company data available');
    }

    if (!employeeId.trim()) {
      throw new Error('Please enter your Employee ID');
    }

    // Find technician in company's technician list
    const technicians = companyData.technicians || [];
    const foundTech = technicians.find(t =>
      t.employee_id.toLowerCase() === employeeId.toLowerCase().trim()
    );

    if (!foundTech) {
      throw new Error(`Employee ID "${employeeId}" not found. Please check with your administrator or use TCH-001 for demo.`);
    }

    if (!foundTech.is_active) {
      throw new Error('This technician account is inactive. Please contact your administrator.');
    }

    // Save the logged-in technician
    const technicianData = {
      ...foundTech,
      logged_in_at: new Date().toISOString()
    };

    localStorage.setItem('fieldsell_demo_technician', JSON.stringify(technicianData));
    console.log(`✅ [LOGIN] Logged in as ${foundTech.full_name} (${foundTech.employee_id})`);

    // Redirect to technician dashboard
    navigate('/technician');
  } catch (err) {
    setError(err.message);
    setIsLoading(false);
  }
};
```

## Implementation Priority

1. ⚠️ CRITICAL: Fix 3 (Technician CRUD) - Enables add/edit/toggle
2. ⚠️ CRITICAL: Fix 5 (Auto-login) - Fixes "Technician Portal" button
3. ⚠️ CRITICAL: Fix 7 (Validation) - Validates against company database
4. 🔹 MEDIUM: Fix 4 (Reset button) - Fixes reset functionality
5. 🔹 MEDIUM: Fix 6 (Demo login) - Uses John Doe instead of generic

## Testing Checklist After Implementation

- [ ] Onboarding creates John Doe (TCH-001) in company data
- [ ] Admin portal loads John Doe from localStorage
- [ ] Can add new technician via admin portal
- [ ] Can edit existing technician
- [ ] Can activate/deactivate technicians
- [ ] "View as Technician" auto-logs in as John Doe → goes to dashboard
- [ ] Technician login validates employee_id against company database
- [ ] Inactive technicians cannot log in
- [ ] "Demo Technician" button logs in as John Doe
- [ ] "Reset & Start Over" clears data and returns to onboarding
- [ ] All 10 AI services available to technicians
