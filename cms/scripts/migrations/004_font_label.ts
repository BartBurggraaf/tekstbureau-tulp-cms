/**
 * v4 — 3-slot font system (headline, body, label)
 *
 * What changed in this version:
 *   - config/brand.ts: new `fontLabel` field
 *   - config/theme.ts: fonts.label slot
 *   - src/app/layout.tsx: --t-fontLabel CSS var + Google Fonts URL
 *   - src/app/globals.css: --font-label maps to --t-fontLabel (with --t-fontBody fallback)
 *   - src/app/globals.css: --radius-brand token, global polish baseline,
 *                          skip-link, site-grain, button press feedback,
 *                          reduced-motion media query
 *   - src/app/(site)/layout.tsx: skip-link anchor, id="main-content", site-grain class
 *   - src/app/not-found.tsx: branded 404 stub
 *   - src/app/preview/[slug]/page.tsx: uses real SiteLayout for WYSIWYG preview
 *   - src/components/editor/PageBuilder.tsx: brand fonts on inputs and block labels
 *   - src/components/editor/BlockRenderer.tsx: font-label on button blocks
 *   - src/app/(cms)/style/page.tsx: enhanced typography + button states + shadow tokens
 *   - src/app/manual/page.tsx: Phase 5 "Design system in editor" section
 *   - CLAUDE.md: shadow tokens documentation
 *
 * What this migration automates:
 *   1. Adds `fontLabel` to config/brand.ts if missing (defaults to same as fontBody)
 *
 * What it cannot automate (comes in via git merge):
 *   - All the file changes listed above
 */

import fs from 'fs'
import path from 'path'

export const version = 4
export const description = '3-slot font system, global CSS polish, 404 stub, WYSIWYG preview'

// ─── check ───────────────────────────────────────────────────────────────────

export async function check(root: string): Promise<{ ok: boolean; reason?: string }> {
  const brandPath = path.join(root, 'config', 'brand.ts')
  if (!fs.existsSync(brandPath)) {
    return { ok: false, reason: 'config/brand.ts not found — skipping' }
  }
  const content = fs.readFileSync(brandPath, 'utf-8')
  if (content.includes('fontLabel')) {
    return { ok: false, reason: 'config/brand.ts already contains fontLabel' }
  }
  return { ok: true }
}

// ─── up ──────────────────────────────────────────────────────────────────────

export async function up(root: string): Promise<void> {
  const brandPath = path.join(root, 'config', 'brand.ts')
  let brand = fs.readFileSync(brandPath, 'utf-8')

  // Extract the current fontBody value to use as the default for fontLabel
  const bodyMatch = brand.match(/fontBody:\s*['"]([^'"]+)['"]/)
  const defaultLabel = bodyMatch ? bodyMatch[1] : 'Inter'

  // Insert fontLabel after fontBody line
  const insertAfter = /fontBody:\s*['"][^'"]+['"]/
  if (insertAfter.test(brand)) {
    brand = brand.replace(
      insertAfter,
      (match) => `${match},\n  fontLabel:    '${defaultLabel}',   // UI labels, uppercase captions, buttons`,
    )
  } else {
    // Fallback: append before closing brace of brand object
    brand = brand.replace(
      /(\n})/,
      `\n  fontLabel: '${defaultLabel}',   // UI labels, uppercase captions, buttons\n}`,
    )
  }

  fs.writeFileSync(brandPath, brand, 'utf-8')
  console.log(`  Updated config/brand.ts — added fontLabel: '${defaultLabel}'`)
  console.log()
  console.log('  ┌─────────────────────────────────────────────────────────────────┐')
  console.log('  │  Tip: set a distinct label font for UI polish                    │')
  console.log('  │                                                                  │')
  console.log('  │  fontLabel defaults to your body font. For a more distinctive    │')
  console.log('  │  look, try a condensed or geometric font for labels/buttons,     │')
  console.log('  │  e.g. "DM Sans", "Space Grotesk", "Plus Jakarta Sans".           │')
  console.log('  │                                                                  │')
  console.log('  │  Edit config/brand.ts → fontLabel and commit.                   │')
  console.log('  └─────────────────────────────────────────────────────────────────┘')
}
