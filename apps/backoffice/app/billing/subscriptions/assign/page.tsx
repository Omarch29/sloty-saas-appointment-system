'use client'

import { Button } from "@sloty/ui"
import { Card, CardHeader, CardTitle, CardContent } from "@sloty/ui"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Tenant {
  id: string
  name: string
  status: string
}

interface Product {
  id: string
  name: string
  isActive: boolean
  pricePlans: {
    id: string
    name: string
    priceCents: number
    billingCycle: string
    includesSeats: number
    includesAppointmentsPerMonth: number | null
  }[]
}

export default function AssignSubscriptionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    tenantId: '',
    productId: '',
    pricePlanId: '',
    status: 'trialing'
  })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (formData.productId) {
      const product = products.find(p => p.id === formData.productId)
      setSelectedProduct(product || null)
      if (product && product.pricePlans.length > 0) {
        setFormData(prev => ({ ...prev, pricePlanId: product.pricePlans[0].id }))
      }
    } else {
      setSelectedProduct(null)
    }
  }, [formData.productId, products])

  const fetchData = async () => {
    try {
      const [tenantsResponse, productsResponse] = await Promise.all([
        fetch('/api/tenants'),
        fetch('/api/billing/products')
      ])

      if (tenantsResponse.ok) {
        const tenantsData = await tenantsResponse.json()
        setTenants(tenantsData.filter((t: Tenant) => t.status === 'active'))
      }

      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData.filter((p: Product) => p.isActive))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Set billing cycle anchor to start of next month for new subscriptions
      const billingCycleAnchor = new Date()
      billingCycleAnchor.setMonth(billingCycleAnchor.getMonth() + 1, 1)
      billingCycleAnchor.setHours(0, 0, 0, 0)

      // Set trial end to 14 days from now if trialing
      const trialEnd = formData.status === 'trialing' ? new Date() : null
      if (trialEnd) {
        trialEnd.setDate(trialEnd.getDate() + 14)
      }

      const response = await fetch('/api/billing/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          billingCycleAnchor: billingCycleAnchor.toISOString(),
          trialEnd: trialEnd?.toISOString() || null
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create subscription')
      }

      const subscription = await response.json()
      alert('Subscription created successfully!')
      router.push(`/billing/subscriptions/${subscription.id}`)
    } catch (error) {
      console.error('Error creating subscription:', error)
      alert(error instanceof Error ? error.message : 'Failed to create subscription')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPricePlan = selectedProduct?.pricePlans.find(p => p.id === formData.pricePlanId)

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Assign Subscription</h1>
        <p className="text-gray-600 mt-2">Assign a product plan to a tenant</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700 mb-1">
                Tenant *
              </label>
              <select
                id="tenantId"
                value={formData.tenantId}
                onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a tenant...</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                Product *
              </label>
              <select
                id="productId"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a product...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div>
                <label htmlFor="pricePlanId" className="block text-sm font-medium text-gray-700 mb-1">
                  Price Plan *
                </label>
                <select
                  id="pricePlanId"
                  value={formData.pricePlanId}
                  onChange={(e) => setFormData({ ...formData, pricePlanId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {selectedProduct.pricePlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ${(plan.priceCents / 100).toFixed(2)}/{plan.billingCycle}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Initial Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="trialing">Trialing (14 days free)</option>
                <option value="active">Active (billing starts immediately)</option>
              </select>
            </div>

            {selectedPricePlan && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-800 mb-2">Plan Details</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Price:</strong> ${(selectedPricePlan.priceCents / 100).toFixed(2)} per {selectedPricePlan.billingCycle}</p>
                  <p><strong>Included Seats:</strong> {selectedPricePlan.includesSeats}</p>
                  <p><strong>Appointments:</strong> {
                    selectedPricePlan.includesAppointmentsPerMonth 
                      ? `${selectedPricePlan.includesAppointmentsPerMonth} per month`
                      : 'Unlimited'
                  }</p>
                  {formData.status === 'trialing' && (
                    <p><strong>Trial:</strong> 14 days free, then billing starts</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading || !formData.tenantId || !formData.productId || !formData.pricePlanId}>
                {isLoading ? 'Creating Subscription...' : 'Create Subscription'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/billing/subscriptions')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
