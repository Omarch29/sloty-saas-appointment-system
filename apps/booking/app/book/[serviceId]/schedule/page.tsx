'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore } from 'date-fns';

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
    image: '👩‍⚕️',
    specialties: ['Internal Medicine']
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    image: '👨‍⚕️',
    specialties: ['Family Medicine']
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

// Mock availability data
interface TimeSlot {
  time: string;
  datetime: Date;
  available: boolean;
}

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const baseHours = [9, 10, 11, 14, 15, 16]; // 9am-11am, 2pm-4pm
  
  // Simulate some randomness - some slots unavailable
  const unavailableSlots = Math.floor(Math.random() * 2) + 1;
  const unavailableIndices = new Set();
  
  for (let i = 0; i < unavailableSlots; i++) {
    unavailableIndices.add(Math.floor(Math.random() * baseHours.length));
  }
  
  baseHours.forEach((hour, index) => {
    slots.push({
      time: `${hour === 12 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
      datetime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0),
      available: !unavailableIndices.has(index)
    });
    
    // Add 30-minute slot
    slots.push({
      time: `${hour === 12 ? 12 : hour > 12 ? hour - 12 : hour}:30 ${hour >= 12 ? 'PM' : 'AM'}`,
      datetime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 30),
      available: !unavailableIndices.has(index) && Math.random() > 0.3
    });
  });
  
  return slots;
};

export default function SchedulePage({ params }: { params: { serviceId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams.get('provider');
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('1');
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  
  const service = mockServices.find(s => s.id === params.serviceId);
  const provider = mockProviders.find(p => p.id === providerId);
  
  // Generate week days starting from current week
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Get available time slots for selected date
  const availableSlots = generateTimeSlots(selectedDate);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset selected time when date changes
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleContinue = () => {
    if (selectedTime) {
      const selectedSlot = availableSlots.find(slot => slot.time === selectedTime);
      if (selectedSlot) {
        const params = new URLSearchParams({
          provider: providerId || '',
          location: selectedLocation,
          datetime: selectedSlot.datetime.toISOString()
        });
        router.push(`/book/${service?.id}/details?${params.toString()}`);
      }
    }
  };
  
  const nextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7));
  };
  
  const prevWeek = () => {
    const newWeek = addDays(currentWeek, -7);
    if (!isBefore(newWeek, new Date())) {
      setCurrentWeek(newWeek);
    }
  };
  
  if (!service || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service or Provider Not Found</h1>
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
              href={`/book/${params.serviceId}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Step 3 of 4</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{service.image}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{service.name}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{provider.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} min</span>
                  </div>
                  <span className="font-semibold">${service.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevWeek}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isBefore(addDays(currentWeek, -7), new Date())}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-gray-600 min-w-[100px] text-center">
                  {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}
                </span>
                <button
                  onClick={nextWeek}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(date => {
                const isPast = isBefore(date, new Date()) && !isToday(date);
                const isSelected = isSameDay(date, selectedDate);
                const isCurrentDay = isToday(date);
                
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => !isPast && handleDateSelect(date)}
                    disabled={isPast}
                    className={`
                      p-3 text-center rounded-lg transition-colors
                      ${isPast
                        ? 'text-gray-300 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-600 text-white'
                        : isCurrentDay
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'hover:bg-gray-100 text-gray-900'
                      }
                    `}
                  >
                    <div className="text-sm font-medium">{format(date, 'd')}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Available Times - {format(selectedDate, 'EEEE, MMMM d')}
            </h3>
            
            {/* Location Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {mockLocations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name} - {location.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-2 gap-3">
              {availableSlots.map(slot => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={`
                    p-3 text-center rounded-lg border transition-colors
                    ${!slot.available
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : selectedTime === slot.time
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-900 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  <div className="font-medium">{slot.time}</div>
                  {!slot.available && (
                    <div className="text-xs mt-1">Unavailable</div>
                  )}
                </button>
              ))}
            </div>

            {availableSlots.filter(slot => slot.available).length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No available times for this date</p>
                <p className="text-sm text-gray-500 mt-2">Please select a different date</p>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        {selectedTime && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selected appointment:</p>
                  <p className="font-semibold text-gray-900">
                    {format(selectedDate, 'EEEE, MMMM d')} at {selectedTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    {mockLocations.find(loc => loc.id === selectedLocation)?.name}
                  </p>
                </div>
                <button
                  onClick={handleContinue}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

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
                  3
                </div>
                <span className="text-sm text-gray-600">Schedule</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium">
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
