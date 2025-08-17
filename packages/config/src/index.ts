export const envConfig = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "development-secret",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
}

export const appConfig = {
  superadmin: {
    port: 3000,
    name: "Sloty Superadmin",
    description: "Superadmin interface for managing tenants and global settings",
  },
  tenant: {
    port: 3001,
    name: "Sloty Tenant",
    description: "Tenant backoffice for managing appointments and providers",
  },
  booking: {
    port: 3002,
    name: "Sloty Booking",
    description: "Customer booking interface",
  },
}
