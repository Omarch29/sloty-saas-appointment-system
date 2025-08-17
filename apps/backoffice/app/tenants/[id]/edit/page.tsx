'use client'

import { Button } from "@sloty/ui"
import { Card, CardHeader, CardTitle, CardContent } from "@sloty/ui"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useParams } from "next/navigation"

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Madrid',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
]

const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'BRL',
  'MXN',
  'CAD',
  'JPY',
  'AUD'
]

export default function EditTenantPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const tenantId = params.id as string
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [tenant, setTenant] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    billingEmail: '',
    timezone: 'UTC',
    defaultCurrency: 'USD',
    status: 'active'
  })

  useEffect(() => {
    fetchTenant()
  }, [tenantId])

  useEffect(() => {
    if (searchParams.get('success') === 'created') {
      alert('Tenant created successfully!')
    }
  }, [searchParams])

  const fetchTenant = async () => {
    try {
      const response = await fetch(`/api/tenants/${tenantId}`)
      if (!response.ok) throw new Error('Failed to fetch tenant')
      
      const tenantData = await response.json()
      setTenant(tenantData)
      setFormData({
        name: tenantData.name,
        legalName: tenantData.legalName || '',
        billingEmail: tenantData.billingEmail || '',
        timezone: tenantData.timezone,
        defaultCurrency: tenantData.defaultCurrency,
        status: tenantData.status
      })
    } catch (error) {
      console.error('Error fetching tenant:', error)
      alert('Failed to fetch tenant details')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/tenants/${tenantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update tenant')
      }

      alert('Tenant updated successfully!')
      fetchTenant() // Refresh data
    } catch (error) {
      console.error('Error updating tenant:', error)
      alert(error instanceof Error ? error.message : 'Failed to update tenant')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/tenants/${tenantId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete tenant')
      }

      alert('Tenant deleted successfully!')
      router.push('/tenants')
    } catch (error) {
      console.error('Error deleting tenant:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete tenant')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!tenant) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Tenant</h1>
        <p className="text-gray-600 mt-2">Update tenant information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="legalName" className="block text-sm font-medium text-gray-700 mb-1">
                Legal Name
              </label>
              <input
                type="text"
                id="legalName"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="billingEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Billing Email
              </label>
              <input
                type="email"
                id="billingEmail"
                value={formData.billingEmail}
                onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone *
                </label>
                <select
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Currency *
                </label>
                <select
                  id="currency"
                  value={formData.defaultCurrency}
                  onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Tenant'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/tenants')}
              >
                Back to List
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="ml-auto"
              >
                {isDeleting ? 'Deleting...' : 'Delete Tenant'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Tenant Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-500">ID</p>
              <p className="font-mono text-xs">{tenant.id}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Created</p>
              <p>{new Date(tenant.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Updated</p>
              <p>{new Date(tenant.updatedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Users</p>
              <p>{tenant._count?.users || 0} users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
