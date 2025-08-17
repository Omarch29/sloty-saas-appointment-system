'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Calendar, Clock, Trash2 } from 'lucide-react';

interface LocationClosure {
  id: string;
  startsAt: Date;
  endsAt: Date;
  reason?: string;
}

const mockClosures: LocationClosure[] = [
  {
    id: '1',
    startsAt: new Date('2024-12-25T00:00:00'),
    endsAt: new Date('2024-12-25T23:59:59'),
    reason: 'Christmas Day',
  },
  {
    id: '2',
    startsAt: new Date('2024-01-01T00:00:00'),
    endsAt: new Date('2024-01-01T23:59:59'),
    reason: 'New Year\'s Day',
  },
  {
    id: '3',
    startsAt: new Date('2024-07-04T00:00:00'),
    endsAt: new Date('2024-07-04T23:59:59'),
    reason: 'Independence Day',
  },
];

export default function LocationClosuresPage({ params }: { params: { id: string } }) {
  const [closures, setClosures] = useState<LocationClosure[]>(mockClosures);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClosure, setNewClosure] = useState({
    startsAt: '',
    endsAt: '',
    reason: '',
  });

  const handleAddClosure = (e: React.FormEvent) => {
    e.preventDefault();
    
    const closure: LocationClosure = {
      id: Math.random().toString(36).substr(2, 9),
      startsAt: new Date(newClosure.startsAt),
      endsAt: new Date(newClosure.endsAt),
      reason: newClosure.reason || undefined,
    };

    setClosures([...closures, closure]);
    setNewClosure({ startsAt: '', endsAt: '', reason: '' });
    setShowAddForm(false);
  };

  const handleDeleteClosure = (id: string) => {
    setClosures(closures.filter(c => c.id !== id));
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/locations"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Locations
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Location Closures</h1>
            <p className="mt-2 text-gray-600">
              Manage temporary closures for this location
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Closure
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Closure</h3>
          <form onSubmit={handleAddClosure} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newClosure.startsAt}
                  onChange={(e) => setNewClosure(prev => ({ ...prev, startsAt: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newClosure.endsAt}
                  onChange={(e) => setNewClosure(prev => ({ ...prev, endsAt: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional)
              </label>
              <input
                type="text"
                value={newClosure.reason}
                onChange={(e) => setNewClosure(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Holiday, Maintenance, Staff Meeting"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewClosure({ startsAt: '', endsAt: '', reason: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Closure
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Scheduled Closures</h3>
        </div>
        
        {closures.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No closures scheduled</h3>
            <p className="text-gray-600 mb-4">This location has no scheduled closures</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {closures.map((closure) => (
              <div key={closure.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Calendar className="h-8 w-8 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {closure.reason || 'Closure'}
                      </h4>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>From: {formatDateTime(closure.startsAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>To: {formatDateTime(closure.endsAt)}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          {closure.startsAt > new Date() ? 'Upcoming' : 
                           closure.endsAt < new Date() ? 'Past' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteClosure(closure.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
