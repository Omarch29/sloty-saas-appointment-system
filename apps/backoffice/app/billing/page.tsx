import { Button } from "@sloty/ui"
import { Card, CardHeader, CardTitle, CardContent } from "@sloty/ui"
import { db } from "@sloty/db"
import Link from "next/link"

export default async function BillingPage() {
  const [products, subscriptions] = await Promise.all([
    db.product.findMany({
      include: {
        pricePlans: true,
        _count: {
          select: { subscriptions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    db.subscription.findMany({
      include: {
        tenant: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
        pricePlan: { select: { id: true, name: true, priceCents: true, billingCycle: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  ])

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Billing Management</h1>
        <div className="flex gap-2">
          <Link href="/billing/products/create">
            <Button>Create Product</Button>
          </Link>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Products & Plans</h2>
          <Link href="/billing/products">
            <Button variant="outline">Manage All Products</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {products.slice(0, 3).map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{product.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product._count.subscriptions} subscriptions
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">{product.description}</p>
                <div className="flex flex-wrap gap-2">
                  {product.pricePlans.map((plan) => (
                    <span key={plan.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {plan.name}: ${(plan.priceCents / 100).toFixed(2)}/{plan.billingCycle}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscriptions Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Subscriptions</h2>
          <Link href="/billing/subscriptions">
            <Button variant="outline">View All Subscriptions</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {subscriptions.slice(0, 5).map((subscription) => (
            <Card key={subscription.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{subscription.tenant.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        subscription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : subscription.status === 'trialing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscription.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {subscription.product.name} - {subscription.pricePlan.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${(subscription.pricePlan.priceCents / 100).toFixed(2)}/{subscription.pricePlan.billingCycle}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Next billing: {new Date(subscription.billingCycleAnchor).toLocaleDateString()}</p>
                    <Link href={`/billing/subscriptions/${subscription.id}`}>
                      <Button variant="outline" size="sm" className="mt-2">
                        Manage
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
            <p className="text-sm text-gray-600">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">
              {subscriptions.filter(s => s.status === 'active').length}
            </div>
            <p className="text-sm text-gray-600">Active Subscriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">
              {subscriptions.filter(s => s.status === 'trialing').length}
            </div>
            <p className="text-sm text-gray-600">Trial Subscriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">
              ${subscriptions.reduce((sum, s) => sum + (s.pricePlan.priceCents / 100), 0).toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
