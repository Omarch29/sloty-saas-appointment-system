import { Button } from "@sloty/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sloty/ui"

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Sloty Superadmin</h1>
        <p className="text-muted-foreground">
          Manage tenants, monitor system health, and configure global settings.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Tenants</CardTitle>
            <CardDescription>Active organizations in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">127</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Appointments</CardTitle>
            <CardDescription>Appointments booked this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,450</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Overall system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">Healthy</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 flex gap-4">
        <Button>Manage Tenants</Button>
        <Button variant="outline">View Analytics</Button>
        <Button variant="secondary">System Settings</Button>
      </div>
    </div>
  )
}
