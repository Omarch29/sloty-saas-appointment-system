import { Button } from "@sloty/ui"
import { Card, CardHeader, CardTitle, CardContent } from "@sloty/ui"
import { db } from "@sloty/db"
import Link from "next/link"

export default async function SubscriptionsPage() {
  const subscriptions = await db.subscription.findMany({
    include: {
      tenant: { select: { id: true, name: true, status: true } },
      product: { select: { id: true, name: true } },
      pricePlan: { 
        select: { 
          id: true, 
          name: true, 
          priceCents: true, 
          billingCycle: true,
          includesSeats: true,
          includesAppointmentsPerMonth: true
        } 
      },
      invoices: {
        select: { id: true, status: true, totalCents: true },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    trialing: subscriptions.filter(s => s.status === 'trialing').length,
    pastDue: subscriptions.filter(s => s.status === 'past_due').length,
    canceled: subscriptions.filter(s => s.status === 'canceled').length,
    monthlyRevenue: subscriptions
      .filter(s => ['active', 'trialing'].includes(s.status))
      .reduce((sum, s) => sum + (s.pricePlan.priceCents / 100), 0)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <Link href="/billing/subscriptions/assign">
          <Button>Assign Subscription</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-sm text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.trialing}</div>
            <p className="text-sm text-gray-600">Trialing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pastDue}</div>
            <p className="text-sm text-gray-600">Past Due</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
            <p className="text-sm text-gray-600">Canceled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">${stats.monthlyRevenue.toFixed(2)}</div>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Link href={`/tenants/${subscription.tenant.id}/edit`} className="hover:underline">
                      <h3 className="font-medium text-blue-600">{subscription.tenant.name}</h3>
                    </Link>
                    <span className={`px-2 py-1 rounded text-xs ${
                      subscription.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : subscription.status === 'trialing'
                        ? 'bg-blue-100 text-blue-800'
                        : subscription.status === 'past_due'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscription.status}
                    </span>
                    {subscription.tenant.status !== 'active' && (
                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                        Tenant: {subscription.tenant.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-500">Product & Plan</p>
                      <p>{subscription.product.name}</p>
                      <p className="text-gray-600">{subscription.pricePlan.name}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-500">Price</p>
                      <p>${(subscription.pricePlan.priceCents / 100).toFixed(2)}/{subscription.pricePlan.billingCycle}</p>
                      <p className="text-gray-600">
                        {subscription.pricePlan.includesSeats} seat{subscription.pricePlan.includesSeats !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-500">Billing</p>
                      <p>Next: {new Date(subscription.billingCycleAnchor).toLocaleDateString()}</p>
                      {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
                        <p className="text-blue-600">Trial until: {new Date(subscription.trialEnd).toLocaleDateString()}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-500">Last Invoice</p>
                      {subscription.invoices[0] ? (
                        <div>
                          <p className={`${
                            subscription.invoices[0].status === 'paid' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            ${(subscription.invoices[0].totalCents / 100).toFixed(2)} - {subscription.invoices[0].status}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No invoices</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/billing/subscriptions/${subscription.id}`}>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subscriptions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No subscriptions found</p>
            <Link href="/billing/subscriptions/assign">
              <Button>Create the first subscription</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
