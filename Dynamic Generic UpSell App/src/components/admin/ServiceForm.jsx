import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";

export default function ServiceForm({ service, onSave, onCancel }) {
  const [formData, setFormData] = useState(service || {
    name: '',
    price: '',
    when_to_offer: '',
    benefits: [],
    technician_script: '',
    customer_description: '',
    is_active: true,
    order_priority: 0
  });

  const [newBenefit, setNewBenefit] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...(prev.benefits || []), newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Service Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price Display *</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="e.g., $240/yr or $399-699"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="when_to_offer">When to Offer</Label>
        <Input
          id="when_to_offer"
          value={formData.when_to_offer}
          onChange={(e) => setFormData(prev => ({ ...prev, when_to_offer: e.target.value }))}
          placeholder="e.g., During filter inspection"
        />
      </div>

      <div>
        <Label htmlFor="technician_script">Technician Script *</Label>
        <Textarea
          id="technician_script"
          value={formData.technician_script}
          onChange={(e) => setFormData(prev => ({ ...prev, technician_script: e.target.value }))}
          rows={4}
          placeholder="Script for the technician to read..."
          required
        />
      </div>

      <div>
        <Label htmlFor="customer_description">Customer Description</Label>
        <Textarea
          id="customer_description"
          value={formData.customer_description}
          onChange={(e) => setFormData(prev => ({ ...prev, customer_description: e.target.value }))}
          rows={3}
          placeholder="Description shown to customers..."
        />
      </div>

      <div>
        <Label>Service Benefits</Label>
        <div className="space-y-2">
          {formData.benefits?.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input value={benefit} readOnly className="flex-1" />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => removeBenefit(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              placeholder="Add a benefit..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
            />
            <Button type="button" size="sm" onClick={addBenefit}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
        
        <div className="w-32">
          <Label htmlFor="order_priority">Priority</Label>
          <Input
            id="order_priority"
            type="number"
            value={formData.order_priority}
            onChange={(e) => setFormData(prev => ({ ...prev, order_priority: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {service ? 'Update Service' : 'Create Service'}
        </Button>
      </div>
    </form>
  );
}