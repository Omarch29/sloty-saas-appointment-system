'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, MapPin, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Mock data - in real implementation, this would come from API based on tenant subdomain
const mockTenant = {
  id: 'healthcenter1',
  name: 'Downtown Health Center',
  description: 'Professional healthcare services in the heart of downtown.',
  logo: '🏥',
  theme: {
    primary: 'blue',
    accent: 'green'
  },
  contact: {
    phone: '(555) 123-4567',
    email: 'info@downtownhealth.com',
    address: '123 Main St, Downtown, CA 90210'
  }
};

const mockServices = [
  {
    id: '1',
    name: 'General Consultation',
    description: 'Complete health assessment and consultation with our experienced physicians.',
    duration: 30,
    price: 150,
    providers: [
      { id: '1', name: 'Dr. Sarah Johnson', specialties: ['Internal Medicine'] },
      { id: '2', name: 'Dr. Michael Chen', specialties: ['Family Medicine'] },
    ],
    category: 'Primary Care',
    image: '🩺'
  },
  {
    id: '2',
    name: 'Cardiology Consultation',
    description: 'Comprehensive cardiac evaluation and treatment planning.',
    duration: 45,
    price: 250,
    providers: [
      { id: '3', name: 'Dr. Emily Rodriguez', specialties: ['Cardiology'] },
    ],
    category: 'Specialty Care',
    image: '❤️'
  },
  {
    id: '3',
    name: 'Annual Physical Exam',
    description: 'Complete annual health screening and preventive care assessment.',
    duration: 60,
    price: 200,
    providers: [
      { id: '1', name: 'Dr. Sarah Johnson', specialties: ['Internal Medicine'] },
      { id: '4', name: 'Dr. David Kim', specialties: ['Preventive Medicine'] },
    ],
    category: 'Preventive Care',
    image: '📋'
  },
  {
    id: '4',
    name: 'Mental Health Counseling',
    description: 'Individual therapy sessions with licensed mental health professionals.',
    duration: 50,
    price: 180,
    providers: [
      { id: '5', name: 'Dr. Lisa Thompson', specialties: ['Psychology'] },
      { id: '6', name: 'Dr. Robert Wilson', specialties: ['Psychiatry'] },
    ],
    category: 'Mental Health',
    image: '🧠'
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

export default function BookingLandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ['all', ...Array.from(new Set(mockServices.map(s => s.category)))];
  
  const filteredServices = mockServices.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Extract tenant from subdomain (for demo purposes, we'll use mock data)
  const getTenantFromSubdomain = () => {
    // In real implementation: 
    // const hostname = window.location.hostname;
    // const subdomain = hostname.split('.')[0];
    // Then fetch tenant data from API
    return mockTenant;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{mockTenant.logo}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{mockTenant.name}</h1>
                <p className="text-sm text-gray-600">Online Booking</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{mockTenant.contact.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Book Your Appointment</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {mockTenant.description}
          </p>
          <div className="flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Easy Scheduling</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Flexible Hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Expert Providers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Choose from our comprehensive healthcare services</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {category === 'all' ? 'All Services' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{service.image}</span>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                        <span className="text-sm text-blue-600 font-medium">{service.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${service.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Available Providers:</p>
                    <div className="space-y-1">
                      {service.providers.slice(0, 2).map(provider => (
                        <div key={provider.id} className="text-sm text-gray-700">
                          {provider.name}
                        </div>
                      ))}
                      {service.providers.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{service.providers.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/book/${service.id}`}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No services found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Locations Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Locations</h2>
            <p className="text-xl text-gray-600">Visit us at any of our convenient locations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockLocations.map(location => (
              <div key={location.id} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{location.name}</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📞</span>
                    <span>{location.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{mockTenant.logo}</span>
                <h3 className="text-xl font-bold">{mockTenant.name}</h3>
              </div>
              <p className="text-gray-300">{mockTenant.description}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-300">
                <p>{mockTenant.contact.phone}</p>
                <p>{mockTenant.contact.email}</p>
                <p>{mockTenant.contact.address}</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <p className="text-gray-300">Book Appointment</p>
                <p className="text-gray-300">Our Services</p>
                <p className="text-gray-300">Locations</p>
                <p className="text-gray-300">Contact Us</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 {mockTenant.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
