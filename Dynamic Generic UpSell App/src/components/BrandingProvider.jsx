import React, { createContext, useContext, useEffect } from 'react';

const BrandingContext = createContext(null);

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    // Return defaults if no provider
    return {
      company: null,
      primaryColor: '#3B82F6',
      logoUrl: null,
      companyName: 'FieldSell Pro'
    };
  }
  return context;
};

export const BrandingProvider = ({ company, children }) => {
  const brandingData = {
    company,
    primaryColor: company?.primary_color || '#3B82F6',
    logoUrl: company?.logo_url || null,
    companyName: company?.name || 'FieldSell Pro',
    industry: company?.industry || null,
    businessType: company?.business_type || null
  };

  // Apply CSS variables for theming
  useEffect(() => {
    if (brandingData.primaryColor) {
      document.documentElement.style.setProperty('--brand-primary', brandingData.primaryColor);

      // Calculate lighter and darker shades
      const hex = brandingData.primaryColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      // Lighter shade (for hover states)
      const lighterR = Math.min(255, r + 30);
      const lighterG = Math.min(255, g + 30);
      const lighterB = Math.min(255, b + 30);
      const lighterColor = `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`;

      // Darker shade
      const darkerR = Math.max(0, r - 30);
      const darkerG = Math.max(0, g - 30);
      const darkerB = Math.max(0, b - 30);
      const darkerColor = `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;

      // Very light background tint (5% opacity)
      const veryLightBg = `rgba(${r}, ${g}, ${b}, 0.05)`;

      // Light background tint (10% opacity)
      const lightBg = `rgba(${r}, ${g}, ${b}, 0.10)`;

      // Subtle background tint (15% opacity)
      const subtleBg = `rgba(${r}, ${g}, ${b}, 0.15)`;

      document.documentElement.style.setProperty('--brand-primary-hover', lighterColor);
      document.documentElement.style.setProperty('--brand-primary-dark', darkerColor);
      document.documentElement.style.setProperty('--brand-bg-very-light', veryLightBg);
      document.documentElement.style.setProperty('--brand-bg-light', lightBg);
      document.documentElement.style.setProperty('--brand-bg-subtle', subtleBg);
      document.documentElement.style.setProperty('--brand-rgb', `${r}, ${g}, ${b}`);

      console.log('🎨 [BRANDING] CSS variables applied:', {
        primary: brandingData.primaryColor,
        rgb: `${r}, ${g}, ${b}`
      });
    }
  }, [brandingData.primaryColor]);

  return (
    <BrandingContext.Provider value={brandingData}>
      {children}
    </BrandingContext.Provider>
  );
};
