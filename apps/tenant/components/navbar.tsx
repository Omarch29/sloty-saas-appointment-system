'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Users,
  Settings,
  Calendar,
  MapPin,
  Clock,
  FileText,
  UserCheck,
  Sliders
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Building2 },
  { name: 'Locations', href: '/locations', icon: MapPin },
  { name: 'Providers', href: '/providers', icon: UserCheck },
  { name: 'Services', href: '/services', icon: Sliders },
  { name: 'Parameters', href: '/parameters', icon: FileText },
  { name: 'Availability', href: '/availability', icon: Clock },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Appointments', href: '/appointments', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Sloty Tenant</span>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Tenant: Demo Organization
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
