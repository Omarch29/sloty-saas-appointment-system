'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from "@tremor/react";
import {
  Shield,
  Building2,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Bell,
  Search,
  User,
  Database
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Tenants', href: '/tenants', icon: Building2 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'System', href: '/system', icon: Database },
  { name: 'Settings', href: '/settings', icon: Settings }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-tremor-border fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-tremor-content-emphasis">Sloty</span>
                  <Badge color="red" size="sm" className="ml-2">
                    SUPERADMIN
                  </Badge>
                </div>
              </div>
            </div>
            <div className="hidden lg:ml-8 lg:flex lg:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'text-tremor-content hover:bg-tremor-background-muted hover:text-tremor-content-emphasis'
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
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tremor-content-subtle" />
                <input
                  type="text"
                  placeholder="Search tenants..."
                  className="pl-10 pr-4 py-2 border border-tremor-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-tremor-background"
                />
              </div>
            </div>
            
            {/* System Status */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-tremor-content-subtle">All systems operational</span>
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 text-tremor-content-subtle hover:text-tremor-content-emphasis transition-colors">
              <Bell className="h-5 w-5" />
              <Badge color="red" size="sm" className="absolute -top-1 -right-1">
                5
              </Badge>
            </button>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-tremor-content-emphasis">Super Admin</div>
                <div className="text-xs text-tremor-content-subtle">admin@sloty.com</div>
              </div>
              <button className="p-1 rounded-full bg-tremor-background-muted hover:bg-tremor-background-emphasized transition-colors">
                <User className="h-6 w-6 text-tremor-content" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="lg:hidden border-t border-tremor-border bg-tremor-background-subtle">
        <div className="px-2 pt-2 pb-3 space-y-1 max-h-64 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-red-50 text-red-700'
                    : 'text-tremor-content hover:bg-tremor-background-muted hover:text-tremor-content-emphasis'
                }`}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
