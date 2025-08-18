"use client"

import { 
  Card, 
  Title, 
  Text, 
  Badge,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button,
  TextInput
} from "@tremor/react"
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline"

export default function TenantsPage() {
  // Mock data for demonstration - in production, use client-side data fetching or server components
  const tenants = [
    {
      id: 'tenant-1',
      name: 'Downtown Medical Center',
      status: 'active',
      _count: { users: 12, appointments: 245 },
      createdAt: new Date('2025-08-01')
    },
    {
      id: 'tenant-2', 
      name: 'Smile Dental Care',
      status: 'active',
      _count: { users: 8, appointments: 156 },
      createdAt: new Date('2025-07-15')
    },
    {
      id: 'tenant-3',
      name: 'Pet Care Veterinary',
      status: 'active',
      _count: { users: 6, appointments: 98 },
      createdAt: new Date('2025-07-20')
    },
    {
      id: 'tenant-4',
      name: 'Family Health Clinic',
      status: 'inactive',
      _count: { users: 15, appointments: 320 },
      createdAt: new Date('2025-06-10')
    },
    {
      id: 'tenant-5',
      name: 'Elegant Beauty Salon',
      status: 'active',
      _count: { users: 4, appointments: 67 },
      createdAt: new Date('2025-08-05')
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title>Tenant Management</Title>
          <Text>Manage and monitor all tenants in the system.</Text>
        </div>
        <Button icon={PlusIcon} color="blue">
          Add Tenant
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Text className="mb-2">Search</Text>
            <TextInput
              icon={MagnifyingGlassIcon}
              placeholder="Search tenants..."
            />
          </div>
          <div>
            <Text className="mb-2">Status Filter</Text>
            <Button variant="secondary" className="w-full">
              All Statuses
            </Button>
          </div>
          <div className="flex items-end">
            <Button color="blue" className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Tenants Table */}
      <Card>
        <Title>All Tenants ({tenants.length})</Title>
        <Table className="mt-4">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Users</TableHeaderCell>
              <TableHeaderCell>Appointments</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>
                  <div>
                    <Text className="font-medium">{tenant.name}</Text>
                    <Text className="text-xs text-tremor-content-subtle">{tenant.id}</Text>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    color={tenant.status === 'active' ? 'emerald' : 'red'}
                    size="sm"
                  >
                    {tenant.status}
                  </Badge>
                </TableCell>
                <TableCell>{tenant._count.users}</TableCell>
                <TableCell>{tenant._count.appointments}</TableCell>
                <TableCell>
                  {tenant.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="xs" variant="light" color="blue">
                      View
                    </Button>
                    <Button size="xs" variant="light" color="amber">
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Text>Total Tenants</Text>
          <Title>{tenants.length}</Title>
        </Card>
        <Card>
          <Text>Active Tenants</Text>
          <Title>{tenants.filter(t => t.status === 'active').length}</Title>
        </Card>
        <Card>
          <Text>Total Users</Text>
          <Title>{tenants.reduce((sum, t) => sum + t._count.users, 0)}</Title>
        </Card>
      </div>
    </div>
  )
}
