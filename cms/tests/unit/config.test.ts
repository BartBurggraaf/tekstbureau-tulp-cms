import { describe, it, expect } from 'vitest'

describe('config/theme.ts', () => {

  it('exports a theme object with required keys', async () => {
    const { theme } = await import('../../config/theme')
    expect(theme).toHaveProperty('colors')
    expect(theme).toHaveProperty('fonts')
    expect(theme).toHaveProperty('radius')
    expect(theme).toHaveProperty('sidebarWidth')
    expect(theme).toHaveProperty('logo')
  })

  it('has all required color tokens', async () => {
    const { theme } = await import('../../config/theme')
    const required = [
      'primary', 'primaryDim', 'onPrimary',
      'surface', 'surfaceContainerLowest', 'surfaceContainerLow',
      'surfaceContainer', 'surfaceContainerHigh',
      'onSurface', 'onSurfaceVariant',
      'outline', 'error', 'background',
    ]
    for (const key of required) {
      expect(theme.colors).toHaveProperty(key, expect.any(String))
    }
  })

  it('all color values are valid hex strings', async () => {
    const { theme } = await import('../../config/theme')
    const hexPattern = /^#[0-9a-fA-F]{3,8}$/
    for (const [key, value] of Object.entries(theme.colors)) {
      expect(value, `color "${key}" should be a hex string`).toMatch(hexPattern)
    }
  })

  it('has valid font names', async () => {
    const { theme } = await import('../../config/theme')
    expect(typeof theme.fonts.headline).toBe('string')
    expect(theme.fonts.headline.length).toBeGreaterThan(0)
    expect(typeof theme.fonts.body).toBe('string')
    expect(theme.fonts.body.length).toBeGreaterThan(0)
  })

  it('primary color matches brand.ts', async () => {
    const { theme } = await import('../../config/theme')
    const { brand } = await import('../../config/brand')
    expect(theme.colors.primary).toBe(brand.primary)
    expect(theme.colors.primaryDim).toBe(brand.primaryDim)
    expect(theme.colors.onPrimary).toBe(brand.onPrimary)
    expect(theme.colors.surfaceTint).toBe(brand.primary)
  })

  it('fonts match brand.ts', async () => {
    const { theme } = await import('../../config/theme')
    const { brand } = await import('../../config/brand')
    expect(theme.fonts.headline).toBe(brand.fontHeadline)
    expect(theme.fonts.body).toBe(brand.fontBody)
  })

  it('logo matches brand.ts', async () => {
    const { theme } = await import('../../config/theme')
    const { brand } = await import('../../config/brand')
    expect(theme.logo).toBe(brand.logo)
  })
})

describe('config/site.ts', () => {

  it('exports a site object with required keys', async () => {
    const { site } = await import('../../config/site')
    expect(site).toHaveProperty('name')
    expect(site).toHaveProperty('tagline')
    expect(site).toHaveProperty('domain')
    expect(site).toHaveProperty('features')
    expect(site).toHaveProperty('nav')
  })

  it('nav contains dashboard and manual entries', async () => {
    const { site } = await import('../../config/site')
    const keys = site.nav.map(n => n.key)
    expect(keys).toContain('dashboard')
    expect(keys).toContain('manual')
  })

  it('nav entries all have required fields', async () => {
    const { site } = await import('../../config/site')
    for (const item of site.nav) {
      expect(item).toHaveProperty('key', expect.any(String))
      expect(item).toHaveProperty('label', expect.any(String))
      expect(item).toHaveProperty('icon', expect.any(String))
      expect(item).toHaveProperty('href', expect.any(String))
      expect(item.href).toMatch(/^\//)
    }
  })

  it('all feature keys have a corresponding nav entry', async () => {
    const { site } = await import('../../config/site')
    const navKeys = site.nav.map(n => n.key)
    for (const featureKey of Object.keys(site.features)) {
      expect(navKeys).toContain(featureKey)
    }
  })

  it('name, tagline and domain match brand.ts', async () => {
    const { site } = await import('../../config/site')
    const { brand } = await import('../../config/brand')
    expect(site.name).toBe(brand.name)
    expect(site.tagline).toBe(brand.tagline)
    expect(site.domain).toBe(brand.domain)
  })
})
