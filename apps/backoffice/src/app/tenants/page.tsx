import { Button } from "@sloty/ui"
import { Card, CardHeader, CardTitle, CardContent } from "@sloty/ui"
import { db } from "@sloty/db"
import Link from "next/link"

export default async function TenantsPage() {
  const tenants = await db.tenant.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      users: {
        where: { role: 'admin' },
        select: { id: true, email: true, firstName: true, lastName: true }
      },
      _count: {
        select: { users: true, appointments: true }
      }
    }
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tenants</h1>
        <Link href="/tenants/create">
          <Button>Create Tenant</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {tenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{tenant.name}</span>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    tenant.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tenant.status}
                  </span>
                  <Link href={`/tenants/${tenant.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Legal Name</p>
                  <p>{tenant.legalName || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Timezone</p>
                  <p>{tenant.timezone}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Currency</p>
                  <p>{tenant.defaultCurrency}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Users</p>
                  <p>{tenant._count.users} users</p>
                </div>
              </div>
              
              {tenant.users.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="font-medium text-gray-500 mb-2">Admins</p>
                  <div className="flex flex-wrap gap-2">
                    {tenant.users.map((user) => (
                      <span key={user.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {user.firstName} {user.lastName} ({user.email})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {tenants.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No tenants found</p>
            <Link href="/tenants/create">
              <Button>Create your first tenant</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
