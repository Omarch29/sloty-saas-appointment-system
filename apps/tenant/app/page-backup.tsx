import { 
  Card, 
  Title, 
  Text, 
  Metric, 
  Badge,
  Grid,
  Flex,
  AreaChart,
  BarChart,
  LineChart,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  ProgressBar
} from "@tremor/react"

export default function Home() {
  // Mock data for a medical clinic dashboard
  const appointmentData = [
    { day: 'Mon', appointments: 24, revenue: 2400 },
    { day: 'Tue', appointments: 18, revenue: 1800 },
    { day: 'Wed', appointments: 32, revenue: 3200 },
    { day: 'Thu', appointments: 28, revenue: 2800 },
    { day: 'Fri', appointments: 35, revenue: 3500 },
    { day: 'Sat', appointments: 12, revenue: 1200 },
    { day: 'Sun', appointments: 8, revenue: 800 },
  ]

  const providerUtilization = [
    { provider: 'Dr. Smith', utilization: 85, appointments: 24 },
    { provider: 'Dr. Johnson', utilization: 92, appointments: 28 },
    { provider: 'Dr. Williams', utilization: 78, appointments: 22 },
    { provider: 'Dr. Brown', utilization: 88, appointments: 26 },
    { provider: 'Dr. Davis', utilization: 73, appointments: 18 },
  ]

  const recentAppointments = [
    { time: '09:00', patient: 'John Doe', provider: 'Dr. Smith', type: 'Consultation', status: 'confirmed' },
    { time: '09:30', patient: 'Jane Smith', provider: 'Dr. Johnson', type: 'Follow-up', status: 'confirmed' },
    { time: '10:00', patient: 'Bob Wilson', provider: 'Dr. Williams', type: 'Check-up', status: 'pending' },
    { time: '10:30', patient: 'Alice Brown', provider: 'Dr. Smith', type: 'Consultation', status: 'confirmed' },
    { time: '11:00', patient: 'Charlie Davis', provider: 'Dr. Brown', type: 'Treatment', status: 'confirmed' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Title>Demo Medical Clinic Dashboard</Title>
        <Text>Manage your appointments, providers, and clinic operations.</Text>
      </div>

      {/* Key Metrics */}
      <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
        <Card>
          <Text>Today's Appointments</Text>
          <Metric>24</Metric>
          <Flex className="mt-4">
            <Text>
              <Badge color="blue" size="sm">
                +12% from yesterday
              </Badge>
            </Text>
          </Flex>
        </Card>
        
        <Card>
          <Text>Active Providers</Text>
          <Metric>8</Metric>
          <Flex className="mt-4">
            <Text className="text-tremor-content-subtle">
              All available today
            </Text>
          </Flex>
        </Card>
        
        <Card>
          <Text>This Week</Text>
          <Metric>157</Metric>
          <Flex className="mt-4">
            <Text>
              <Badge color="emerald" size="sm">
                +8% vs last week
              </Badge>
            </Text>
          </Flex>
        </Card>
        
        <Card>
          <Text>Monthly Revenue</Text>
          <Metric>$18,420</Metric>
          <Flex className="mt-4">
            <Text>
              <Badge color="emerald" size="sm">
                +15% vs last month
              </Badge>
            </Text>
          </Flex>
        </Card>
      </Grid>

      {/* Charts Section */}
      <Grid numItemsLg={2} className="gap-6">
        <Card>
          <Title>Weekly Appointments & Revenue</Title>
          <AreaChart
            className="mt-4 h-72"
            data={appointmentData}
            index="day"
            categories={["appointments", "revenue"]}
            colors={["blue", "emerald"]}
            valueFormatter={(number) => 
              number > 1000 
                ? `$${(number / 1000).toFixed(1)}k` 
                : `${number}`
            }
          />
        </Card>

        <Card>
          <Title>Provider Utilization</Title>
          <div className="mt-4 space-y-4">
            {providerUtilization.map((provider) => (
              <div key={provider.provider}>
                <Flex>
                  <Text>{provider.provider}</Text>
                  <Text>{provider.utilization}%</Text>
                </Flex>
                <ProgressBar 
                  value={provider.utilization} 
                  color={provider.utilization > 85 ? 'emerald' : provider.utilization > 70 ? 'yellow' : 'red'}
                  className="mt-2" 
                />
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* Recent Appointments */}
      <Card>
        <Title>Today's Schedule</Title>
        <Table className="mt-4">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Time</TableHeaderCell>
              <TableHeaderCell>Patient</TableHeaderCell>
              <TableHeaderCell>Provider</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentAppointments.map((appointment, index) => (
              <TableRow key={index}>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.patient}</TableCell>
                <TableCell>{appointment.provider}</TableCell>
                <TableCell>{appointment.type}</TableCell>
                <TableCell>
                  <Badge
                    color={appointment.status === 'confirmed' ? 'emerald' : 'yellow'}
                    size="sm"
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Quick Actions */}
      <Grid numItemsLg={3} className="gap-6">
        <Card className="cursor-pointer hover:bg-tremor-background-muted transition-colors">
          <div className="text-center p-4">
            <Title className="text-lg">Schedule Appointment</Title>
            <Text className="mt-2">Book a new appointment for a patient</Text>
          </div>
        </Card>
        
        <Card className="cursor-pointer hover:bg-tremor-background-muted transition-colors">
          <div className="text-center p-4">
            <Title className="text-lg">Manage Providers</Title>
            <Text className="mt-2">Update provider schedules and availability</Text>
          </div>
        </Card>
        
        <Card className="cursor-pointer hover:bg-tremor-background-muted transition-colors">
          <div className="text-center p-4">
            <Title className="text-lg">View Reports</Title>
            <Text className="mt-2">Access detailed analytics and reports</Text>
          </div>
        </Card>
      </Grid>
    </div>
  )
}
