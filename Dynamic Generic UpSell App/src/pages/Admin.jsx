import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyAdminPortal from '@/components/portals/CompanyAdminPortal';
import { BrandingProvider } from '@/components/BrandingProvider';
import { validateSession } from '@/utils/sessionManager';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate session and permissions - admins can access this page
    if (!validateSession('admin', navigate)) {
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <BrandingProvider>
      <CompanyAdminPortal />
    </BrandingProvider>
  );
}
