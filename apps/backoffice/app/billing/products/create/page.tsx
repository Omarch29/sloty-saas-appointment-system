'use client'

import { Button } from "@sloty/ui"
import { Card, CardHeader, CardTitle, CardContent } from "@sloty/ui"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  })
  const [pricePlans, setPricePlans] = useState([
    {
      name: '',
      billingCycle: 'monthly',
      priceCents: 0,
      includesSeats: 1,
      includesAppointmentsPerMonth: null,
      overagePerAppointmentCents: null,
      isActive: true
    }
  ])

  const addPricePlan = () => {
    setPricePlans([
      ...pricePlans,
      {
        name: '',
        billingCycle: 'monthly',
        priceCents: 0,
        includesSeats: 1,
        includesAppointmentsPerMonth: null,
        overagePerAppointmentCents: null,
        isActive: true
      }
    ])
  }

  const removePricePlan = (index: number) => {
    if (pricePlans.length > 1) {
      setPricePlans(pricePlans.filter((_, i) => i !== index))
    }
  }

  const updatePricePlan = (index: number, field: string, value: any) => {
    const updated = [...pricePlans]
    updated[index] = { ...updated[index], [field]: value }
    setPricePlans(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/billing/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pricePlans: pricePlans.map(plan => ({
            ...plan,
            priceCents: Math.round(plan.priceCents * 100), // Convert to cents
            includesAppointmentsPerMonth: plan.includesAppointmentsPerMonth || null,
            overagePerAppointmentCents: plan.overagePerAppointmentCents ? 
              Math.round(plan.overagePerAppointmentCents * 100) : null
          }))
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create product')
      }

      const product = await response.json()
      router.push(`/billing/products/${product.id}/edit?success=created`)
    } catch (error) {
      console.error('Error creating product:', error)
      alert(error instanceof Error ? error.message : 'Failed to create product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Product</h1>
        <p className="text-gray-600 mt-2">Create a new product with pricing plans</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Sloty Pro"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Professional appointment management system"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Product is active
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Price Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Price Plans
              <Button type="button" onClick={addPricePlan} variant="outline" size="sm">
                Add Plan
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pricePlans.map((plan, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Plan {index + 1}</h4>
                    {pricePlans.length > 1 && (
                      <Button 
                        type="button" 
                        onClick={() => removePricePlan(index)}
                        variant="outline" 
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plan Name *
                      </label>
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => updatePricePlan(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Basic Plan"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Billing Cycle *
                      </label>
                      <select
                        value={plan.billingCycle}
                        onChange={(e) => updatePricePlan(index, 'billingCycle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={plan.priceCents / 100}
                        onChange={(e) => updatePricePlan(index, 'priceCents', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="29.99"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Included Seats *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={plan.includesSeats}
                        onChange={(e) => updatePricePlan(index, 'includesSeats', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Appointments per Month
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={plan.includesAppointmentsPerMonth || ''}
                        onChange={(e) => updatePricePlan(index, 'includesAppointmentsPerMonth', e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Unlimited (leave empty)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Overage per Appointment (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={plan.overagePerAppointmentCents ? plan.overagePerAppointmentCents / 100 : ''}
                        onChange={(e) => updatePricePlan(index, 'overagePerAppointmentCents', e.target.value ? parseFloat(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="No overage (leave empty)"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      id={`plan-active-${index}`}
                      checked={plan.isActive}
                      onChange={(e) => updatePricePlan(index, 'isActive', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`plan-active-${index}`} className="text-sm font-medium text-gray-700">
                      Plan is active
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Product'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/billing/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
