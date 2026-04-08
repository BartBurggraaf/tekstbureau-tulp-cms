/**
 * Veltra CMS — setup script
 * Run: npm run setup -- <email> <password> [display_name]
 *
 * Credentials can also be passed via environment variables:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 *
 * What it does:
 *  1. Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local
 *  2. Runs all SQL files in supabase/migrations/ in order
 *  3. Creates the first admin user via the Supabase Admin API
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'

// ── Load env ──────────────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
    for (const line of envFile.split('\n')) {
      const [key, ...rest] = line.split('=')
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '')
      }
    }
  } catch {
    // .env.local not found — rely on actual environment variables
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  loadEnv()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('\nMissing environment variables.\n')
    console.error('Make sure .env.local contains:')
    console.error('  NEXT_PUBLIC_SUPABASE_URL=...')
    console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=...')
    console.error('  SUPABASE_SERVICE_ROLE_KEY=...\n')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // 1. Run all SQL migrations via Supabase Management API
  const migrationsDir = resolve(process.cwd(), 'supabase/migrations')
  const migrationFiles = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  console.log(`\nRunning database migrations… (${migrationFiles.length} file(s))`)

  const accessToken = process.env.SUPABASE_ACCESS_TOKEN
  const projectRef  = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]

  if (!accessToken || !projectRef) {
    console.warn('  Note: SUPABASE_ACCESS_TOKEN not set — skipping automatic migration.')
    console.warn('  Add it to .env.local or run the SQL files manually in the Supabase dashboard:')
    migrationFiles.forEach(f => console.warn(`    supabase/migrations/${f}`))
    console.warn()
  } else {
    for (const file of migrationFiles) {
      const sql = readFileSync(resolve(migrationsDir, file), 'utf-8')
      process.stdout.write(`  Running ${file}… `)
      const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql }),
      })
      if (!res.ok) {
        const body = await res.text()
        console.warn(`failed: ${body}`)
        console.warn('  You may need to run it manually in the Supabase SQL editor.\n')
      } else {
        console.log('done')
      }
    }
  }

  // 2. Resolve admin credentials — CLI args take priority, then env vars
  // Usage: npm run setup -- email@example.com password "Display Name"
  const [,, argEmail, argPassword, ...nameParts] = process.argv
  const email    = argEmail    ?? process.env.ADMIN_EMAIL
  const password = argPassword ?? process.env.ADMIN_PASSWORD
  const name     = nameParts.join(' ') || process.env.ADMIN_NAME || 'Admin'

  if (!email || !password) {
    console.error('\nAdmin credentials required.\n')
    console.error('Pass them as CLI arguments:')
    console.error('  npm run setup -- admin@example.com P@ssw0rd "Display Name"\n')
    console.error('Or set environment variables before running:')
    console.error('  ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=P@ssw0rd npm run setup\n')
    process.exit(1)
  }

  // 3. Create admin user via Supabase Admin API
  console.log('\nCreating admin user…')
  const { data, error: signUpError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: name },
  })

  if (signUpError) {
    console.error('\nFailed to create user:', signUpError.message)
    process.exit(1)
  }

  // 4. Promote to admin role
  const { error: roleError } = await supabase
    .from('profiles')
    .update({ role: 'admin', display_name: name })
    .eq('id', data.user.id)

  if (roleError) {
    console.warn('  User created but could not set admin role:', roleError.message)
    console.warn(`  Run manually: UPDATE profiles SET role='admin' WHERE id='${data.user.id}';`)
  } else {
    console.log(`  Admin user created: ${email}`)
  }

  console.log('\nSetup complete. Run `npm run dev` to start the CMS.\n')
}

main().catch(err => { console.error(err); process.exit(1) })
