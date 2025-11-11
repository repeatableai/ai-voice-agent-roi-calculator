import React, { useState, useEffect } from 'react';
import CompanyAdminPortal from '@/components/portals/CompanyAdminPortal';
import CompanyOnboardingForm from '@/components/superadmin/CompanyOnboardingFormEnhanced';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wrench, Loader2, RotateCcw } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const WelcomeScreen = ({ onStartOnboarding }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <Card className="w-full max-w-2xl text-center">
      <CardHeader>
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-4xl font-bold">FieldSell Pro</CardTitle>
        <p className="text-gray-500 text-lg">Custom Field Sales Platform</p>
        <Badge className="mx-auto mt-4" variant="secondary">
          DEMO MODE - Testing Environment
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-left bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Welcome to the White-Label Demo!</h3>
          <p className="text-gray-700 mb-4">
            This demo lets you experience the complete company onboarding flow:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Enter your company information</li>
            <li>✓ Select your industry (HVAC, Plumbing, Electrical, etc.)</li>
            <li>✓ Upload your logo and choose brand colors</li>
            <li>✓ Auto-populate with 10 industry-specific services</li>
            <li>✓ Customize services or add your own</li>
            <li>✓ See your fully branded portal instantly</li>
          </ul>
          <p className="text-xs text-gray-500 mt-4 italic">
            Note: This is a demonstration - data is saved locally for testing only
          </p>
        </div>

        <Button
          onClick={onStartOnboarding}
          className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          Start Company Onboarding
        </Button>
      </CardContent>
    </Card>
  </div>
);

const OnboardingScreen = ({ onComplete }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (formData) => {
    setIsSaving(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Save company data to localStorage
      const companyId = `company-${Date.now()}`;
      const companyData = {
        id: companyId,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        primary_color: formData.primary_color,
        logo_url: formData.logo_url,
        website_url: formData.website_url,
        industry: formData.industry,
        business_type: formData.business_type,
        company_size: formData.company_size,
        order_routing_type: formData.order_routing_type,
        order_routing_destination: formData.order_routing_destination,
        services: formData.services || [],
        // Add default technician (John Doe)
        technicians: [
          {
            id: 'tech-1',
            employee_id: 'TCH-001',
            full_name: 'John Doe',
            user_email: 'tech@example.com',
            phone: '555-987-6543',
            is_active: true,
            hire_date: new Date().toISOString(),
            company_id: companyId
          }
        ],
        created_at: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem('fieldsell_demo_company', JSON.stringify(companyData));
      localStorage.setItem('fieldsell_demo_onboarded', 'true');

      onComplete(companyData);
    } catch (error) {
      console.error("Onboarding error:", error);
      setError("Failed to complete setup. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to FieldSell Pro!</h1>
            <p className="text-gray-600">Set up your company profile and customize your platform.</p>
          </div>
          <Badge variant="secondary">Demo Mode</Badge>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="p-6">
            {isSaving ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium">Setting up your company...</p>
                <p className="text-gray-600 text-sm">This will just take a moment</p>
              </div>
            ) : (
              <CompanyOnboardingForm
                onSave={handleSave}
                onCancel={() => window.location.reload()}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [currentState, setCurrentState] = useState('loading');
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    loadDemoState();
  }, []);

  const loadDemoState = () => {
    const onboarded = localStorage.getItem('fieldsell_demo_onboarded');
    const savedCompany = localStorage.getItem('fieldsell_demo_company');

    if (onboarded === 'true' && savedCompany) {
      // Company already onboarded, redirect to role selection
      window.location.href = '/select-role';
    } else {
      setCurrentState('welcome');
    }
  };

  const handleStartOnboarding = () => {
    setCurrentState('onboarding');
  };

  const handleOnboardingComplete = (company) => {
    setCompanyData(company);
    // Redirect to role selection page
    window.location.href = '/select-role';
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset and start over? This will clear your demo company data.')) {
      localStorage.removeItem('fieldsell_demo_company');
      localStorage.removeItem('fieldsell_demo_onboarded');
      window.location.reload();
    }
  };

  // Demo Reset Button (shows in all screens except welcome)
  const DemoResetButton = () => {
    if (currentState === 'welcome') return null;

    return (
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Badge variant="secondary" className="shadow-lg px-3 py-1">
          Demo Mode
        </Badge>
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="shadow-lg bg-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Demo
        </Button>
      </div>
    );
  };

  if (currentState === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <>
      <DemoResetButton />
      {currentState === 'welcome' && (
        <WelcomeScreen onStartOnboarding={handleStartOnboarding} />
      )}
      {currentState === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
      {currentState === 'portal' && companyData && (
        <CompanyAdminPortal />
      )}
    </>
  );
}
