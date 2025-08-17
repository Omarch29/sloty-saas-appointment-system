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

// Slot Engine Types
export interface TimeSlot {
  startTime: Date
  endTime: Date
  available: boolean
}

export interface Service {
  name: string
  duration: number // in minutes
}

// Simple slot generation function
export function generateSlots(service: Service, startDate: Date): TimeSlot[] {
  if (service.duration <= 0) {
    return []
  }

  const slots: TimeSlot[] = []
  const currentDate = new Date(startDate)
  
  // Generate slots for a 9-hour work day (9 AM to 6 PM)
  const startHour = 9
  const endHour = 18
  const slotDurationMs = service.duration * 60 * 1000
  
  // Set start time to 9 AM
  currentDate.setHours(startHour, 0, 0, 0)
  const endTime = new Date(currentDate)
  endTime.setHours(endHour, 0, 0, 0)
  
  while (currentDate < endTime) {
    const slotStart = new Date(currentDate)
    const slotEnd = new Date(currentDate.getTime() + slotDurationMs)
    
    // Stop if the slot would go beyond working hours
    if (slotEnd > endTime) {
      break
    }
    
    slots.push({
      startTime: slotStart,
      endTime: slotEnd,
      available: true, // Default to available
    })
    
    currentDate.setTime(currentDate.getTime() + slotDurationMs)
  }
  
  return slots
}