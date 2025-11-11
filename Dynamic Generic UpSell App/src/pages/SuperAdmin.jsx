import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminPortal from '@/components/portals/SuperAdminPortal';
import { Loader2 } from 'lucide-react';
import { validateSession, getUser } from '@/utils/sessionManager';

export default function SuperAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Validate session and permissions using session manager
    if (!validateSession('super_admin', navigate)) {
      setLoading(false);
      return;
    }

    // Get user from session
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      console.log('✅ [SUPERADMIN] Session validated:', currentUser.full_name);
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Super Admin Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return <SuperAdminPortal />;
}
