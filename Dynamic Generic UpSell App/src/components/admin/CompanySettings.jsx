import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadFile } from "@/api/integrations";
import { Download, Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CompanySettings({ company, onUpdate }) {
  const [formData, setFormData] = useState(company);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, logo_url: file_url }));
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onUpdate(formData);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Please try again.");
    }

    setIsSaving(false);
  };

  const handleExportData = () => {
    try {
      // Collect all localStorage data
      const exportData = {
        company: JSON.parse(localStorage.getItem('fieldsell_demo_company') || '{}'),
        technician: JSON.parse(localStorage.getItem('fieldsell_demo_technician') || '{}'),
        interactions: JSON.parse(localStorage.getItem('fieldsell_demo_interactions') || '[]'),
        orders: JSON.parse(localStorage.getItem('fieldsell_demo_orders') || '[]'),
        onboarded: localStorage.getItem('fieldsell_demo_onboarded'),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      // Create downloadable JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `fieldsell-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);

        // Validate data structure
        if (!importedData.company || !importedData.version) {
          throw new Error('Invalid backup file format');
        }

        // Restore data to localStorage
        if (importedData.company) {
          localStorage.setItem('fieldsell_demo_company', JSON.stringify(importedData.company));
        }
        if (importedData.technician) {
          localStorage.setItem('fieldsell_demo_technician', JSON.stringify(importedData.technician));
        }
        if (importedData.interactions) {
          localStorage.setItem('fieldsell_demo_interactions', JSON.stringify(importedData.interactions));
        }
        if (importedData.orders) {
          localStorage.setItem('fieldsell_demo_orders', JSON.stringify(importedData.orders));
        }
        if (importedData.onboarded) {
          localStorage.setItem('fieldsell_demo_onboarded', importedData.onboarded);
        }

        alert(`Data imported successfully! ${importedData.orders?.length || 0} orders and ${importedData.interactions?.length || 0} interactions restored.`);
        window.location.reload();
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing data. Please make sure the file is a valid FieldSell Pro backup.');
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be imported again
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                {formData.logo_url && (
                  <img src={formData.logo_url} alt="Logo" className="w-16 h-16 object-contain border rounded" />
                )}
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                />
              </div>
              {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
            </div>

            <div>
              <Label htmlFor="primary_color">Primary Brand Color</Label>
              <div className="flex items-center gap-2">
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
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Routing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Order Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Export your data to create a backup, or import a previous backup to restore your data.
              Exports include: company info, services, technicians, orders, and interactions.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Export Data</Label>
              <Button
                onClick={handleExportData}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Backup
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Creates a JSON file with all your demo data
              </p>
            </div>

            <div>
              <Label htmlFor="import-data" className="mb-2 block">Import Data</Label>
              <Input
                id="import-data"
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-2">
                Upload a previously exported backup file
              </p>
            </div>
          </div>

          <Alert variant="default" className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Demo Mode:</strong> Data is stored locally in your browser.
              Clearing browser data or using incognito mode will erase all data.
              Export regularly to prevent data loss.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}