'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Calendar, Clock, User, MapPin, Mail, Phone, MessageSquare, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// T6.3 - Email/SMS stub implementation
const logNotificationSent = async (type: 'email' | 'sms', recipient: string, content: string) => {
  // Simulate API call to logging service
  const logEntry = {
    id: Date.now().toString(),
    type,
    recipient,
    content,
    timestamp: new Date().toISOString(),
    status: 'sent'
  };
  
  console.log('📧 NOTIFICATION LOG ENTRY:', logEntry);
  
  // In real implementation, this would be stored in database
  // For demo, we'll store in localStorage
  const existingLogs = JSON.parse(localStorage.getItem('notificationLogs') || '[]');
  existingLogs.push(logEntry);
  localStorage.setItem('notificationLogs', JSON.stringify(existingLogs));
  
  return logEntry;
};

const sendConfirmationNotifications = async (bookingData: any) => {
  const { customer, datetime, service, provider, location } = bookingData;
  
  // Format appointment details
  const appointmentDate = new Date(datetime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const appointmentTime = new Date(datetime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  // Email confirmation
  const emailContent = `
Dear ${customer.firstName} ${customer.lastName},

Your appointment has been confirmed!

Service: ${service.name}
Provider: ${provider.name}
Date: ${appointmentDate}
Time: ${appointmentTime}
Location: ${location.name}
Address: ${location.address}

We look forward to seeing you at your appointment.

Best regards,
Downtown Health Center
  `.trim();
  
  // SMS confirmation
  const smsContent = `
Appointment confirmed!
${service.name}
${appointmentDate} at ${appointmentTime}
${provider.name}
${location.name}
  `.trim();
  
  // Log notifications as "sent"
  await logNotificationSent('email', customer.email, emailContent);
  await logNotificationSent('sms', customer.phone, smsContent);
  
  return {
    email: { recipient: customer.email, sent: true },
    sms: { recipient: customer.phone, sent: true }
  };
};

export default function ConfirmationPage({ params }: { params: { serviceId: string } }) {
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<any>(null);
  const [notificationStatus, setNotificationStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const bookingParam = searchParams.get('booking');
    if (bookingParam) {
      try {
        const data = JSON.parse(decodeURIComponent(bookingParam));
        
        // Enrich data with service/provider/location details for display
        const enrichedData = {
          ...data,
          service: { id: '1', name: 'General Consultation', duration: 30, price: 150, image: '🩺' },
          provider: { id: data.providerId, name: data.providerId === '1' ? 'Dr. Sarah Johnson' : 'Dr. Michael Chen', image: data.providerId === '1' ? '👩‍⚕️' : '👨‍⚕️' },
          location: { 
            id: data.locationId, 
            name: data.locationId === '1' ? 'Downtown Main' : 'Westside Branch',
            address: data.locationId === '1' ? '123 Main St, Downtown, CA 90210' : '456 Oak Ave, Westside, CA 90211'
          }
        };
        
        setBookingData(enrichedData);
        
        // Send confirmation notifications (T6.3)
        sendConfirmationNotifications(enrichedData).then(status => {
          setNotificationStatus(status);
          setLoading(false);
        });
        
      } catch (error) {
        console.error('Failed to parse booking data:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [searchParams]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your booking...</p>
        </div>
      </div>
    );
  }
  
  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Information Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Services
          </Link>
        </div>
      </div>
    );
  }
  
  const appointmentDate = new Date(bookingData.datetime);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🏥</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Downtown Health Center</h1>
                <p className="text-sm text-gray-600">Appointment Confirmed</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-900 mb-2">Booking Confirmed!</h1>
          <p className="text-green-700 text-lg">
            Your appointment has been successfully scheduled. You'll receive confirmation details shortly.
          </p>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointment Details</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service & Provider */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service & Provider</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{bookingData.service.image}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{bookingData.service.name}</h4>
                    <p className="text-sm text-gray-600">{bookingData.service.duration} minutes • ${bookingData.service.price}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{bookingData.provider.image}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{bookingData.provider.name}</h4>
                    <p className="text-sm text-gray-600">Your healthcare provider</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Date, Time & Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">When & Where</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {appointmentDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-600">Date</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {appointmentDate.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                    <p className="text-sm text-gray-600">Time</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{bookingData.location.name}</p>
                    <p className="text-sm text-gray-600">{bookingData.location.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Patient Name</p>
              <p className="font-semibold text-gray-900">
                {bookingData.customer.firstName} {bookingData.customer.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-semibold text-gray-900">{bookingData.customer.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{bookingData.customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-900">{bookingData.customer.phone}</p>
            </div>
          </div>
          
          {/* Additional Parameters */}
          {Object.keys(bookingData.parameters).length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Additional Information</h4>
              <div className="space-y-2">
                {Object.entries(bookingData.parameters).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-gray-600">Parameter {key}:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {bookingData.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Notes</h4>
              <p className="text-sm text-gray-700">{bookingData.notes}</p>
            </div>
          )}
        </div>

        {/* Notification Status (T6.3) */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmation Sent</h3>
          <p className="text-gray-600 mb-4">
            We've sent confirmation details to your email and phone number.
          </p>
          
          {notificationStatus && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Confirmation</p>
                  <p className="text-xs text-gray-600">
                    Sent to {notificationStatus.email.recipient} ✓
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">SMS Confirmation</p>
                  <p className="text-xs text-gray-600">
                    Sent to {notificationStatus.sms.recipient} ✓
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">What's Next?</h3>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <p className="text-sm">
                <strong>Check your email and phone</strong> for confirmation details and any pre-appointment instructions.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <p className="text-sm">
                <strong>Arrive 15 minutes early</strong> to complete any necessary paperwork.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <p className="text-sm">
                <strong>Bring your ID and insurance card</strong> (if applicable) to your appointment.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            Book Another Appointment
          </Link>
          
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Print Confirmation
          </button>
        </div>

        {/* Booking Reference */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Booking Reference: <span className="font-mono font-semibold">BK-{Date.now().toString().slice(-8)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
