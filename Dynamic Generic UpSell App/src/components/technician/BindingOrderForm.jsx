import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Trash2, Plus } from "lucide-react";
import SignatureCanvas from 'react-signature-canvas';

export default function BindingOrderForm({
  selectedService,
  technician,
  company,
  onSubmit,
  onCancel
}) {
  const [availableServices, setAvailableServices] = useState([]);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    service_address: '',
    job_number: '',
    payment_method: 'Credit Card on File',
    technician_notes: '',
    tax_rate: 0,
    agreed_to_terms: false
  });

  useEffect(() => {
    // Load available services from company data
    const savedCompany = localStorage.getItem('fieldsell_demo_company');
    if (savedCompany) {
      const companyData = JSON.parse(savedCompany);
      const services = companyData.services || [];
      setAvailableServices(services.filter(s => s.is_active !== false));
    }
  }, []);

  const [serviceItems, setServiceItems] = useState([
    {
      name: selectedService?.name || '',
      quantity: 1,
      discount: 0,
      price: parseFloat(selectedService?.price?.replace(/[^0-9.]/g, '')) || 0
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const signatureRef = useRef(null);

  const calculateSubtotal = () => {
    return serviceItems.reduce((sum, item) => {
      const itemTotal = (item.price * item.quantity) - (item.discount || 0);
      return sum + itemTotal;
    }, 0);
  };

  const calculateTaxAmount = () => {
    return (calculateSubtotal() * formData.tax_rate) / 100;
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTaxAmount();
  };

  const addServiceItem = () => {
    setServiceItems([...serviceItems, {
      name: '',
      quantity: 1,
      discount: 0,
      price: 0
    }]);
  };

  const removeServiceItem = (index) => {
    if (serviceItems.length > 1) {
      setServiceItems(serviceItems.filter((_, i) => i !== index));
    }
  };

  const updateServiceItem = (index, field, value) => {
    const updated = [...serviceItems];
    updated[index] = {
      ...updated[index],
      [field]: field === 'name' ? value : parseFloat(value) || 0
    };
    setServiceItems(updated);
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.customer_name || !formData.customer_email) {
      alert('Please fill in customer name and email');
      return;
    }

    if (!formData.agreed_to_terms) {
      alert('Customer must agree to the terms');
      return;
    }

    if (signatureRef.current?.isEmpty()) {
      alert('Customer signature is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get signature as base64
      const signatureData = signatureRef.current?.toDataURL();

      const orderData = {
        ...formData,
        service_items: serviceItems,
        subtotal: calculateSubtotal(),
        tax_amount: calculateTaxAmount(),
        grand_total: calculateGrandTotal(),
        signature: signatureData,
        service_name: serviceItems.map(item => item.name).join(', '),
        service_price: `$${calculateGrandTotal().toFixed(2)}`,
        completed_signature: true, // This indicates a completed binding order
        binding_order: true
      };

      await onSubmit(orderData);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">Create Binding Order</h2>
          <Button onClick={onCancel} variant="ghost" size="sm">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Technician</Label>
                <Input value={technician?.full_name || 'MLN Technician'} disabled className="bg-gray-50" />
              </div>
              <div>
                <Label>Date</Label>
                <Input value={new Date().toLocaleDateString('en-US')} disabled className="bg-gray-50" />
              </div>
              <div>
                <Label>Customer Name *</Label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label>Original Job ID / WO#</Label>
                <Input
                  value={formData.job_number}
                  onChange={(e) => setFormData({ ...formData, job_number: e.target.value })}
                  placeholder="Job number"
                />
              </div>
              <div>
                <Label>Customer Phone</Label>
                <Input
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label>Customer Email *</Label>
                <Input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  placeholder="customer@example.com"
                />
              </div>
              <div className="col-span-2">
                <Label>Service Address</Label>
                <Input
                  value={formData.service_address}
                  onChange={(e) => setFormData({ ...formData, service_address: e.target.value })}
                  placeholder="Street, City, State, Zip"
                />
              </div>
            </div>
          </div>

          {/* Services & Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services & Products</h3>
            <div className="space-y-3">
              {serviceItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-5">
                    {index === 0 && <Label className="text-sm mb-1">Service/Product Name</Label>}
                    {index === 0 ? (
                      <Input
                        value={item.name}
                        disabled
                        className="bg-gray-50"
                      />
                    ) : (
                      <Select
                        value={item.name}
                        onValueChange={(value) => {
                          const selected = availableServices.find(s => s.name === value);
                          if (selected) {
                            const updated = [...serviceItems];
                            updated[index] = {
                              ...updated[index],
                              name: selected.name,
                              price: parseFloat(selected.price.replace(/[^0-9.]/g, '')) || 0
                            };
                            setServiceItems(updated);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableServices.map((service, idx) => (
                            <SelectItem key={idx} value={service.name}>
                              {service.name} - {service.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="col-span-2">
                    {index === 0 && <Label className="text-sm mb-1">Qty</Label>}
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateServiceItem(index, 'quantity', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    {index === 0 && <Label className="text-sm mb-1">Discount</Label>}
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) => updateServiceItem(index, 'discount', e.target.value)}
                      placeholder="$0.00"
                    />
                  </div>
                  <div className="col-span-2">
                    {index === 0 && <Label className="text-sm mb-1">Price</Label>}
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateServiceItem(index, 'price', e.target.value)}
                      placeholder="$0.00"
                    />
                  </div>
                  <div className="col-span-1">
                    {index === 0 && <Label className="text-sm mb-1">&nbsp;</Label>}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeServiceItem(index)}
                      disabled={serviceItems.length === 1}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addServiceItem}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Service / Item
              </Button>
            </div>
          </div>

          {/* Payment & Order Summary */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment</h3>
              <div className="space-y-4">
                <div>
                  <Label>Payment Method</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card on File">Credit Card on File</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Check">Check</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Financing">Financing</SelectItem>
                      <SelectItem value="Invoice/Bill Later">Invoice/Bill Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Technician Notes</Label>
                  <Textarea
                    value={formData.technician_notes}
                    onChange={(e) => setFormData({ ...formData, technician_notes: e.target.value })}
                    placeholder="e.g., Customer requested afternoon install..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Tax Rate (%):</span>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                    className="w-20 h-8 text-right"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax Amount:</span>
                  <span>${calculateTaxAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-3">
                  <span>Grand Total:</span>
                  <span>${calculateGrandTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Authorization */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Authorization</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <p className="text-sm">
                I, the undersigned, authorize {company?.name || 'MLN Company'} to perform the work listed above for the **Grand Total of ${calculateGrandTotal().toFixed(2)}**. I understand this charge is in addition to today's service call fee, if applicable.
              </p>

              <div>
                <Label className="mb-2 block">Customer Signature: *</Label>
                <div className="border-2 border-gray-300 rounded-lg bg-white">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: 'w-full h-40 rounded-lg',
                      style: { touchAction: 'none' }
                    }}
                    backgroundColor="white"
                  />
                </div>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={clearSignature}
                  className="mt-1 text-blue-600"
                >
                  Clear Signature
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={formData.agreed_to_terms}
                  onChange={(e) => setFormData({ ...formData, agreed_to_terms: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="agree-terms" className="text-sm">
                  I agree to the terms and authorize this work.
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit & Create Binding Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
