import { describe, it, expect } from 'vitest'
import { buttonVariants } from './button'

describe('Button Component', () => {
  it('should generate correct default classes', () => {
    const classes = buttonVariants()
    expect(classes).toContain('inline-flex')
    expect(classes).toContain('items-center')
    expect(classes).toContain('justify-center')
    expect(classes).toContain('bg-primary')
    expect(classes).toContain('h-10')
  })

  it('should apply destructive variant classes', () => {
    const classes = buttonVariants({ variant: 'destructive' })
    expect(classes).toContain('bg-destructive')
    expect(classes).toContain('text-destructive-foreground')
  })

  it('should apply large size classes', () => {
    const classes = buttonVariants({ size: 'lg' })
    expect(classes).toContain('h-11')
    expect(classes).toContain('px-8')
  })

  it('should apply small size classes', () => {
    const classes = buttonVariants({ size: 'sm' })
    expect(classes).toContain('h-9')
    expect(classes).toContain('px-3')
  })

  it('should combine custom className', () => {
    const classes = buttonVariants({ className: 'custom-class' })
    expect(classes).toContain('custom-class')
    expect(classes).toContain('inline-flex') // base classes should still be there
  })
})
