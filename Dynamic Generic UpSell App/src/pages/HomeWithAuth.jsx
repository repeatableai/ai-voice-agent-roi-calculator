import React, { useState, useEffect } from 'react';
import { User, Company, Service, Technician } from '@/api/entities';

// Import the portal components
import TechnicianApp from '@/components/portals/TechnicianApp';
import CompanyAdminPortal from '@/components/portals/CompanyAdminPortal';
import SuperAdminPortal from '@/components/portals/SuperAdminPortal';
import CompanyOnboardingForm from '@/components/superadmin/CompanyOnboardingFormEnhanced';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wrench, Loader2 } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading your workspace...</p>
    </div>
  </div>
);

const LoginScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold">FieldSell Pro</CardTitle>
        <p className="text-gray-500">Custom Field Sales Platform</p>
      </CardHeader>
      <CardContent>
        <p className="mb-6">Welcome! Sign in to access your company portal.</p>
        <Button
          onClick={() => User.login()}
          className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
        >
          Login with Google
        </Button>
      </CardContent>
    </Card>
  </div>
);

const OnboardingScreen = ({ user, onComplete }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleOnboardingSave = async (formData) => {
    setIsSaving(true);
    setError(null);

    try {
      // Create the company record
      const companyData = {
        name: formData.name,
        contact_email: formData.contact_email,
        phone: formData.phone,
        address: formData.address,
        primary_color: formData.primary_color,
        logo_url: formData.logo_url,
        website_url: formData.website_url,
        industry: formData.industry,
        business_type: formData.business_type,
        company_size: formData.company_size,
        order_routing_type: formData.order_routing_type,
        order_routing_destination: formData.order_routing_destination
      };

      const newCompany = await Company.create(companyData);

      // Create services
      if (formData.services && formData.services.length > 0) {
        const servicesToCreate = formData.services.map((service, idx) => ({
          ...service,
          company_id: newCompany.id,
          order_priority: service.order_priority || idx + 1
        }));
        await Service.bulkCreate(servicesToCreate);
      }

      // Notify completion
      onComplete(newCompany);
    } catch (error) {
      console.error("Error during onboarding:", error);
      setError("Failed to complete onboarding. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to FieldSell Pro!</h1>
          <p className="text-gray-600">Let's set up your company profile and customize your platform.</p>
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
                onSave={handleOnboardingSave}
                onCancel={() => {
                  if (confirm("Are you sure you want to cancel onboarding? You'll need to complete this later.")) {
                    User.logout();
                    window.location.reload();
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    determineUserState();
  }, []);

  const determineUserState = async () => {
    setIsLoading(true);

    try {
      // Check if user is authenticated
      const user = await User.me();

      if (!user) {
        setUserRole('unauthenticated');
        setIsLoading(false);
        return;
      }

      setCurrentUser(user);

      // Check for super admin
      if (user.email === 'admin@base44.com' || user.role === 'super_admin') {
        setUserRole('super_admin');
        setIsLoading(false);
        return;
      }

      // Check if user is a technician
      const techRecords = await Technician.filter({ user_email: user.email });
      if (techRecords.length > 0) {
        setUserRole('technician');
        setIsLoading(false);
        return;
      }

      // Check if user has a company
      const companyRecords = await Company.filter({ contact_email: user.email });

      if (companyRecords.length === 0) {
        // No company found - needs onboarding
        setNeedsOnboarding(true);
        setUserRole('needs_onboarding');
        setIsLoading(false);
        return;
      }

      // User has a company - they're a company admin
      setUserRole('company_admin');
      setIsLoading(false);

    } catch (error) {
      console.error("Auth error:", error);
      setUserRole('unauthenticated');
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = (newCompany) => {
    // Refresh to load the new company data
    window.location.reload();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  switch (userRole) {
    case 'super_admin':
      return <SuperAdminPortal />;

    case 'company_admin':
      return <CompanyAdminPortal />;

    case 'technician':
      return <TechnicianApp />;

    case 'needs_onboarding':
      return <OnboardingScreen user={currentUser} onComplete={handleOnboardingComplete} />;

    case 'unauthenticated':
    default:
      return <LoginScreen />;
  }
}
