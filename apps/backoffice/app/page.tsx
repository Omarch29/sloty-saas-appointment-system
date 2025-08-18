"use client"

import { 
  Card, 
  Title, 
  Text, 
  Metric, 
  Badge,
  Grid,
  Flex,
  AreaChart,
  DonutChart,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button
} from "@tremor/react"

export default function Dashboard() {
  // Mock data for the superadmin dashboard
  const revenueData = [
    { month: 'Jan', revenue: 12000, users: 450 },
    { month: 'Feb', revenue: 15000, users: 520 },
    { month: 'Mar', revenue: 18000, users: 600 },
    { month: 'Apr', revenue: 22000, users: 680 },
    { month: 'May', revenue: 25000, users: 750 },
    { month: 'Jun', revenue: 28000, users: 820 },
  ]

  const tenantDistribution = [
    { name: 'Medical Clinics', value: 45, color: 'blue' },
    { name: 'Dental Offices', value: 30, color: 'emerald' },
    { name: 'Veterinary Clinics', value: 15, color: 'amber' },
    { name: 'Beauty Salons', value: 10, color: 'rose' },
  ]

  const recentTenants = [
    { name: 'Downtown Medical Center', type: 'Medical Clinic', plan: 'Pro', status: 'Active', joined: '2025-08-15' },
    { name: 'Smile Dental Care', type: 'Dental Office', plan: 'Basic', status: 'Active', joined: '2025-08-14' },
    { name: 'Pet Care Veterinary', type: 'Vet Clinic', plan: 'Pro', status: 'Active', joined: '2025-08-13' },
    { name: 'Elegant Beauty Salon', type: 'Beauty Salon', plan: 'Basic', status: 'Pending', joined: '2025-08-12' },
    { name: 'Family Health Clinic', type: 'Medical Clinic', plan: 'Enterprise', status: 'Active', joined: '2025-08-11' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Title>Sloty Superadmin Dashboard</Title>
        <Text>Manage tenants, monitor system performance, and oversee the entire platform.</Text>
      </div>

      {/* Key Metrics */}
      <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
        <Card>
          <Text>Total Tenants</Text>
          <Metric>247</Metric>
          <Flex className="mt-4">
            <Text>
              <Badge color="emerald" size="sm">
                +12 this month
              </Badge>
            </Text>
          </Flex>
        </Card>
        
        <Card>
          <Text>Active Users</Text>
          <Metric>15,420</Metric>
          <Flex className="mt-4">
            <Text>
              <Badge color="blue" size="sm">
                +8.5% vs last month
              </Badge>
            </Text>
          </Flex>
        </Card>
        
        <Card>
          <Text>Monthly Revenue</Text>
          <Metric>$284,650</Metric>
          <Flex className="mt-4">
            <Text>
              <Badge color="emerald" size="sm">
                +15.2% vs last month
              </Badge>
            </Text>
          </Flex>
        </Card>
        
        <Card>
          <Text>System Uptime</Text>
          <Metric>99.9%</Metric>
          <Flex className="mt-4">
            <Text className="text-tremor-content-subtle">
              Last 30 days
            </Text>
          </Flex>
        </Card>
      </Grid>

      {/* Charts Section */}
      <Grid numItemsLg={2} className="gap-6">
        <Card>
          <Title>Revenue & User Growth</Title>
          <AreaChart
            className="mt-4 h-72"
            data={revenueData}
            index="month"
            categories={["revenue", "users"]}
            colors={["emerald", "blue"]}
            valueFormatter={(number) => 
              number > 1000 
                ? `$${(number / 1000).toFixed(0)}k` 
                : `${number}`
            }
          />
        </Card>

        <Card>
          <Title>Tenant Distribution</Title>
          <DonutChart
            className="mt-4 h-72"
            data={tenantDistribution}
            category="value"
            index="name"
            colors={["blue", "emerald", "amber", "rose"]}
          />
        </Card>
      </Grid>

      {/* Recent Tenants */}
      <Card>
        <Title>Recent Tenants</Title>
        <Table className="mt-4">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Plan</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Joined</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentTenants.map((tenant, index) => (
              <TableRow key={index}>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>{tenant.type}</TableCell>
                <TableCell>{tenant.plan}</TableCell>
                <TableCell>
                  <Badge
                    color={tenant.status === 'Active' ? 'emerald' : 'yellow'}
                    size="sm"
                  >
                    {tenant.status}
                  </Badge>
                </TableCell>
                <TableCell>{tenant.joined}</TableCell>
                <TableCell>
                  <Button size="xs" variant="secondary">
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Quick Actions */}
      <Grid numItemsLg={4} className="gap-6">
        <Card className="cursor-pointer hover:bg-tremor-background-muted transition-colors">
          <div className="text-center p-4">
            <Title className="text-lg">Add Tenant</Title>
            <Text className="mt-2">Create a new tenant account</Text>
          </div>
        </Card>
        
        <Card className="cursor-pointer hover:bg-tremor-background-muted transition-colors">
          <div className="text-center p-4">
            <Title className="text-lg">System Health</Title>
            <Text className="mt-2">Monitor system performance</Text>
          </div>
        </Card>
        
        <Card className="cursor-pointer hover:bg-tremor-background-muted transition-colors">
          <div className="text-center p-4">
            <Title className="text-lg">Billing Reports</Title>
            <Text className="mt-2">View revenue and billing data</Text>
          </div>
        </Card>
        
        <Card className="cursor-pointer hover:bg-tremor-background-muted transition-colors">
          <div className="text-center p-4">
            <Title className="text-lg">User Analytics</Title>
            <Text className="mt-2">Analyze user behavior and trends</Text>
          </div>
        </Card>
      </Grid>
    </div>
  )
}
