import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Crown, Loader2, Shield } from 'lucide-react';
import { createSession, isAuthenticated, hasPermission } from '@/utils/sessionManager';

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('super@fieldsell.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated() && hasPermission('super_admin')) {
      navigate('/superadmin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Demo credentials
    if (email === 'super@fieldsell.com' && password === 'admin123') {
      const user = {
        id: 'superadmin_001',
        full_name: 'Platform Administrator',
        email: email,
        role: 'super_admin'
      };

      // Create session using new session manager (company_id = null for super admin)
      createSession(user, null);

      console.log('🔐 [SUPERADMIN] Login successful');
      navigate('/superadmin');
    } else {
      setError('Invalid credentials. Use super@fieldsell.com / admin123 for demo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Super Admin Portal
            </CardTitle>
            <p className="text-gray-500 mt-2">Platform Management System</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-purple-50 py-2 px-4 rounded-full">
            <Shield className="w-3 h-3" />
            <span>Restricted Access</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="super@fieldsell.com"
                required
                className="h-12"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-blue-900 mb-2">Demo Credentials:</p>
              <p className="text-blue-700">
                <strong>Email:</strong> super@fieldsell.com
              </p>
              <p className="text-blue-700">
                <strong>Password:</strong> admin123
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
