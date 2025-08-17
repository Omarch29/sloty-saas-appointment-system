import { Button } from "@sloty/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sloty/ui"

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Demo Medical Clinic</h1>
        <p className="text-muted-foreground">
          Manage your appointments, providers, and services.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>Scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Providers</CardTitle>
            <CardDescription>Available healthcare providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
            <CardDescription>Appointments this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">127</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>This month's revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$12,450</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 flex gap-4">
        <Button>New Appointment</Button>
        <Button variant="outline">Manage Providers</Button>
        <Button variant="secondary">View Calendar</Button>
      </div>
    </div>
  )
}
