import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INDUSTRIES, getServiceTemplatesForIndustry } from "@/data/industryServiceTemplates";
import { extractBrandingFromWebsite } from "@/utils/brandingExtractor";
import { generateCustomServices } from "@/utils/aiServiceGenerator";
import { Loader2, CheckCircle, Sparkles, Wand2 } from "lucide-react";

export default function CompanyOnboardingForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    admin_email: '',
    admin_name: '',
    order_routing_type: 'email',
    order_routing_destination: '',
    primary_color: '#3B82F6',
    // New white-label fields
    industry: '',
    custom_industry: '', // For when "Other" is selected
    business_type: 'both',
    company_size: '',
    logo_url: '',
    website_url: '',
    selected_services: []
  });

  const [isFetchingBranding, setIsFetchingBranding] = useState(false);
  const [brandingFetched, setBrandingFetched] = useState(false);
  const [isGeneratingServices, setIsGeneratingServices] = useState(false);
  const [servicesGenerated, setServicesGenerated] = useState(false);
  const [serviceTemplates, setServiceTemplates] = useState([]);
  const [customServices, setCustomServices] = useState([]);

  // Generate AI-powered custom services when industry is selected
  useEffect(() => {
    const generateServices = async () => {
      // Only generate if we have the industry selected
      if (!formData.industry) {
        console.log('⏸️ [ONBOARDING] No industry selected yet');
        return;
      }

      console.log('🚀 [ONBOARDING] Triggering service generation', {
        hasIndustry: !!formData.industry,
        hasWebsite: !!formData.website_url,
        hasName: !!formData.name,
        hasBusinessType: !!formData.business_type,
        hasCompanySize: !!formData.company_size
      });

      // If we have full data, generate custom AI services
      if (formData.industry && formData.website_url && formData.name) {
        setIsGeneratingServices(true);
        setServicesGenerated(false);

        try {
          const customizedServices = await generateCustomServices({
            companyName: formData.name,
            websiteUrl: formData.website_url,
            industry: formData.industry,
            businessType: formData.business_type || 'both',
            companySize: formData.company_size || '1-5'
          });

          console.log(`✨ [ONBOARDING] Setting ${customizedServices.length} services to state`);
          setServiceTemplates(customizedServices);
          setServicesGenerated(true);

          // Auto-select all services by default
          setFormData(prev => ({
            ...prev,
            selected_services: customizedServices.map((_, idx) => idx)
          }));
        } catch (error) {
          console.error('❌ [ONBOARDING] Error generating services:', error);
          // Fallback to basic templates
          const templates = getServiceTemplatesForIndustry(formData.industry);
          console.log(`⚠️ [ONBOARDING] Using ${templates.length} fallback templates`);
          setServiceTemplates(templates);
          setFormData(prev => ({
            ...prev,
            selected_services: templates.map((_, idx) => idx)
          }));
        }

        setIsGeneratingServices(false);
      } else {
        // If no website yet, just load basic templates
        console.log(`📋 [ONBOARDING] Loading basic templates for ${formData.industry}`);
        const templates = getServiceTemplatesForIndustry(formData.industry);
        console.log(`📋 [ONBOARDING] Loaded ${templates.length} basic templates`);
        setServiceTemplates(templates);
        setFormData(prev => ({
          ...prev,
          selected_services: templates.map((_, idx) => idx)
        }));
      }
    };

    generateServices();
  }, [formData.industry]);

  // Auto-fetch branding when website URL changes
  const handleWebsiteUrlChange = async (url) => {
    setFormData(prev => ({ ...prev, website_url: url }));
    setBrandingFetched(false);

    // Only fetch if URL looks valid
    if (url && (url.includes('.') || url.startsWith('http'))) {
      setIsFetchingBranding(true);
      try {
        const branding = await extractBrandingFromWebsite(url);
        setFormData(prev => ({
          ...prev,
          logo_url: branding.logo_url,
          primary_color: branding.primary_color
        }));
        setBrandingFetched(true);
      } catch (error) {
        console.error("Error fetching branding:", error);
      }
      setIsFetchingBranding(false);
    }
  };

  // Manual trigger for AI service generation
  const handleGenerateAIServices = async () => {
    if (!formData.name || !formData.website_url || !formData.industry) {
      alert('Please fill in Company Name, Website URL, and Industry first');
      return;
    }

    // If "Other" is selected, require custom industry input
    if (formData.industry === 'other' && !formData.custom_industry) {
      alert('Please specify your industry in the text field');
      return;
    }

    setIsGeneratingServices(true);
    setServicesGenerated(false);

    try {
      const customizedServices = await generateCustomServices({
        companyName: formData.name,
        websiteUrl: formData.website_url,
        industry: formData.industry,
        customIndustry: formData.custom_industry, // Pass custom industry for "Other"
        businessType: formData.business_type || 'both',
        companySize: formData.company_size || '1-5'
      });

      console.log(`✨ [MANUAL GEN] Setting ${customizedServices.length} services to state`);
      setServiceTemplates(customizedServices);
      setServicesGenerated(true);

      // Auto-select all services by default
      setFormData(prev => ({
        ...prev,
        selected_services: customizedServices.map((_, idx) => idx)
      }));
    } catch (error) {
      console.error('❌ [MANUAL GEN] Error:', error);
      alert('Error generating services. Using default templates.');
      const templates = getServiceTemplatesForIndustry(formData.industry);
      setServiceTemplates(templates);
      setFormData(prev => ({
        ...prev,
        selected_services: templates.map((_, idx) => idx)
      }));
    }

    setIsGeneratingServices(false);
  };

  const handleServiceToggle = (index) => {
    setFormData(prev => ({
      ...prev,
      selected_services: prev.selected_services.includes(index)
        ? prev.selected_services.filter(i => i !== index)
        : [...prev.selected_services, index]
    }));
  };

  const addCustomService = () => {
    setCustomServices([...customServices, { name: '', price: '', description: '' }]);
  };

  const updateCustomService = (index, field, value) => {
    const updated = [...customServices];
    updated[index][field] = value;
    setCustomServices(updated);
  };

  const removeCustomService = (index) => {
    setCustomServices(customServices.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare selected services data
    const selectedServiceData = formData.selected_services.map(idx => serviceTemplates[idx]);
    const allServices = [...selectedServiceData, ...customServices.filter(s => s.name)];

    onSave({
      ...formData,
      services: allServices
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Company Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="website_url">Website URL *</Label>
              <div className="relative">
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => handleWebsiteUrlChange(e.target.value)}
                  placeholder="https://yourcompany.com"
                  required
                  className={brandingFetched ? "border-green-500" : ""}
                />
                {isFetchingBranding && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  </div>
                )}
                {brandingFetched && !isFetchingBranding && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                )}
              </div>
              {brandingFetched && (
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Branding auto-detected from website
                </p>
              )}
              {isFetchingBranding && (
                <p className="text-sm text-gray-500 mt-1">Fetching logo and colors from website...</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address">Company Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="123 Main St, City, State 12345"
            />
          </div>
        </CardContent>
      </Card>

      {/* Industry & Business Details */}
      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(ind => (
                    <SelectItem key={ind.value} value={ind.value}>
                      {ind.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="company_size">Company Size *</Label>
              <Select
                value={formData.company_size}
                onValueChange={(value) => setFormData(prev => ({ ...prev, company_size: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 employees</SelectItem>
                  <SelectItem value="6-20">6-20 employees</SelectItem>
                  <SelectItem value="21-50">21-50 employees</SelectItem>
                  <SelectItem value="51-100">51-100 employees</SelectItem>
                  <SelectItem value="100+">100+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Industry Input - Shows when "Other" is selected */}
          {formData.industry === 'other' && (
            <div>
              <Label htmlFor="custom_industry">Please Specify Your Industry *</Label>
              <Input
                id="custom_industry"
                value={formData.custom_industry}
                onChange={(e) => setFormData(prev => ({ ...prev, custom_industry: e.target.value }))}
                placeholder="e.g., Automotive Repair, Restaurant, Gym, etc."
                required
                className="mt-2"
              />
              <p className="text-sm text-gray-600 mt-2">
                💡 This helps our AI generate relevant upsell services specifically for your industry
              </p>
            </div>
          )}

          <div>
            <Label>Business Type *</Label>
            <RadioGroup
              value={formData.business_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, business_type: value }))}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="residential" id="residential" />
                <Label htmlFor="residential" className="cursor-pointer">Residential</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="commercial" id="commercial" />
                <Label htmlFor="commercial" className="cursor-pointer">Commercial</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="cursor-pointer">Both</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Branding Preview - Auto-detected from website */}
      {formData.website_url && (formData.logo_url || formData.primary_color) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Auto-Detected Branding
            </CardTitle>
            <p className="text-sm text-gray-600">We automatically extracted your logo and colors from your website</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.logo_url && (
              <div>
                <Label>Company Logo</Label>
                <div className="mt-2 p-4 border rounded-lg bg-gray-50 flex items-center gap-4">
                  <img
                    src={formData.logo_url}
                    alt="Company Logo"
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Logo detected</p>
                    <p className="text-xs text-gray-500 break-all">{formData.logo_url.substring(0, 60)}...</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="primary_color">Primary Brand Color (You can customize this)</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  id="primary_color"
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
                <div
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: formData.primary_color }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services Selection */}
      {formData.industry && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {isGeneratingServices ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    Generating Custom Services...
                  </>
                ) : servicesGenerated ? (
                  <>
                    <Wand2 className="h-5 w-5 text-purple-600" />
                    AI-Generated Services for {formData.name}
                  </>
                ) : (
                  <>Select Add-On Services (Top {serviceTemplates.length} for {INDUSTRIES.find(i => i.value === formData.industry)?.label})</>
                )}
              </CardTitle>
              {!isGeneratingServices && formData.name && formData.website_url && (
                <Button
                  type="button"
                  onClick={handleGenerateAIServices}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  {servicesGenerated ? 'Regenerate AI Services' : 'Generate AI Services'}
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {isGeneratingServices
                ? "Analyzing your website and industry to create the most relevant upsell services..."
                : servicesGenerated
                ? "These services are customized based on your company's website, industry, and business type. You can edit or modify them later."
                : "Choose which services your technicians can offer. You can edit these later."
              }
            </p>
            {servicesGenerated && (
              <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Services personalized with company name, customized pricing, and prioritized by relevance to your business
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {isGeneratingServices ? (
              <div className="py-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Generating your custom services...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            ) : (
              <>
                {serviceTemplates.map((service, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 border rounded hover:bg-gray-50">
                    <Checkbox
                      id={`service-${idx}`}
                      checked={formData.selected_services.includes(idx)}
                      onCheckedChange={() => handleServiceToggle(idx)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`service-${idx}`} className="cursor-pointer font-medium">
                        {service.name} - {service.price}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{service.customer_description}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Custom Services</h4>
                    <Button type="button" variant="outline" size="sm" onClick={addCustomService}>
                      + Add Custom Service
                    </Button>
                  </div>
                  {customServices.map((service, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 mb-2">
                      <Input
                        placeholder="Service Name"
                        value={service.name}
                        onChange={(e) => updateCustomService(idx, 'name', e.target.value)}
                        className="col-span-5"
                      />
                      <Input
                        placeholder="Price"
                        value={service.price}
                        onChange={(e) => updateCustomService(idx, 'price', e.target.value)}
                        className="col-span-3"
                      />
                      <Input
                        placeholder="Description"
                        value={service.description}
                        onChange={(e) => updateCustomService(idx, 'description', e.target.value)}
                        className="col-span-3"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomService(idx)}
                        className="col-span-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Admin User Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Admin User Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="admin_name">Admin Full Name *</Label>
              <Input
                id="admin_name"
                value={formData.admin_name}
                onChange={(e) => setFormData(prev => ({ ...prev, admin_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="admin_email">Admin Email *</Label>
              <Input
                id="admin_email"
                type="email"
                value={formData.admin_email}
                onChange={(e) => setFormData(prev => ({ ...prev, admin_email: e.target.value }))}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Routing */}
      <Card>
        <CardHeader>
          <CardTitle>Order Routing Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order_routing_type">Order Destination Type</Label>
              <Select
                value={formData.order_routing_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, order_routing_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="order_routing_destination">
                {formData.order_routing_type === 'email' ? 'Email Address' : 'Webhook URL'}
              </Label>
              <Input
                id="order_routing_destination"
                type={formData.order_routing_type === 'email' ? 'email' : 'url'}
                value={formData.order_routing_destination}
                onChange={(e) => setFormData(prev => ({ ...prev, order_routing_destination: e.target.value }))}
                placeholder={formData.order_routing_type === 'email' ? 'orders@company.com' : 'https://api.company.com/orders'}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3 sticky bottom-0 bg-white pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Onboard Company
        </Button>
      </div>
    </form>
  );
}
