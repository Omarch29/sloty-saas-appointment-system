import * as _prisma_client_runtime_library from '@prisma/client/runtime/library';
import * as _prisma_client from '.prisma/client';
import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

declare global {
    var __prisma: PrismaClient | undefined;
}
declare const db: PrismaClient<_prisma_client.Prisma.PrismaClientOptions, never, _prisma_client_runtime_library.DefaultArgs>;
declare function createTenantClient(tenantId: string): {
    tenant: {
        findFirst: () => _prisma_client.Prisma.Prisma__TenantClient<{
            id: string;
            name: string;
            legalName: string | null;
            billingEmail: string | null;
            defaultCurrency: string;
            timezone: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        } | null, null, _prisma_client_runtime_library.DefaultArgs>;
        update: (data: any) => _prisma_client.Prisma.Prisma__TenantClient<{
            id: string;
            name: string;
            legalName: string | null;
            billingEmail: string | null;
            defaultCurrency: string;
            timezone: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
    };
    users: {
        findMany: (args?: any) => _prisma_client.Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            role: string;
            passwordHash: string | null;
            externalIdentityProvider: string | null;
            externalSubject: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
        }[]>;
        findFirst: (args?: any) => _prisma_client.Prisma.Prisma__UserClient<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            role: string;
            passwordHash: string | null;
            externalIdentityProvider: string | null;
            externalSubject: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
        } | null, null, _prisma_client_runtime_library.DefaultArgs>;
        create: (data: any) => _prisma_client.Prisma.Prisma__UserClient<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            role: string;
            passwordHash: string | null;
            externalIdentityProvider: string | null;
            externalSubject: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
        update: (args: any) => _prisma_client.Prisma.Prisma__UserClient<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            role: string;
            passwordHash: string | null;
            externalIdentityProvider: string | null;
            externalSubject: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
        delete: (args: any) => _prisma_client.Prisma.Prisma__UserClient<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            role: string;
            passwordHash: string | null;
            externalIdentityProvider: string | null;
            externalSubject: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
    };
    providers: {
        findMany: (args?: any) => _prisma_client.Prisma.PrismaPromise<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isActive: boolean;
            displayName: string | null;
            licenseNumber: string | null;
        }[]>;
        findFirst: (args?: any) => _prisma_client.Prisma.Prisma__ProviderClient<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isActive: boolean;
            displayName: string | null;
            licenseNumber: string | null;
        } | null, null, _prisma_client_runtime_library.DefaultArgs>;
        create: (data: any) => _prisma_client.Prisma.Prisma__ProviderClient<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isActive: boolean;
            displayName: string | null;
            licenseNumber: string | null;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
        update: (args: any) => _prisma_client.Prisma.Prisma__ProviderClient<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isActive: boolean;
            displayName: string | null;
            licenseNumber: string | null;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
        delete: (args: any) => _prisma_client.Prisma.Prisma__ProviderClient<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isActive: boolean;
            displayName: string | null;
            licenseNumber: string | null;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
    };
    services: {
        findMany: (args?: any) => _prisma_client.Prisma.PrismaPromise<{
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isActive: boolean;
            description: string | null;
            specialtyId: string | null;
            defaultDurationMinutes: number;
            defaultCapacity: number;
        }[]>;
        findFirst: (args?: any) => _prisma_client.Prisma.Prisma__ServiceClient<{
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isActive: boolean;
            description: string | null;
            specialtyId: string | null;
            defaultDurationMinutes: number;
            defaultCapacity: number;
        } | null, null, _prisma_client_runtime_library.DefaultArgs>;
        create: (data: any) => _prisma_client.Prisma.Prisma__ServiceClient<{
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isActive: boolean;
            description: string | null;
            specialtyId: string | null;
            defaultDurationMinutes: number;
            defaultCapacity: number;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
        update: (args: any) => _prisma_client.Prisma.Prisma__ServiceClient<{
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isActive: boolean;
            description: string | null;
            specialtyId: string | null;
            defaultDurationMinutes: number;
            defaultCapacity: number;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
        delete: (args: any) => _prisma_client.Prisma.Prisma__ServiceClient<{
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isActive: boolean;
            description: string | null;
            specialtyId: string | null;
            defaultDurationMinutes: number;
            defaultCapacity: number;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
    };
    appointments: {
        findMany: (args?: any) => _prisma_client.Prisma.PrismaPromise<{
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            locationId: string;
            providerId: string;
            resourceId: string | null;
            serviceId: string;
            startAt: Date;
            endAt: Date;
            priceCents: number | null;
            notesPublic: string | null;
            notesInternal: string | null;
            createdByUserId: string | null;
        }[]>;
        findFirst: (args?: any) => _prisma_client.Prisma.Prisma__AppointmentClient<{
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            locationId: string;
            providerId: string;
            resourceId: string | null;
            serviceId: string;
            startAt: Date;
            endAt: Date;
            priceCents: number | null;
            notesPublic: string | null;
            notesInternal: string | null;
            createdByUserId: string | null;
        } | null, null, _prisma_client_runtime_library.DefaultArgs>;
        create: (data: any) => _prisma_client.Prisma.Prisma__AppointmentClient<{
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            locationId: string;
            providerId: string;
            resourceId: string | null;
            serviceId: string;
            startAt: Date;
            endAt: Date;
            priceCents: number | null;
            notesPublic: string | null;
            notesInternal: string | null;
            createdByUserId: string | null;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
        update: (args: any) => _prisma_client.Prisma.Prisma__AppointmentClient<{
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            locationId: string;
            providerId: string;
            resourceId: string | null;
            serviceId: string;
            startAt: Date;
            endAt: Date;
            priceCents: number | null;
            notesPublic: string | null;
            notesInternal: string | null;
            createdByUserId: string | null;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
        delete: (args: any) => _prisma_client.Prisma.Prisma__AppointmentClient<{
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            locationId: string;
            providerId: string;
            resourceId: string | null;
            serviceId: string;
            startAt: Date;
            endAt: Date;
            priceCents: number | null;
            notesPublic: string | null;
            notesInternal: string | null;
            createdByUserId: string | null;
        }, never, _prisma_client_runtime_library.DefaultArgs>;
    };
};
type TenantClient = ReturnType<typeof createTenantClient>;

export { type TenantClient, createTenantClient, db };
