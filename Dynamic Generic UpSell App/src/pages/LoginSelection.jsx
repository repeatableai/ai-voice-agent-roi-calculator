import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Wrench, Users, ArrowRight } from 'lucide-react';

export default function LoginSelection() {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    // Load company data for branding
    const savedCompany = localStorage.getItem('fieldsell_demo_company');
    if (savedCompany) {
      const company = JSON.parse(savedCompany);
      setCompanyData(company);
    } else {
      // No company onboarded, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const handleRoleSelection = (role) => {
    console.log(`👤 [ROLE SELECTION] User selected: ${role}`);
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'technician') {
      navigate('/technician/login');
    }
  };

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: companyData.primary_color
          ? `linear-gradient(135deg, ${companyData.primary_color}10 0%, ${companyData.primary_color}05 100%)`
          : 'linear-gradient(135deg, #3B82F610 0%, #3B82F605 100%)'
      }}
    >
      <div className="w-full max-w-4xl">
        {/* Company Header */}
        <div className="text-center mb-8">
          {companyData.logo_url ? (
            <img
              src={companyData.logo_url}
              alt={`${companyData.name} Logo`}
              className="h-20 w-20 object-contain mx-auto mb-4"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                backgroundColor: companyData.primary_color || '#3B82F6'
              }}
            >
              <Building2 className="w-10 h-10 text-white" />
            </div>
          )}
          <h1 className="text-4xl font-bold mb-2">{companyData.name}</h1>
          <p className="text-gray-600 text-lg">Select Your Role</p>
          <Badge className="mt-3" variant="secondary">
            Demo Mode
          </Badge>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Admin Card */}
          <Card
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-500"
            onClick={() => handleRoleSelection('admin')}
          >
            <CardHeader className="text-center pb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: companyData.primary_color
                    ? `${companyData.primary_color}15`
                    : '#3B82F615'
                }}
              >
                <Building2
                  className="w-10 h-10"
                  style={{
                    color: companyData.primary_color || '#3B82F6'
                  }}
                />
              </div>
              <CardTitle className="text-2xl">Company Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center mb-4">
                Access the full administrative portal to manage your company
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Manage services and pricing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>View analytics and reports</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Configure company settings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Manage technician accounts</span>
                </li>
              </ul>
              <Button
                className="w-full mt-4"
                size="lg"
                style={{
                  backgroundColor: companyData.primary_color || '#3B82F6'
                }}
              >
                Go to Admin Portal
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Technician Card */}
          <Card
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-green-500"
            onClick={() => handleRoleSelection('technician')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Technician</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center mb-4">
                Access the field technician app to serve customers
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>View available services to offer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Access SPIN selling scripts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Submit customer orders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Track daily performance stats</span>
                </li>
              </ul>
              <Button
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Technician Login
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Return Home Button */}
        <div className="text-center mt-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-white"
          >
            ← Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
