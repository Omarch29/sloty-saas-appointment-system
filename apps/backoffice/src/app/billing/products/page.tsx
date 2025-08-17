import { Button } from "@sloty/ui"
import { Card, CardHeader, CardTitle, CardContent } from "@sloty/ui"
import { db } from "@sloty/db"
import Link from "next/link"

export default async function ProductsPage() {
  const products = await db.product.findMany({
    include: {
      pricePlans: {
        orderBy: { priceCents: 'asc' }
      },
      _count: {
        select: { subscriptions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/billing/products/create">
          <Button>Create Product</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {products.map((product) => (
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
                  <Link href={`/billing/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">Price Plans</h4>
                <div className="space-y-2">
                  {product.pricePlans.map((plan) => (
                    <div key={plan.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-sm text-gray-500">
                          {plan.includesSeats} seat{plan.includesSeats !== 1 ? 's' : ''} included
                          {plan.includesAppointmentsPerMonth && (
                            <span> • {plan.includesAppointmentsPerMonth} appointments/month</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${(plan.priceCents / 100).toFixed(2)}/{plan.billingCycle}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          plan.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {product.pricePlans.length === 0 && (
                  <p className="text-gray-500 text-sm">No price plans configured</p>
                )}
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No products found</p>
            <Link href="/billing/products/create">
              <Button>Create your first product</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
