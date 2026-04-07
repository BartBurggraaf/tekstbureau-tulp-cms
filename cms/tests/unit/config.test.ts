import { describe, it, expect, beforeEach } from 'vitest'

describe('config/theme.ts', () => {
  beforeEach(() => {
    // Clear any env overrides between tests
    delete process.env.NEXT_PUBLIC_BRAND_PRIMARY
    delete process.env.NEXT_PUBLIC_BRAND_FONT_HEADLINE
    delete process.env.NEXT_PUBLIC_BRAND_FONT_BODY
    delete process.env.NEXT_PUBLIC_BRAND_LOGO
  })

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

  it('applies NEXT_PUBLIC_BRAND_PRIMARY env override', async () => {
    process.env.NEXT_PUBLIC_BRAND_PRIMARY = '#ff0000'
    // Re-import to pick up env change
    const mod = await import('../../config/theme?override=' + Date.now())
    expect(mod.theme.colors.primary).toBe('#ff0000')
  })

  it('applies font env overrides', async () => {
    process.env.NEXT_PUBLIC_BRAND_FONT_HEADLINE = 'Playfair Display'
    process.env.NEXT_PUBLIC_BRAND_FONT_BODY = 'DM Sans'
    const mod = await import('../../config/theme?font=' + Date.now())
    expect(mod.theme.fonts.headline).toBe('Playfair Display')
    expect(mod.theme.fonts.body).toBe('DM Sans')
  })
})

describe('config/site.ts', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_CMS_NAME
    delete process.env.NEXT_PUBLIC_CMS_TAGLINE
    delete process.env.NEXT_PUBLIC_CMS_DOMAIN
  })

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

  it('applies NEXT_PUBLIC_CMS_NAME env override', async () => {
    process.env.NEXT_PUBLIC_CMS_NAME = 'Acme Admin'
    const mod = await import('../../config/site?name=' + Date.now())
    expect(mod.site.name).toBe('Acme Admin')
  })
})
