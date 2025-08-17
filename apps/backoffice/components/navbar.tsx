'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@sloty/ui'

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Dashboard', active: pathname === '/' },
    { href: '/tenants', label: 'Tenants', active: pathname.startsWith('/tenants') },
    { href: '/billing', label: 'Billing', active: pathname.startsWith('/billing') }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Sloty</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                SUPERADMIN
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={item.active ? 'default' : 'ghost'}
                    size="sm"
                    className={item.active ? '' : 'text-gray-600 hover:text-gray-900'}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Superadmin</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">S</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
