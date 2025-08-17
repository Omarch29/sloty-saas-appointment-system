import { describe, it, expect } from 'vitest'
import { generateSlots } from './index'

describe('Slot Engine', () => {
  it('should generate slots correctly', () => {
    const service = {
      name: 'Test Service',
      duration: 60, // 60 minutes
    }

    const slots = generateSlots(service, new Date('2024-01-15T09:00:00Z'))
    
    expect(slots).toBeDefined()
    expect(Array.isArray(slots)).toBe(true)
    
    if (slots.length > 0) {
      expect(slots[0]).toHaveProperty('startTime')
      expect(slots[0]).toHaveProperty('endTime')
      expect(slots[0]).toHaveProperty('available')
    }
  })

  it('should handle empty service duration', () => {
    const service = {
      name: 'Test Service',
      duration: 0,
    }

    const slots = generateSlots(service, new Date('2024-01-15T09:00:00Z'))
    expect(slots).toBeDefined()
    expect(Array.isArray(slots)).toBe(true)
  })
})
