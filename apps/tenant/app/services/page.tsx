import { Sliders, Plus, Edit, Clock, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

// Mock data - in real app this would come from database
const mockServices = [
  {
    id: '1',
    name: 'General Consultation',
    description: 'Standard medical consultation and examination',
    specialty: { name: 'Family Medicine' },
    defaultDurationMinutes: 30,
    defaultCapacity: 1,
    isActive: true,
    providerServices: [
      {
        provider: { id: '1', displayName: 'Dr. Sarah Johnson' },
        priceCents: 15000, // $150
        durationMinutes: 30,
        capacityOverride: null,
      },
      {
        provider: { id: '2', displayName: 'Dr. Michael Chen' },
        priceCents: 18000, // $180
        durationMinutes: 45,
        capacityOverride: null,
      },
    ],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Cardiac Screening',
    description: 'Comprehensive cardiac health screening including ECG',
    specialty: { name: 'Cardiology' },
    defaultDurationMinutes: 60,
    defaultCapacity: 1,
    isActive: true,
    providerServices: [
      {
        provider: { id: '2', displayName: 'Dr. Michael Chen' },
        priceCents: 25000, // $250
        durationMinutes: 60,
        capacityOverride: null,
      },
    ],
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Group Wellness Workshop',
    description: 'Educational wellness workshop for multiple participants',
    specialty: null,
    defaultDurationMinutes: 90,
    defaultCapacity: 10,
    isActive: true,
    providerServices: [
      {
        provider: { id: '1', displayName: 'Dr. Sarah Johnson' },
        priceCents: 5000, // $50 per person
        durationMinutes: 90,
        capacityOverride: 15,
      },
    ],
    createdAt: new Date('2024-03-01'),
  },
];

export default function ServicesPage() {
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="mt-2 text-gray-600">
            Manage services offered at your clinic
          </p>
        </div>
        <Link
          href="/services/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Service
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockServices.map((service) => (
          <div key={service.id} className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Sliders className={`h-8 w-8 ${service.isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">{service.name}</h3>
                    <p className="text-gray-600">{service.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      {service.specialty && (
                        <span className="inline-flex px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {service.specialty.name}
                        </span>
                      )}
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.defaultDurationMinutes} min
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {service.defaultCapacity} {service.defaultCapacity === 1 ? 'person' : 'people'}
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          service.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/services/${service.id}/edit`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/services/${service.id}/parameters`}
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
                  >
                    Parameters
                  </Link>
                </div>
              </div>
            </div>

            {/* Provider Overrides */}
            <div className="px-6 py-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Provider Overrides</h4>
              {service.providerServices.length === 0 ? (
                <p className="text-sm text-gray-500">No providers assigned to this service</p>
              ) : (
                <div className="space-y-3">
                  {service.providerServices.map((ps, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium text-gray-900">{ps.provider.displayName}</div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatPrice(ps.priceCents)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {ps.durationMinutes || service.defaultDurationMinutes} min
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {ps.capacityOverride || service.defaultCapacity} {(ps.capacityOverride || service.defaultCapacity) === 1 ? 'person' : 'people'}
                        </div>
                        <Link
                          href={`/providers/${ps.provider.id}/services`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {mockServices.length === 0 && (
        <div className="text-center py-12">
          <Sliders className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first service</p>
          <Link
            href="/services/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Service
          </Link>
        </div>
      )}
    </div>
  );
}
