import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wrench, AlertCircle, Loader2 } from 'lucide-react';
import { useBranding } from '@/components/BrandingProvider';
import { createSession, isAuthenticated, hasPermission } from '@/utils/sessionManager';

export default function TechnicianLogin() {
  const navigate = useNavigate();
  const { branding } = useBranding();
  const [employeeId, setEmployeeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    // Load company data to show branding
    const savedCompany = localStorage.getItem('fieldsell_demo_company');
    if (savedCompany) {
      const company = JSON.parse(savedCompany);
      setCompanyData(company);
    } else {
      setError('No company found. Please complete company onboarding first.');
    }
  }, []);

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

      // Create session using session manager
      const user = {
        id: foundTech.employee_id,
        user_id: foundTech.employee_id,
        employee_id: foundTech.employee_id,
        email: foundTech.user_email,
        full_name: foundTech.full_name,
        role: 'technician'
      };

      createSession(user, companyData.id);
      console.log(`✅ [LOGIN] Logged in as ${foundTech.full_name} (${foundTech.employee_id})`);

      navigate('/technician');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

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

      // Create session for demo technician
      const user = {
        id: johnDoe.employee_id,
        user_id: johnDoe.employee_id,
        employee_id: johnDoe.employee_id,
        email: johnDoe.user_email,
        full_name: johnDoe.full_name,
        role: 'technician'
      };

      createSession(user, companyData.id);
      console.log('🚀 [LOGIN] Auto-logged in as John Doe (TCH-001)');
      navigate('/technician');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (!companyData && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: companyData?.primary_color
          ? `linear-gradient(135deg, ${companyData.primary_color}15 0%, ${companyData.primary_color}05 100%)`
          : 'linear-gradient(135deg, #3B82F615 0%, #3B82F605 100%)'
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {companyData?.logo_url ? (
              <img
                src={companyData.logo_url}
                alt={`${companyData.name} Logo`}
                className="h-16 w-16 object-contain"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: companyData?.primary_color || '#3B82F6'
                }}
              >
                <Wrench className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {companyData?.name || 'FieldSell Pro'}
          </CardTitle>
          <p className="text-gray-500">Technician Portal</p>
          <Badge className="mx-auto mt-2" variant="secondary">
            Demo Mode
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                type="text"
                placeholder="Enter your employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={isLoading}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: TCH-001, EMP-123, or your assigned ID
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              style={{
                backgroundColor: companyData?.primary_color || '#3B82F6'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <Button
            onClick={handleDemoLogin}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            Continue as Demo Technician
          </Button>

          <div className="text-center">
            <Button
              onClick={() => navigate('/admin')}
              variant="link"
              className="text-sm"
            >
              Admin Portal →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
