import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

export const db = globalThis.__prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = db
}

// Tenant-guarded client factory
export function createTenantClient(tenantId: string) {
  return {
    // Extend the base client with tenant-specific methods
    tenant: {
      findFirst: () => db.tenant.findFirst({ where: { id: tenantId } }),
      update: (data: any) => db.tenant.update({ where: { id: tenantId }, data }),
    },
    users: {
      findMany: (args?: any) => 
        db.user.findMany({ ...args, where: { ...args?.where, tenantId } }),
      findFirst: (args?: any) => 
        db.user.findFirst({ ...args, where: { ...args?.where, tenantId } }),
      create: (data: any) => 
        db.user.create({ data: { ...data, tenantId } }),
      update: (args: any) => 
        db.user.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        db.user.delete({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
    },
    providers: {
      findMany: (args?: any) => 
        db.provider.findMany({ ...args, where: { ...args?.where, tenantId } }),
      findFirst: (args?: any) => 
        db.provider.findFirst({ ...args, where: { ...args?.where, tenantId } }),
      create: (data: any) => 
        db.provider.create({ data: { ...data, tenantId } }),
      update: (args: any) => 
        db.provider.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        db.provider.delete({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
    },
    services: {
      findMany: (args?: any) => 
        db.service.findMany({ ...args, where: { ...args?.where, tenantId } }),
      findFirst: (args?: any) => 
        db.service.findFirst({ ...args, where: { ...args?.where, tenantId } }),
      create: (data: any) => 
        db.service.create({ data: { ...data, tenantId } }),
      update: (args: any) => 
        db.service.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        db.service.delete({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
    },
    appointments: {
      findMany: (args?: any) => 
        db.appointment.findMany({ ...args, where: { ...args?.where, tenantId } }),
      findFirst: (args?: any) => 
        db.appointment.findFirst({ ...args, where: { ...args?.where, tenantId } }),
      create: (data: any) => 
        db.appointment.create({ data: { ...data, tenantId } }),
      update: (args: any) => 
        db.appointment.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        db.appointment.delete({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
    },
  }
}

export type TenantClient = ReturnType<typeof createTenantClient>

export * from '@prisma/client'
