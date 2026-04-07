import { describe, it, expect, beforeAll } from 'vitest'

/**
 * Supabase connectivity tests
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * to be set in the environment (loaded from .env.local by vitest setup).
 */

function loadEnv() {
  const fs = require('fs')
  const path = require('path')
  try {
    const file = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8')
    for (const line of file.split('\n')) {
      const [key, ...rest] = line.split('=')
      if (key?.trim() && rest.length) {
        process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '')
      }
    }
  } catch { /* ignore */ }
}

describe('Supabase connection', () => {
  beforeAll(() => loadEnv())

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
    // unauthenticated query — RLS will return empty, but no connection error
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
