"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createTenantClient: () => createTenantClient,
  db: () => db
});
module.exports = __toCommonJS(index_exports);
var import_client = require("@prisma/client");
__reExport(index_exports, require("@prisma/client"), module.exports);
var db = globalThis.__prisma || new import_client.PrismaClient();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createTenantClient,
  db,
  ...require("@prisma/client")
});
