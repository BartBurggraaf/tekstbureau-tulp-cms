/**
 * Burgt CMS — setup script
 * Run: npm run setup
 *
 * What it does:
 *  1. Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local
 *  2. Runs supabase/migrations/001_init.sql against the database
 *  3. Creates the first admin user (prompts for email + password)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import * as readline from 'readline'

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

function prompt(question: string, hidden = false): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    if (hidden && process.stdout.isTTY) {
      process.stdout.write(question)
      process.stdin.setRawMode(true)
      let input = ''
      process.stdin.on('data', (char) => {
        const c = char.toString()
        if (c === '\r' || c === '\n') {
          process.stdin.setRawMode(false)
          process.stdout.write('\n')
          rl.close()
          resolve(input)
        } else if (c === '\u0003') {
          process.exit()
        } else if (c === '\u007f') {
          input = input.slice(0, -1)
        } else {
          input += c
        }
      })
    } else {
      rl.question(question, (answer) => { rl.close(); resolve(answer) })
    }
  })
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  loadEnv()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('\n❌  Missing environment variables.\n')
    console.error('Make sure .env.local contains:')
    console.error('  NEXT_PUBLIC_SUPABASE_URL=...')
    console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=...')
    console.error('  SUPABASE_SERVICE_ROLE_KEY=...\n')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // 1. Run migration SQL
  console.log('\n📦  Running database migration…')
  const sql = readFileSync(
    resolve(process.cwd(), 'supabase/migrations/001_init.sql'),
    'utf-8'
  )

  let sqlError: unknown = null
  try {
    const result = await supabase.rpc('exec_sql', { sql })
    sqlError = result.error
  } catch {
    sqlError = new Error('RPC not available')
  }
  // RPC exec_sql may not exist — fall back to individual statements via REST
  if (sqlError) {
    console.warn('   Note: could not run via RPC. Run the migration manually in the Supabase SQL editor.')
    console.warn('   File: supabase/migrations/001_init.sql\n')
  } else {
    console.log('   ✅  Migration complete.')
  }

  // 2. Create first admin user
  console.log('\n👤  Create first admin user')
  const email    = await prompt('   Email: ')
  const password = await prompt('   Password: ', true)
  const name     = await prompt('   Display name: ')

  const { data, error: signUpError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: name },
  })

  if (signUpError) {
    console.error('\n❌  Failed to create user:', signUpError.message)
    process.exit(1)
  }

  // Promote to admin
  const { error: roleError } = await supabase
    .from('profiles')
    .update({ role: 'admin', display_name: name })
    .eq('id', data.user.id)

  if (roleError) {
    console.warn('   ⚠️  User created but could not set admin role:', roleError.message)
    console.warn('   Run manually: UPDATE profiles SET role=\'admin\' WHERE id=\'' + data.user.id + '\';')
  } else {
    console.log('\n✅  Admin user created successfully!')
  }

  console.log('\n🚀  Setup complete. Run `npm run dev` to start the CMS.\n')
}

main().catch(err => { console.error(err); process.exit(1) })
