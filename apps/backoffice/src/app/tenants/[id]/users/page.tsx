import { Button } from "@sloty/ui"
import { Card, CardHeader, CardTitle, CardContent } from "@sloty/ui"
import { db } from "@sloty/db"
import Link from "next/link"

interface Props {
  params: { id: string }
}

export default async function TenantUsersPage({ params }: Props) {
  const tenantId = params.id

  const [tenant, users] = await Promise.all([
    db.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, name: true, status: true }
    }),
    db.user.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    })
  ])

  if (!tenant) {
    return <div>Tenant not found</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Users - {tenant.name}</h1>
            <p className="text-gray-600 mt-2">Manage tenant users and invitations</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/tenants/${tenantId}/users/invite`}>
              <Button>Invite User</Button>
            </Link>
            <Link href={`/tenants/${tenantId}/edit`}>
              <Button variant="outline">Back to Tenant</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <span>{user.firstName} {user.lastName}</span>
                  <span className="text-sm font-normal text-gray-500 ml-2">({user.email})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.role === 'admin' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                  <Link href={`/tenants/${tenantId}/users/${user.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Role</p>
                  <p className="capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Last Login</p>
                  <p>
                    {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Created</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">External Auth</p>
                  <p>{user.externalIdentityProvider || 'None'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No users found for this tenant</p>
            <Link href={`/tenants/${tenantId}/users/invite`}>
              <Button>Invite the first user</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
