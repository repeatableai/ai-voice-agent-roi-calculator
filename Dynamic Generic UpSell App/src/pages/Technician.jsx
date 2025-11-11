import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TechnicianApp from '@/components/portals/TechnicianApp';
import { BrandingProvider } from '@/components/BrandingProvider';
import { validateSession } from '@/utils/sessionManager';
import { Loader2 } from 'lucide-react';

export default function TechnicianPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate session and permissions - technicians can access this page
    if (!validateSession('technician', navigate)) {
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Technician Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <BrandingProvider>
      <TechnicianApp />
    </BrandingProvider>
  );
}
