import { describe, it, expect } from 'vitest'

/**
 * Supabase connectivity tests
 * In CI: env vars are injected via GitHub Actions secrets.
 * Locally: env vars are loaded from .env.local via vitest.config.ts envFile.
 */

describe('Supabase connection', () => {
  it('has SUPABASE_URL env var set', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeTruthy()
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toMatch(/^https:\/\/.+\.supabase\.co$/)
  })

  it('has SUPABASE_ANON_KEY env var set', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeTruthy()
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.length).toBeGreaterThan(100)
  })

  it('can connect to Supabase and reach the database', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { error } = await supabase.from('profiles').select('id').limit(1)
    expect(error).toBeNull()
  })

  it('required tables exist', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const tables = ['profiles', 'pages', 'blog_posts', 'media', 'form_submissions', 'activity_log', 'seo_settings']
    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(0)
      expect(error, `table "${table}" should exist`).toBeNull()
    }
  })

  it('seo_settings has a default row', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data, error } = await supabase.from('seo_settings').select('*')
    expect(error).toBeNull()
    expect(data!.length).toBeGreaterThanOrEqual(1)
  })
})
