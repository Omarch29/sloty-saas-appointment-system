import { Button } from "@sloty/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@sloty/ui"

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Book Your Appointment</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose from our available services and schedule your appointment with our healthcare professionals.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>General Consultation</CardTitle>
            <CardDescription>30 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive health check-up and consultation with our experienced physicians.
            </p>
            <Button className="w-full">Book Now</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dental Checkup</CardTitle>
            <CardDescription>45 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Complete dental examination including cleaning and preventive care.
            </p>
            <Button className="w-full">Book Now</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Specialist Consultation</CardTitle>
            <CardDescription>60 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Specialized medical consultation for specific health conditions.
            </p>
            <Button className="w-full">Book Now</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center">
        <Button size="lg">View All Services</Button>
      </div>
    </div>
  )
}
