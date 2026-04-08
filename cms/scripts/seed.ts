/**
 * Veltra CMS — seed script
 * Run: npm run seed
 *
 * Inserts one skeleton page per standard slug with status = 'draft'.
 * Safe to run multiple times — skips slugs that already exist.
 *
 * After seeding, open the CMS Pages section and publish the pages
 * to make them visible on the public site.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

function loadEnv() {
  try {
    const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
    for (const line of envFile.split('\n')) {
      const [key, ...rest] = line.split('=')
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '')
      }
    }
  } catch { /* rely on environment */ }
}

const SEED_PAGES = [
  {
    slug: 'home',
    title: 'Home',
    meta_title: 'Welcome',
    meta_desc: 'Welcome to our website.',
    content: { blocks: [{ type: 'heading', text: 'Welcome' }, { type: 'paragraph', text: 'Edit this page in the CMS.' }] },
  },
  {
    slug: 'diensten',
    title: 'Diensten',
    meta_title: 'Diensten',
    meta_desc: 'Onze diensten.',
    content: { blocks: [{ type: 'heading', text: 'Diensten' }, { type: 'paragraph', text: 'Beschrijf hier uw diensten.' }] },
  },
  {
    slug: 'over',
    title: 'Over ons',
    meta_title: 'Over ons',
    meta_desc: 'Meer over ons.',
    content: { blocks: [{ type: 'heading', text: 'Over ons' }, { type: 'paragraph', text: 'Vertel hier uw verhaal.' }] },
  },
  {
    slug: 'contact',
    title: 'Contact',
    meta_title: 'Contact',
    meta_desc: 'Neem contact op.',
    content: { blocks: [{ type: 'heading', text: 'Contact' }, { type: 'paragraph', text: 'Vul hier uw contactgegevens in.' }] },
  },
]

async function main() {
  loadEnv()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('\nMissing environment variables.')
    console.error('Make sure .env.local contains NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.\n')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  console.log('\nSeeding pages…\n')

  for (const page of SEED_PAGES) {
    // Check if slug already exists
    const { data: existing } = await supabase
      .from('pages')
      .select('slug')
      .eq('slug', page.slug)
      .single()

    if (existing) {
      console.log(`  skip  ${page.slug} (already exists)`)
      continue
    }

    const { error } = await supabase.from('pages').insert({
      ...page,
      status: 'draft',
    })

    if (error) {
      console.error(`  error  ${page.slug}: ${error.message}`)
    } else {
      console.log(`  seeded ${page.slug}`)
    }
  }

  console.log('\nDone. Open the CMS → Pages to publish pages and make them live.\n')
}

main().catch(err => { console.error(err); process.exit(1) })
