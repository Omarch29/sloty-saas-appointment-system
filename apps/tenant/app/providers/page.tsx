import { UserCheck, Plus, Edit, MapPin, Stethoscope } from 'lucide-react';
import Link from 'next/link';

// Mock data - in real app this would come from database
const mockProviders = [
  {
    id: '1',
    person: {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@clinic.com',
      phone: '(555) 123-4567',
    },
    displayName: 'Dr. Sarah Johnson',
    licenseNumber: 'MD-12345',
    isActive: true,
    providerLocations: [
      { locationId: '1', location: { name: 'Downtown Medical Center' } },
    ],
    providerSpecialties: [
      { specialty: { name: 'Family Medicine' } },
    ],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    person: {
      id: '2',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@clinic.com',
      phone: '(555) 234-5678',
    },
    displayName: 'Dr. Michael Chen',
    licenseNumber: 'MD-67890',
    isActive: true,
    providerLocations: [
      { locationId: '1', location: { name: 'Downtown Medical Center' } },
      { locationId: '2', location: { name: 'Uptown Clinic' } },
    ],
    providerSpecialties: [
      { specialty: { name: 'Cardiology' } },
    ],
    createdAt: new Date('2024-02-01'),
  },
];

export default function ProvidersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Providers</h1>
          <p className="mt-2 text-gray-600">
            Manage healthcare providers and their assignments
          </p>
        </div>
        <Link
          href="/providers/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Provider
        </Link>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Providers</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockProviders.map((provider) => (
            <div key={provider.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <UserCheck className={`h-8 w-8 ${provider.isActive ? 'text-green-500' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {provider.displayName}
                    </h4>
                    <div className="text-sm text-gray-600">
                      {provider.person.email} • {provider.person.phone}
                    </div>
                    <div className="text-sm text-gray-600">
                      License: {provider.licenseNumber}
                    </div>
                    
                    {/* Specialties */}
                    <div className="flex items-center space-x-2 mt-2">
                      <Stethoscope className="h-4 w-4 text-gray-400" />
                      <div className="flex space-x-1">
                        {provider.providerSpecialties.map((ps, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                          >
                            {ps.specialty.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Locations */}
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div className="flex space-x-1">
                        {provider.providerLocations.map((pl, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
                          >
                            {pl.location.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          provider.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {provider.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/providers/${provider.id}/edit`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/providers/${provider.id}/services`}
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
                  >
                    Services
                  </Link>
                  <Link
                    href={`/providers/${provider.id}/availability`}
                    className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
                  >
                    Schedule
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mockProviders.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No providers yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first provider</p>
          <Link
            href="/providers/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Provider
          </Link>
        </div>
      )}
    </div>
  );
}
