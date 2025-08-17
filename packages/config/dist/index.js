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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  appConfig: () => appConfig,
  envConfig: () => envConfig
});
module.exports = __toCommonJS(index_exports);
var envConfig = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "development-secret",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000"
};
var appConfig = {
  superadmin: {
    port: 3e3,
    name: "Sloty Superadmin",
    description: "Superadmin interface for managing tenants and global settings"
  },
  tenant: {
    port: 3001,
    name: "Sloty Tenant",
    description: "Tenant backoffice for managing appointments and providers"
  },
  booking: {
    port: 3002,
    name: "Sloty Booking",
    description: "Customer booking interface"
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  appConfig,
  envConfig
});
