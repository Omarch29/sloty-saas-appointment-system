'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Eye, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DependencyRule {
  id: string;
  childParameterId: string;
  visibilityMode: 'show' | 'hide' | 'require';
  parentOptionId?: string;
}

// Mock data
const mockParameters = [
  {
    id: '1',
    name: 'Visit Type',
    dataType: 'enum',
    options: [
      { id: '1', value: 'new_patient', label: 'New Patient' },
      { id: '2', value: 'follow_up', label: 'Follow-up' },
      { id: '3', value: 'urgent', label: 'Urgent Care' },
    ],
  },
  {
    id: '2',
    name: 'Insurance Details',
    dataType: 'text',
    options: [],
  },
  {
    id: '3',
    name: 'Age Group',
    dataType: 'enum',
    options: [
      { id: '4', value: 'child', label: 'Child (0-17)' },
      { id: '5', value: 'adult', label: 'Adult (18-64)' },
      { id: '6', value: 'senior', label: 'Senior (65+)' },
    ],
  },
  {
    id: '4',
    name: 'Guardian Consent',
    dataType: 'boolean',
    options: [],
  },
];

export default function DependencyRulesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});
  
  // Find the current parameter
  const currentParameter = mockParameters.find(p => p.id === params.id);
  const availableParameters = mockParameters.filter(p => p.id !== params.id);

  const [rules, setRules] = useState<DependencyRule[]>([
    {
      id: '1',
      childParameterId: '2',
      visibilityMode: 'show',
      parentOptionId: '1', // Show insurance details for new patients
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement dependency rules update API
    console.log('Updating dependency rules:', rules);
    router.push('/parameters');
  };

  const addRule = () => {
    const newRule: DependencyRule = {
      id: Date.now().toString(),
      childParameterId: '',
      visibilityMode: 'show',
      parentOptionId: undefined,
    };
    setRules(prev => [...prev, newRule]);
  };

  const updateRule = (index: number, field: keyof DependencyRule, value: any) => {
    setRules(prev => prev.map((rule, i) =>
      i === index ? { ...rule, [field]: value } : rule
    ));
  };

  const removeRule = (index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index));
  };

  const getParameterName = (id: string) => {
    const param = mockParameters.find(p => p.id === id);
    return param?.name || 'Unknown Parameter';
  };

  const getParameterOptions = (parameterId: string) => {
    const param = mockParameters.find(p => p.id === parameterId);
    return param?.options || [];
  };

  const isParameterVisible = (parameter: any) => {
    const applicableRules = rules.filter(rule => rule.childParameterId === parameter.id);
    if (applicableRules.length === 0) return true;
    
    return applicableRules.some(rule => {
      const parentValue = previewValues[params.id];
      if (rule.parentOptionId) {
        if (rule.visibilityMode === 'hide') {
          return parentValue !== rule.parentOptionId;
        }
        return parentValue === rule.parentOptionId;
      }
      return !!parentValue;
    });
  };

  const isParameterRequired = (parameter: any) => {
    const requireRules = rules.filter(rule => 
      rule.childParameterId === parameter.id && rule.visibilityMode === 'require'
    );
    
    if (requireRules.length === 0) return false;
    
    return requireRules.some(rule => {
      const parentValue = previewValues[params.id];
      if (rule.parentOptionId) {
        return parentValue === rule.parentOptionId;
      }
      return !!parentValue;
    });
  };

  if (!currentParameter) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Parameter Not Found</h1>
          <Link
            href="/parameters"
            className="text-blue-600 hover:text-blue-800"
          >
            Return to Parameters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Link
          href="/parameters"
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dependency Rules</h1>
          <p className="mt-2 text-gray-600">
            Configure how <span className="font-semibold">{currentParameter.name}</span> affects other parameters
          </p>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">How Dependency Rules Work:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Show:</strong> Makes the target parameter visible when condition is met</li>
              <li><strong>Hide:</strong> Hides the target parameter when condition is met</li>
              <li><strong>Require:</strong> Makes the target parameter required when condition is met</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
        {/* Rules Configuration */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Dependency Rules</h3>
              <button
                type="button"
                onClick={addRule}
                className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Rule
              </button>
            </div>

            {rules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No dependency rules configured</p>
                <button
                  type="button"
                  onClick={addRule}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Rule
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <div key={rule.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Rule #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Parameter
                        </label>
                        <select
                          value={rule.childParameterId}
                          onChange={(e) => updateRule(index, 'childParameterId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select parameter...</option>
                          {availableParameters.map(param => (
                            <option key={param.id} value={param.id}>
                              {param.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Action
                        </label>
                        <select
                          value={rule.visibilityMode}
                          onChange={(e) => updateRule(index, 'visibilityMode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="show">Show</option>
                          <option value="hide">Hide</option>
                          <option value="require">Require</option>
                        </select>
                      </div>
                    </div>

                    {currentParameter.dataType === 'enum' && currentParameter.options.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          When "{currentParameter.name}" is (optional)
                        </label>
                        <select
                          value={rule.parentOptionId || ''}
                          onChange={(e) => updateRule(index, 'parentOptionId', e.target.value || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Any value</option>
                          {currentParameter.options.map(option => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Leave empty to trigger on any non-empty value
                        </p>
                      </div>
                    )}

                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      <strong>Rule Summary:</strong> {
                        rule.visibilityMode === 'show' ? 'Show' : 
                        rule.visibilityMode === 'hide' ? 'Hide' : 'Make required'
                      } "{getParameterName(rule.childParameterId)}" when "{currentParameter.name}" {
                        rule.parentOptionId 
                          ? `is "${currentParameter.options.find(opt => opt.id === rule.parentOptionId)?.label}"`
                          : 'has any value'
                      }.
                    </div>
                  </div>
                ))}
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
                  Save Rules
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h3>
              <p className="text-sm text-gray-600 mb-6">
                Change the parent parameter value to see how your rules affect other parameters.
              </p>
              
              <form className="space-y-6">
                {/* Parent Parameter */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-800">
                      {currentParameter.name} (Parent Parameter)
                    </label>
                    
                    {currentParameter.dataType === 'enum' && currentParameter.options.length > 0 ? (
                      <select
                        value={previewValues[params.id] || ''}
                        onChange={(e) => setPreviewValues(prev => ({
                          ...prev,
                          [params.id]: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select...</option>
                        {currentParameter.options.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : currentParameter.dataType === 'boolean' ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={previewValues[params.id] || false}
                          onChange={(e) => setPreviewValues(prev => ({
                            ...prev,
                            [params.id]: e.target.checked
                          }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-blue-800">Yes</label>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={previewValues[params.id] || ''}
                        onChange={(e) => setPreviewValues(prev => ({
                          ...prev,
                          [params.id]: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>
                </div>

                {/* Dependent Parameters */}
                {availableParameters
                  .filter(isParameterVisible)
                  .map((parameter) => {
                    const required = isParameterRequired(parameter);
                    
                    return (
                      <div key={parameter.id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {parameter.name}
                          {required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {parameter.dataType === 'enum' && parameter.options.length > 0 ? (
                          <select
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              required ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select...</option>
                            {parameter.options.map(option => (
                              <option key={option.id} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : parameter.dataType === 'boolean' ? (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">Yes</label>
                          </div>
                        ) : (
                          <input
                            type="text"
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
    </div>
  );
}
