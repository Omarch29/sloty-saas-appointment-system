import { Button } from "@sloty/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sloty/ui"
import { db } from "@sloty/db"
import Link from "next/link"

export default async function Home() {
  // Fetch dashboard stats
  const [
    totalTenants,
    activeTenants,
    totalUsers,
    totalSubscriptions,
    activeSubscriptions,
    totalAppointments
  ] = await Promise.all([
    db.tenant.count(),
    db.tenant.count({ where: { status: 'active' } }),
    db.user.count(),
    db.subscription.count(),
    db.subscription.count({ where: { status: { in: ['active', 'trialing'] } } }),
    db.appointment.count()
  ])

  // Calculate monthly revenue from active subscriptions
  const subscriptions = await db.subscription.findMany({
    where: { status: { in: ['active', 'trialing'] } },
    include: { pricePlan: { select: { priceCents: true } } }
  })
  
  const monthlyRevenue = subscriptions.reduce((sum, sub) => sum + (sub.pricePlan.priceCents / 100), 0)

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Sloty Superadmin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage tenants, monitor system health, and configure global settings.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Tenants</CardTitle>
            <CardDescription>Organizations in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTenants}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {activeTenants} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Registered users across all tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>Active billing subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeSubscriptions}</div>
            <p className="text-sm text-muted-foreground mt-2">
              of {totalSubscriptions} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>From active subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${monthlyRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>System Stats</CardTitle>
            <CardDescription>Overall system metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Appointments</span>
                <span className="font-medium">{totalAppointments.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Average per Tenant</span>
                <span className="font-medium">
                  {activeTenants > 0 ? Math.round(totalAppointments / activeTenants) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>System Health</span>
                <span className="font-medium text-green-600">Healthy</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/tenants/create">
              <Button className="w-full justify-start" variant="outline">
                Create New Tenant
              </Button>
            </Link>
            <Link href="/billing/products/create">
              <Button className="w-full justify-start" variant="outline">
                Create Product
              </Button>
            </Link>
            <Link href="/billing/subscriptions/assign">
              <Button className="w-full justify-start" variant="outline">
                Assign Subscription
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex gap-4">
        <Link href="/tenants">
          <Button>Manage Tenants</Button>
        </Link>
        <Link href="/billing">
          <Button variant="outline">View Billing</Button>
        </Link>
        <Button variant="secondary">System Settings</Button>
      </div>
    </div>
  )
}
