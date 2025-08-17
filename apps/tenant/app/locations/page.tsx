import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Mock data - in real app this would come from database
const mockLocations = [
  {
    id: '1',
    name: 'Downtown Medical Center',
    addressLine1: '123 Main St',
    addressLine2: 'Suite 200',
    city: 'New York',
    region: 'NY',
    postalCode: '10001',
    countryCode: 'US',
    timezone: 'America/New_York',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Uptown Clinic',
    addressLine1: '456 Oak Avenue',
    city: 'New York',
    region: 'NY',
    postalCode: '10002',
    countryCode: 'US',
    timezone: 'America/New_York',
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Brooklyn Branch',
    addressLine1: '789 Brooklyn Rd',
    city: 'Brooklyn',
    region: 'NY',
    postalCode: '11201',
    countryCode: 'US',
    timezone: 'America/New_York',
    isActive: false,
    createdAt: new Date('2024-03-10'),
  },
];

export default function LocationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
          <p className="mt-2 text-gray-600">
            Manage your clinic locations and their settings
          </p>
        </div>
        <Link
          href="/locations/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Location
        </Link>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Locations</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockLocations.map((location) => (
            <div key={location.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className={`h-8 w-8 ${location.isActive ? 'text-green-500' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {location.name}
                    </h4>
                    <div className="text-sm text-gray-600">
                      {location.addressLine1}
                      {location.addressLine2 && `, ${location.addressLine2}`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {location.city}, {location.region} {location.postalCode}
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">
                        Timezone: {location.timezone}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          location.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {location.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/locations/${location.id}/edit`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/locations/${location.id}/closures`}
                    className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
                  >
                    Closures
                  </Link>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mockLocations.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No locations yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first location</p>
          <Link
            href="/locations/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Location
          </Link>
        </div>
      )}
    </div>
  );
}
