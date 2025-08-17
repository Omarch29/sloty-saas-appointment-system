'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock, DollarSign, User, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock data
const mockServices = [
  {
    id: '1',
    name: 'General Consultation',
    description: 'Complete health assessment and consultation with our experienced physicians.',
    duration: 30,
    price: 150,
    providers: [
      { id: '1', name: 'Dr. Sarah Johnson', specialties: ['Internal Medicine'], locations: ['1'] },
      { id: '2', name: 'Dr. Michael Chen', specialties: ['Family Medicine'], locations: ['1', '2'] },
    ],
    category: 'Primary Care',
    image: '🩺',
    parameters: [
      { id: '1', name: 'Visit Type', type: 'enum', required: true },
      { id: '2', name: 'Insurance Details', type: 'text', required: false },
    ]
  }
];

const mockProviders = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialties: ['Internal Medicine'],
    bio: 'Dr. Johnson has over 15 years of experience in internal medicine and preventive care.',
    image: '👩‍⚕️',
    rating: 4.9,
    reviews: 127,
    locations: ['1'],
    availability: {
      nextAvailable: '2025-08-18T09:00:00',
      workingHours: '9:00 AM - 5:00 PM'
    }
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialties: ['Family Medicine'],
    bio: 'Dr. Chen specializes in family medicine with a focus on comprehensive patient care.',
    image: '👨‍⚕️',
    rating: 4.8,
    reviews: 98,
    locations: ['1', '2'],
    availability: {
      nextAvailable: '2025-08-19T10:00:00',
      workingHours: '8:00 AM - 6:00 PM'
    }
  }
];

const mockLocations = [
  {
    id: '1',
    name: 'Downtown Main',
    address: '123 Main St, Downtown, CA 90210',
    phone: '(555) 123-4567'
  },
  {
    id: '2',
    name: 'Westside Branch',
    address: '456 Oak Ave, Westside, CA 90211',
    phone: '(555) 234-5678'
  }
];

export default function ServiceBookingPage({ params }: { params: { serviceId: string } }) {
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [step, setStep] = useState(1); // 1: Service details, 2: Provider selection
  
  const service = mockServices.find(s => s.id === params.serviceId);
  const availableProviders = service ? mockProviders.filter(p => 
    service.providers.some(sp => sp.id === p.id)
  ) : [];

  const handleContinue = () => {
    if (step === 1 && service && service.providers.length > 1) {
      setStep(2); // Show provider selection
    } else {
      // Go to date/time selection
      const providerId = selectedProvider || (service?.providers[0]?.id || '');
      router.push(`/book/${params.serviceId}/schedule?provider=${providerId}`);
    }
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    router.push(`/book/${params.serviceId}/schedule?provider=${providerId}`);
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800"
          >
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
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Services</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Step {step} of 4</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 1 && (
          <div className="space-y-8">
            {/* Service Details */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-start space-x-6">
                <div className="text-6xl">{service.image}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
                      <span className="text-lg text-blue-600 font-medium">{service.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${service.price}</div>
                      <div className="text-sm text-gray-600">{service.duration} minutes</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-lg mb-6">{service.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-5 w-5" />
                      <span>{service.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="h-5 w-5" />
                      <span>${service.price}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <User className="h-5 w-5" />
                      <span>{service.providers.length} provider{service.providers.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Available Providers Preview */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Providers</h3>
                    <div className="space-y-3">
                      {availableProviders.map(provider => (
                        <div key={provider.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{provider.image}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                              <p className="text-sm text-gray-600">
                                {provider.specialties.join(', ')} • {provider.rating} ⭐ ({provider.reviews} reviews)
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Next: {new Date(provider.availability.nextAvailable).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={handleContinue}
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {service.providers.length > 1 ? 'Choose Provider' : 'Select Date & Time'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            {/* Provider Selection */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Provider</h2>
              <p className="text-gray-600 mb-8">Select your preferred healthcare provider for this service.</p>
              
              <div className="space-y-6">
                {availableProviders.map(provider => (
                  <div
                    key={provider.id}
                    className={`border rounded-lg p-6 cursor-pointer transition-colors ${
                      selectedProvider === provider.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <span className="text-4xl">{provider.image}</span>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{provider.name}</h3>
                          <div className="flex items-center space-x-4 mb-3">
                            <span className="text-sm text-blue-600 font-medium">
                              {provider.specialties.join(', ')}
                            </span>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-medium">{provider.rating}</span>
                              <span className="text-yellow-400">⭐</span>
                              <span className="text-sm text-gray-600">({provider.reviews} reviews)</span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{provider.bio}</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Next available: {new Date(provider.availability.nextAvailable).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>Hours: {provider.availability.workingHours}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {provider.locations.map(locId => 
                                  mockLocations.find(loc => loc.id === locId)?.name
                                ).join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProviderSelect(provider.id);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className="text-sm text-gray-600">Service</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className="text-sm text-gray-600">Provider</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <span className="text-sm text-gray-600">Schedule</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
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
