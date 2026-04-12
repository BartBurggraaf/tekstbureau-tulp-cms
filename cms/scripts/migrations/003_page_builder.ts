/**
 * v3 — Page builder, version history, and preview route
 *
 * What changed in this version:
 *   - New components: src/components/editor/ (PageBuilder, BlockRenderer, types)
 *   - New routes: app/(cms)/pages/new, app/(cms)/pages/[id], app/preview/[slug]
 *   - New server actions: app/(cms)/pages/actions.ts
 *   - New DB migration: supabase/migrations/002_page_versions.sql
 *   - proxy.ts: /preview added to protected CMS_ROUTES
 *   - Public site pages updated to use BlockRenderer
 *
 * What this migration automates:
 *   1. Adds '/preview' to CMS_ROUTES in proxy.ts if missing
 *      (security: prevents anonymous users from viewing draft pages)
 *   2. Prints a reminder to apply the database migration for page_versions
 *      (run: npm run setup  — 002_page_versions.sql is idempotent)
 *
 * What it cannot automate (comes in via git merge):
 *   - New files under src/components/editor/
 *   - New app/(cms)/pages/[id] and app/(cms)/pages/new routes
 *   - app/preview/[slug] route
 *   - Updated public site pages (BlockRenderer rendering)
 */

import fs from 'fs'
import path from 'path'

export const version = 3
export const description = 'Page builder, version history, and preview route'

// ─── check ───────────────────────────────────────────────────────────────────

export async function check(root: string): Promise<{ ok: boolean; reason?: string }> {
  const proxyPath = path.join(root, 'src', 'proxy.ts')
  if (!fs.existsSync(proxyPath)) {
    return { ok: false, reason: 'src/proxy.ts not found — skipping' }
  }
  const content = fs.readFileSync(proxyPath, 'utf-8')
  if (content.includes("'/preview'")) {
    return { ok: false, reason: 'proxy.ts already contains /preview' }
  }
  return { ok: true }
}

// ─── up ──────────────────────────────────────────────────────────────────────

export async function up(root: string): Promise<void> {
  // 1. Add /preview to CMS_ROUTES in proxy.ts
  const proxyPath = path.join(root, 'src', 'proxy.ts')
  let proxy = fs.readFileSync(proxyPath, 'utf-8')

  // Find the last entry in CMS_ROUTES and insert /preview after it
  // Handles both patterns: ending with a comma-less entry or a comma entry
  const insertAfter = "'/activity',"
  const insertAfterAlt = "'/activity'"

  if (proxy.includes(insertAfter)) {
    proxy = proxy.replace(
      insertAfter,
      `${insertAfter}\n  '/preview',   // draft preview — auth required so anonymous users can't see unpublished content`,
    )
  } else if (proxy.includes(insertAfterAlt)) {
    proxy = proxy.replace(
      insertAfterAlt,
      `${insertAfterAlt},\n  '/preview',   // draft preview — auth required so anonymous users can't see unpublished content`,
    )
  } else {
    // Fallback: append inside the array before the closing bracket
    proxy = proxy.replace(
      /const CMS_ROUTES = \[([\s\S]*?)\]/,
      (match, inner) => `const CMS_ROUTES = [${inner.trimEnd()}\n  '/preview',   // draft preview — auth required so anonymous users can't see unpublished content\n]`,
    )
  }

  fs.writeFileSync(proxyPath, proxy, 'utf-8')
  console.log('  Updated src/proxy.ts — added /preview to CMS_ROUTES')

  // 2. Remind about the database migration
  console.log()
  console.log('  ┌─────────────────────────────────────────────────────────────────┐')
  console.log('  │  Database migration required                                     │')
  console.log('  │                                                                  │')
  console.log('  │  Run:  npm run setup                                             │')
  console.log('  │                                                                  │')
  console.log('  │  This applies supabase/migrations/002_page_versions.sql which   │')
  console.log('  │  creates the page_versions table used by the version history     │')
  console.log('  │  feature. The migration is idempotent — safe to run again.       │')
  console.log('  └─────────────────────────────────────────────────────────────────┘')
}
