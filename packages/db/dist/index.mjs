// src/index.ts
import { PrismaClient } from "@prisma/client";
export * from "@prisma/client";
var db = globalThis.__prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = db;
}
function createTenantClient(tenantId) {
  return {
    // Extend the base client with tenant-specific methods
    tenant: {
      findFirst: () => db.tenant.findFirst({ where: { id: tenantId } }),
      update: (data) => db.tenant.update({ where: { id: tenantId }, data })
    },
    users: {
      findMany: (args) => db.user.findMany({ ...args, where: { ...args?.where, tenantId } }),
      findFirst: (args) => db.user.findFirst({ ...args, where: { ...args?.where, tenantId } }),
      create: (data) => db.user.create({ data: { ...data, tenantId } }),
      update: (args) => db.user.update({
        ...args,
        where: { ...args.where, tenantId }
      }),
      delete: (args) => db.user.delete({
        ...args,
        where: { ...args.where, tenantId }
      })
    },
    providers: {
      findMany: (args) => db.provider.findMany({ ...args, where: { ...args?.where, tenantId } }),
      findFirst: (args) => db.provider.findFirst({ ...args, where: { ...args?.where, tenantId } }),
      create: (data) => db.provider.create({ data: { ...data, tenantId } }),
      update: (args) => db.provider.update({
        ...args,
        where: { ...args.where, tenantId }
      }),
      delete: (args) => db.provider.delete({
        ...args,
        where: { ...args.where, tenantId }
      })
    },
    services: {
      findMany: (args) => db.service.findMany({ ...args, where: { ...args?.where, tenantId } }),
      findFirst: (args) => db.service.findFirst({ ...args, where: { ...args?.where, tenantId } }),
      create: (data) => db.service.create({ data: { ...data, tenantId } }),
      update: (args) => db.service.update({
        ...args,
        where: { ...args.where, tenantId }
      }),
      delete: (args) => db.service.delete({
        ...args,
        where: { ...args.where, tenantId }
      })
    },
    appointments: {
      findMany: (args) => db.appointment.findMany({ ...args, where: { ...args?.where, tenantId } }),
      findFirst: (args) => db.appointment.findFirst({ ...args, where: { ...args?.where, tenantId } }),
      create: (data) => db.appointment.create({ data: { ...data, tenantId } }),
      update: (args) => db.appointment.update({
        ...args,
        where: { ...args.where, tenantId }
      }),
      delete: (args) => db.appointment.delete({
        ...args,
        where: { ...args.where, tenantId }
      })
    }
  };
}
export {
  createTenantClient,
  db
};
