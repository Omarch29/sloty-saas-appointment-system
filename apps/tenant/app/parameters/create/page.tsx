'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ParameterOption {
  id: string;
  value: string;
  label: string;
  isActive: boolean;
}

interface ParameterData {
  name: string;
  dataType: 'text' | 'number' | 'enum' | 'boolean' | 'date' | 'textarea';
  scope: 'appointment' | 'customer' | 'service';
  isRequired: boolean;
  helpText: string;
  options: ParameterOption[];
}

export default function CreateParameterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ParameterData>({
    name: '',
    dataType: 'text',
    scope: 'appointment',
    isRequired: false,
    helpText: '',
    options: [],
  });

  const [showPreview, setShowPreview] = useState(false);
  const [previewValue, setPreviewValue] = useState<any>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement parameter creation API
    console.log('Creating parameter:', formData);
    router.push('/parameters');
  };

  const addOption = () => {
    const newOption: ParameterOption = {
      id: Date.now().toString(),
      value: '',
      label: '',
      isActive: true,
    };
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };

  const updateOption = (index: number, field: keyof ParameterOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      ),
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const needsOptions = formData.dataType === 'enum';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Link
          href="/parameters"
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Parameter</h1>
          <p className="mt-2 text-gray-600">
            Define a new custom parameter for your services
          </p>
        </div>
      </div>

      <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
        {/* Form */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Parameter Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Visit Type, Insurance Provider"
                  required
                />
              </div>

              <div>
                <label htmlFor="dataType" className="block text-sm font-medium text-gray-700 mb-1">
                  Data Type *
                </label>
                <select
                  id="dataType"
                  value={formData.dataType}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dataType: e.target.value as ParameterData['dataType'],
                    options: e.target.value === 'enum' ? prev.options : []
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Long Text</option>
                  <option value="number">Number</option>
                  <option value="enum">Multiple Choice</option>
                  <option value="boolean">Yes/No</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div>
                <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-1">
                  Scope *
                </label>
                <select
                  id="scope"
                  value={formData.scope}
                  onChange={(e) => setFormData(prev => ({ ...prev, scope: e.target.value as ParameterData['scope'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="appointment">Appointment</option>
                  <option value="customer">Customer</option>
                  <option value="service">Service</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Where this parameter applies in the booking process
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={formData.isRequired}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRequired: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isRequired" className="ml-2 text-sm text-gray-700">
                  Required parameter
                </label>
              </div>

              <div>
                <label htmlFor="helpText" className="block text-sm font-medium text-gray-700 mb-1">
                  Help Text
                </label>
                <textarea
                  id="helpText"
                  value={formData.helpText}
                  onChange={(e) => setFormData(prev => ({ ...prev, helpText: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional description to help users understand this parameter"
                />
              </div>
            </div>

            {/* Options for enum type */}
            {needsOptions && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Options</h3>
                  <button
                    type="button"
                    onClick={addOption}
                    className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </button>
                </div>

                {formData.options.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">No options added yet</p>
                    <button
                      type="button"
                      onClick={addOption}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Option
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.options.map((option, index) => (
                      <div key={option.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Value
                            </label>
                            <input
                              type="text"
                              value={option.value}
                              onChange={(e) => updateOption(index, 'value', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="internal_value"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Label
                            </label>
                            <input
                              type="text"
                              value={option.label}
                              onChange={(e) => updateOption(index, 'label', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Display Label"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={option.isActive}
                            onChange={(e) => updateOption(index, 'isActive', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              
              <div className="flex space-x-3">
                <Link
                  href="/parameters"
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create Parameter
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview */}
        {showPreview && (
          <div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {formData.name || 'Parameter Name'}
                    {formData.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {formData.helpText && (
                    <p className="text-xs text-gray-500 mt-1">{formData.helpText}</p>
                  )}

                  <div className="mt-2">
                    {formData.dataType === 'enum' && formData.options.length > 0 ? (
                      <select
                        value={previewValue}
                        onChange={(e) => setPreviewValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select...</option>
                        {formData.options.filter(opt => opt.isActive).map((option) => (
                          <option key={option.id} value={option.value}>
                            {option.label || option.value}
                          </option>
                        ))}
                      </select>
                    ) : formData.dataType === 'boolean' ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={previewValue || false}
                          onChange={(e) => setPreviewValue(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">Yes</label>
                      </div>
                    ) : formData.dataType === 'textarea' ? (
                      <textarea
                        value={previewValue}
                        onChange={(e) => setPreviewValue(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter text..."
                      />
                    ) : formData.dataType === 'date' ? (
                      <input
                        type="date"
                        value={previewValue}
                        onChange={(e) => setPreviewValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : formData.dataType === 'number' ? (
                      <input
                        type="number"
                        value={previewValue}
                        onChange={(e) => setPreviewValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter number..."
                      />
                    ) : (
                      <input
                        type="text"
                        value={previewValue}
                        onChange={(e) => setPreviewValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter text..."
                      />
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Parameter Details</h4>
                  <dl className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Type:</dt>
                      <dd className="capitalize">{formData.dataType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Scope:</dt>
                      <dd className="capitalize">{formData.scope}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Required:</dt>
                      <dd>{formData.isRequired ? 'Yes' : 'No'}</dd>
                    </div>
                    {formData.dataType === 'enum' && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Options:</dt>
                        <dd>{formData.options.filter(opt => opt.isActive).length}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
