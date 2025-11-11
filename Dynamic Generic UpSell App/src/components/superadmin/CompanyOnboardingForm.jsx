import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadFile } from "@/api/integrations";
import { INDUSTRIES, getServiceTemplatesForIndustry } from "@/data/industryServiceTemplates";

export default function CompanyOnboardingForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    phone: '',
    address: '',
    admin_email: '',
    admin_name: '',
    order_routing_type: 'email',
    order_routing_destination: '',
    primary_color: '#3B82F6'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Company Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="contact_email">Company Email *</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Company Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="primary_color">Brand Color</Label>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={formData.primary_color}
              onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
              className="w-16 h-10"
            />
            <Input
              value={formData.primary_color}
              onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
              placeholder="#3B82F6"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Company Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Admin User Setup</h3>
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
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Order Routing Setup</h3>
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
      </div>

      <div className="flex justify-end gap-3">
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