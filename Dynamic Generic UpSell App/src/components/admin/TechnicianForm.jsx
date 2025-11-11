import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function TechnicianForm({ technician, onSave, onCancel }) {
  const [formData, setFormData] = useState(technician || {
    user_email: '',
    full_name: '',
    employee_id: '',
    phone: '',
    is_active: true,
    hire_date: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full Name *</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="user_email">Email Address *</Label>
        <Input
          id="user_email"
          type="email"
          value={formData.user_email}
          onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="employee_id">Employee ID</Label>
        <Input
          id="employee_id"
          value={formData.employee_id}
          onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="hire_date">Hire Date</Label>
        <Input
          id="hire_date"
          type="date"
          value={formData.hire_date}
          onChange={(e) => setFormData(prev => ({ ...prev, hire_date: e.target.value }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {technician ? 'Update Technician' : 'Add Technician'}
        </Button>
      </div>
    </form>
  );
}