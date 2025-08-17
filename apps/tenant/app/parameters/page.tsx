'use client';

import { useState } from 'react';
import { FileText, Plus, Edit, Eye, Settings } from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockParameters = [
  {
    id: '1',
    name: 'Visit Type',
    dataType: 'enum',
    scope: 'appointment',
    isRequired: true,
    helpText: 'Type of medical visit',
    options: [
      { id: '1', value: 'new_patient', label: 'New Patient', isActive: true },
      { id: '2', value: 'follow_up', label: 'Follow-up', isActive: true },
      { id: '3', value: 'urgent', label: 'Urgent Care', isActive: true },
    ],
    dependencyRules: [
      {
        id: '1',
        parentParameterId: '1',
        childParameterId: '2',
        visibilityMode: 'show',
        parentOptionId: '1', // Show insurance details for new patients
      },
    ],
  },
  {
    id: '2',
    name: 'Insurance Details',
    dataType: 'text',
    scope: 'appointment',
    isRequired: false,
    helpText: 'Insurance provider and member ID',
    options: [],
    dependencyRules: [],
  },
  {
    id: '3',
    name: 'Age Group',
    dataType: 'enum',
    scope: 'customer',
    isRequired: true,
    helpText: 'Patient age category',
    options: [
      { id: '4', value: 'child', label: 'Child (0-17)', isActive: true },
      { id: '5', value: 'adult', label: 'Adult (18-64)', isActive: true },
      { id: '6', value: 'senior', label: 'Senior (65+)', isActive: true },
    ],
    dependencyRules: [
      {
        id: '2',
        parentParameterId: '3',
        childParameterId: '4',
        visibilityMode: 'require',
        parentOptionId: '4', // Require guardian consent for children
      },
    ],
  },
  {
    id: '4',
    name: 'Guardian Consent',
    dataType: 'boolean',
    scope: 'customer',
    isRequired: false,
    helpText: 'Guardian consent for minor patients',
    options: [],
    dependencyRules: [],
  },
];

export default function ParametersPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'enum':
        return '📝';
      case 'boolean':
        return '☑️';
      case 'number':
        return '🔢';
      case 'date':
        return '📅';
      default:
        return '📄';
    }
  };

  const getDependentParameters = (parameterId: string) => {
    return mockParameters.filter(p => 
      p.dependencyRules.some(rule => rule.parentParameterId === parameterId)
    );
  };

  const isParameterVisible = (parameter: any) => {
    const rules = mockParameters.flatMap(p => p.dependencyRules)
      .filter(rule => rule.childParameterId === parameter.id);
    
    if (rules.length === 0) return true;
    
    return rules.some(rule => {
      const parentValue = previewValues[rule.parentParameterId];
      if (rule.parentOptionId) {
        return parentValue === rule.parentOptionId;
      }
      return !!parentValue;
    });
  };

  const isParameterRequired = (parameter: any) => {
    const rules = mockParameters.flatMap(p => p.dependencyRules)
      .filter(rule => rule.childParameterId === parameter.id && rule.visibilityMode === 'require');
    
    if (rules.length === 0) return parameter.isRequired;
    
    return parameter.isRequired || rules.some(rule => {
      const parentValue = previewValues[rule.parentParameterId];
      if (rule.parentOptionId) {
        return parentValue === rule.parentOptionId;
      }
      return !!parentValue;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parameters</h1>
          <p className="mt-2 text-gray-600">
            Manage custom parameters and their dependency rules
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Eye className="h-5 w-5 mr-2" />
            {showPreview ? 'Hide Preview' : 'Live Preview'}
          </button>
          <Link
            href="/parameters/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Parameter
          </Link>
        </div>
      </div>

      <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
        {/* Parameters List */}
        <div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Parameter Definitions</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {mockParameters.map((parameter) => (
                <div key={parameter.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getDataTypeIcon(parameter.dataType)}</div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {parameter.name}
                        </h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span className="capitalize">{parameter.dataType}</span>
                          <span>•</span>
                          <span className="capitalize">{parameter.scope}</span>
                          {parameter.isRequired && (
                            <>
                              <span>•</span>
                              <span className="text-red-600">Required</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{parameter.helpText}</p>
                        
                        {/* Options */}
                        {parameter.options.length > 0 && (
                          <div className="flex space-x-1 mt-2">
                            {parameter.options.map((option) => (
                              <span
                                key={option.id}
                                className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                              >
                                {option.label}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Dependency Info */}
                        {parameter.dependencyRules.length > 0 && (
                          <div className="mt-2 text-xs text-amber-600">
                            Controls {getDependentParameters(parameter.id).length} other parameter(s)
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/parameters/${parameter.id}/rules`}
                        className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                        title="Dependency Rules"
                      >
                        <Settings className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/parameters/${parameter.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Live Preview</h3>
              <p className="text-sm text-gray-600 mb-4">
                Change values to see how dependency rules affect parameter visibility and requirements.
              </p>
              
              <form className="space-y-6">
                {mockParameters
                  .filter(isParameterVisible)
                  .map((parameter) => {
                    const required = isParameterRequired(parameter);
                    
                    return (
                      <div key={parameter.id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {parameter.name}
                          {required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        
                        {parameter.helpText && (
                          <p className="text-xs text-gray-500">{parameter.helpText}</p>
                        )}

                        {parameter.dataType === 'enum' && parameter.options.length > 0 ? (
                          <select
                            value={previewValues[parameter.id] || ''}
                            onChange={(e) => setPreviewValues(prev => ({
                              ...prev,
                              [parameter.id]: e.target.value
                            }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              required ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select...</option>
                            {parameter.options.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : parameter.dataType === 'boolean' ? (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`preview-${parameter.id}`}
                              checked={previewValues[parameter.id] || false}
                              onChange={(e) => setPreviewValues(prev => ({
                                ...prev,
                                [parameter.id]: e.target.checked
                              }))}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`preview-${parameter.id}`}
                              className="ml-2 text-sm text-gray-700"
                            >
                              Yes
                            </label>
                          </div>
                        ) : parameter.dataType === 'date' ? (
                          <input
                            type="date"
                            value={previewValues[parameter.id] || ''}
                            onChange={(e) => setPreviewValues(prev => ({
                              ...prev,
                              [parameter.id]: e.target.value
                            }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              required ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        ) : parameter.dataType === 'number' ? (
                          <input
                            type="number"
                            value={previewValues[parameter.id] || ''}
                            onChange={(e) => setPreviewValues(prev => ({
                              ...prev,
                              [parameter.id]: e.target.value
                            }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              required ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={previewValues[parameter.id] || ''}
                            onChange={(e) => setPreviewValues(prev => ({
                              ...prev,
                              [parameter.id]: e.target.value
                            }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              required ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
              </form>
            </div>
          </div>
        )}
      </div>

      {mockParameters.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parameters yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first parameter</p>
          <Link
            href="/parameters/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Parameter
          </Link>
        </div>
      )}
    </div>
  );
}
