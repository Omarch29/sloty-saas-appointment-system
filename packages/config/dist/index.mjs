// src/index.ts
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
export {
  appConfig,
  envConfig
};
