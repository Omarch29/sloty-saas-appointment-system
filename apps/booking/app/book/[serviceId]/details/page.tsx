'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, MapPin, DollarSign, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock data
const mockServices = [
  {
    id: '1',
    name: 'General Consultation',
    duration: 30,
    price: 150,
    image: '🩺'
  }
];

const mockProviders = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    image: '👩‍⚕️'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    image: '👨‍⚕️'
  }
];

const mockLocations = [
  {
    id: '1',
    name: 'Downtown Main',
    address: '123 Main St, Downtown, CA 90210'
  },
  {
    id: '2',
    name: 'Westside Branch',
    address: '456 Oak Ave, Westside, CA 90211'
  }
];

// Mock parameters with dependencies (from tenant system)
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
    helpText: 'Insurance provider and member ID (required for new patients)',
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
    helpText: 'Required for patients under 18 years old',
    options: [],
    dependencyRules: [],
  },
  {
    id: '5',
    name: 'Preferred Contact Method',
    dataType: 'enum',
    scope: 'customer',
    isRequired: true,
    helpText: 'How would you like to be contacted?',
    options: [
      { id: '7', value: 'email', label: 'Email', isActive: true },
      { id: '8', value: 'phone', label: 'Phone', isActive: true },
      { id: '9', value: 'sms', label: 'SMS', isActive: true },
    ],
    dependencyRules: [],
  },
];

interface FormData {
  // Customer info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Dynamic parameters
  parameters: Record<string, any>;
  
  // Notes
  notes: string;
}

export default function DetailsPage({ params }: { params: { serviceId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const providerId = searchParams.get('provider');
  const locationId = searchParams.get('location');
  const datetime = searchParams.get('datetime');
  
  const service = mockServices.find(s => s.id === params.serviceId);
  const provider = mockProviders.find(p => p.id === providerId);
  const location = mockLocations.find(l => l.id === locationId);
  const appointmentDate = datetime ? new Date(datetime) : null;
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    parameters: {},
    notes: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dependency logic
  const isParameterVisible = (parameter: any) => {
    const rules = mockParameters.flatMap(p => p.dependencyRules)
      .filter(rule => rule.childParameterId === parameter.id);
    
    if (rules.length === 0) return true;
    
    return rules.some(rule => {
      const parentParam = mockParameters.find(p => p.id === rule.parentParameterId);
      const parentValue = formData.parameters[rule.parentParameterId];
      
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
    if (parameter.isRequired) return true;
    
    const requireRules = mockParameters.flatMap(p => p.dependencyRules)
      .filter(rule => rule.childParameterId === parameter.id && rule.visibilityMode === 'require');
    
    return requireRules.some(rule => {
      const parentValue = formData.parameters[rule.parentParameterId];
      if (rule.parentOptionId) {
        return parentValue === rule.parentOptionId;
      }
      return !!parentValue;
    });
  };
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const updateParameterData = (parameterId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [parameterId]: value
      }
    }));
    
    // Clear error when field is updated
    if (errors[`parameter_${parameterId}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`parameter_${parameterId}`];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate basic fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate dynamic parameters
    mockParameters.forEach(parameter => {
      if (isParameterVisible(parameter) && isParameterRequired(parameter)) {
        const value = formData.parameters[parameter.id];
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[`parameter_${parameter.id}`] = `${parameter.name} is required`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to create booking hold and appointment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create booking data
      const bookingData = {
        serviceId: service?.id,
        providerId,
        locationId,
        datetime,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth
        },
        parameters: formData.parameters,
        notes: formData.notes
      };
      
      console.log('Creating appointment:', bookingData);
      
      // Navigate to confirmation page
      router.push(`/book/${params.serviceId}/confirmation?booking=${encodeURIComponent(JSON.stringify(bookingData))}`);
      
    } catch (error) {
      console.error('Booking error:', error);
      setErrors({ submit: 'Failed to create appointment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!service || !provider || !location || !appointmentDate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Booking Information</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href={`/book/${params.serviceId}/schedule?provider=${providerId}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Step 4 of 4</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Appointment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{service.image}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{provider.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} minutes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${service.price}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">When & Where</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{appointmentDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{appointmentDate.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{location.name}</span>
                </div>
                <div className="text-xs text-gray-500 pl-5">
                  {location.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.firstName}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.lastName}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dateOfBirth ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Parameters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h3>
            
            <div className="space-y-6">
              {mockParameters
                .filter(isParameterVisible)
                .map(parameter => {
                  const required = isParameterRequired(parameter);
                  const errorKey = `parameter_${parameter.id}`;
                  
                  return (
                    <div key={parameter.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {parameter.name}
                        {required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {parameter.helpText && (
                        <p className="text-xs text-gray-500 mb-2">{parameter.helpText}</p>
                      )}
                      
                      {parameter.dataType === 'enum' && parameter.options.length > 0 ? (
                        <select
                          value={formData.parameters[parameter.id] || ''}
                          onChange={(e) => updateParameterData(parameter.id, e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[errorKey] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select...</option>
                          {parameter.options.filter(opt => opt.isActive).map(option => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : parameter.dataType === 'boolean' ? (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`parameter-${parameter.id}`}
                            checked={formData.parameters[parameter.id] || false}
                            onChange={(e) => updateParameterData(parameter.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`parameter-${parameter.id}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            Yes, I agree
                          </label>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={formData.parameters[parameter.id] || ''}
                          onChange={(e) => updateParameterData(parameter.id, e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[errorKey] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                          }`}
                        />
                      )}
                      
                      {errors[errorKey] && (
                        <p className="text-red-600 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors[errorKey]}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Notes</h3>
            <textarea
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              rows={4}
              placeholder="Any additional information or special requests..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {errors.submit && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>Total: <span className="font-semibold text-gray-900">${service.price}</span></p>
                <p className="text-xs">Payment will be collected at your appointment</p>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Creating Appointment...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Progress Indicator */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="text-sm text-gray-600">Service</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="text-sm text-gray-600">Provider</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="text-sm text-gray-600">Schedule</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <span className="text-sm text-gray-600">Details</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
