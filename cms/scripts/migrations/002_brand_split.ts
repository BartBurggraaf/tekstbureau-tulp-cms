/**
 * v2 — Move brand identity from env vars to config/brand.ts
 *
 * Before this migration, brand settings (name, colors, fonts, logo) were
 * read from NEXT_PUBLIC_BRAND_* and NEXT_PUBLIC_CMS_* environment variables.
 * After this migration, they live in a committed config/brand.ts file.
 *
 * What this migration does:
 *  1. Reads any existing brand values from .env.local
 *  2. Creates config/brand.ts with those values (or defaults)
 *  3. Updates config/site.ts to import from brand.ts instead of process.env
 *  4. Updates config/theme.ts to import from brand.ts instead of process.env
 *  5. Removes the now-redundant brand vars from .env.local
 *
 * Skip condition: config/brand.ts already exists — migration already applied.
 */

import fs from 'fs'
import path from 'path'

export const version = 2
export const description = 'Move brand identity from env vars to config/brand.ts'

// ─── helpers ─────────────────────────────────────────────────────────────────

function parseEnvFile(content: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    // Strip surrounding quotes if present
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
      val = val.slice(1, -1)
    }
    result[key] = val
  }
  return result
}

// ─── check ───────────────────────────────────────────────────────────────────

export async function check(root: string): Promise<{ ok: boolean; reason?: string }> {
  const brandPath = path.join(root, 'config', 'brand.ts')
  if (fs.existsSync(brandPath)) {
    return { ok: false, reason: 'config/brand.ts already exists' }
  }
  return { ok: true }
}

// ─── up ──────────────────────────────────────────────────────────────────────

export async function up(root: string): Promise<void> {
  const envPath = path.join(root, '.env.local')
  const envVars = fs.existsSync(envPath)
    ? parseEnvFile(fs.readFileSync(envPath, 'utf-8'))
    : {}

  // Extract brand values from env, falling back to defaults
  const name         = envVars['NEXT_PUBLIC_CMS_NAME']               ?? 'CMS Admin'
  const tagline      = envVars['NEXT_PUBLIC_CMS_TAGLINE']            ?? 'Management Portal'
  const domain       = envVars['NEXT_PUBLIC_CMS_DOMAIN']             ?? 'example.com'
  const primary      = envVars['NEXT_PUBLIC_BRAND_PRIMARY']          ?? '#13677b'
  const primaryDim   = envVars['NEXT_PUBLIC_BRAND_PRIMARY_DIM']      ?? '#005a6e'
  const onPrimary    = envVars['NEXT_PUBLIC_BRAND_ON_PRIMARY']       ?? '#edfaff'
  const fontHeadline = envVars['NEXT_PUBLIC_BRAND_FONT_HEADLINE']    ?? 'Manrope'
  const fontBody     = envVars['NEXT_PUBLIC_BRAND_FONT_BODY']        ?? 'Inter'
  const logo         = envVars['NEXT_PUBLIC_BRAND_LOGO']             ?? '/logo.svg'

  // ── 1. Create config/brand.ts ─────────────────────────────────────────────
  const brandContent =
`/**
 * BRAND CONFIG — edit this per client, then commit.
 * This file is intentionally committed to git so brand settings
 * are versioned alongside the project.
 *
 * Secrets (Supabase keys, access tokens) stay in .env.local — never here.
 */
export const brand = {
  /** Displayed in the sidebar and browser tab */
  name:    '${name}',
  tagline: '${tagline}',

  /** Client domain — used for SEO previews */
  domain: '${domain}',

  /** Primary brand color family */
  primary:    '${primary}',
  primaryDim: '${primaryDim}',
  onPrimary:  '${onPrimary}',

  /** Typography — use exact Google Fonts family names */
  fontHeadline: '${fontHeadline}',
  fontBody:     '${fontBody}',

  /** Logo — path relative to /public (e.g. /logo.svg) */
  logo: '${logo}',
}

export type Brand = typeof brand
`
  fs.writeFileSync(path.join(root, 'config', 'brand.ts'), brandContent, 'utf-8')
  console.log('  Created config/brand.ts')

  // ── 2. Update config/site.ts ──────────────────────────────────────────────
  const sitePath = path.join(root, 'config', 'site.ts')
  if (fs.existsSync(sitePath)) {
    let site = fs.readFileSync(sitePath, 'utf-8')

    if (site.includes('NEXT_PUBLIC_CMS_NAME')) {
      // Remove the old JSDoc comment block + const e helper
      site = site.replace(
        /\/\*\*[\s\S]*?\*\/\s*\nconst e = \(key: string, fallback: string\) => process\.env\[key\] \?\? fallback\n/,
        `/**\n * SITE CONFIG — controls the name, features shown in the sidebar, and meta info.\n * Brand identity (name, tagline, domain) comes from config/brand.ts.\n *\n * To rebrand a client: edit config/brand.ts and commit. Done.\n */\nimport { brand } from './brand'\n`
      )
      // Replace env var calls with brand references
      site = site
        .replace(/name:\s+e\('NEXT_PUBLIC_CMS_NAME',\s*'[^']*'\),/, `name:    brand.name,`)
        .replace(/tagline:\s+e\('NEXT_PUBLIC_CMS_TAGLINE',\s*'[^']*'\),/, `tagline: brand.tagline,`)
        .replace(/domain:\s+e\('NEXT_PUBLIC_CMS_DOMAIN',\s*'[^']*'\),/, `domain:  brand.domain,`)

      fs.writeFileSync(sitePath, site, 'utf-8')
      console.log('  Updated config/site.ts')
    } else {
      console.log('  config/site.ts — no env var pattern found, skipping')
    }
  }

  // ── 3. Update config/theme.ts ─────────────────────────────────────────────
  const themePath = path.join(root, 'config', 'theme.ts')
  if (fs.existsSync(themePath)) {
    let theme = fs.readFileSync(themePath, 'utf-8')

    if (theme.includes('NEXT_PUBLIC_BRAND_PRIMARY')) {
      // Remove the old JSDoc comment block + const e helper
      theme = theme.replace(
        /\/\*\*[\s\S]*?\*\/\s*\nconst e = \(key: string, fallback: string\) => process\.env\[key\] \?\? fallback\n/,
        `/**\n * THEME CONFIG — full visual token set.\n * Brand-specific values (primary color, fonts, logo) come from config/brand.ts.\n * Everything else (neutral palette, radii, surfaces) lives here.\n *\n * To rebrand a client: edit config/brand.ts and commit. Done.\n */\nimport { brand } from './brand'\n`
      )
      // Replace env var calls with brand references
      theme = theme
        .replace(/primary:\s+e\('NEXT_PUBLIC_BRAND_PRIMARY',\s*'[^']*'\),/, `primary:                brand.primary,`)
        .replace(/primaryDim:\s+e\('NEXT_PUBLIC_BRAND_PRIMARY_DIM',\s*'[^']*'\),/, `primaryDim:             brand.primaryDim,`)
        .replace(/headline:\s+e\('NEXT_PUBLIC_BRAND_FONT_HEADLINE',\s*'[^']*'\),/, `headline: brand.fontHeadline,`)
        .replace(/body:\s+e\('NEXT_PUBLIC_BRAND_FONT_BODY',\s*'[^']*'\),/, `body:     brand.fontBody,`)
        .replace(/logo:\s+e\('NEXT_PUBLIC_BRAND_LOGO',\s*'[^']*'\),/, `logo: brand.logo,`)

      // onPrimary was hardcoded in old theme.ts (not an env var), and surfaceTint
      // was hardcoded to the default primary. Update both to use brand references.
      theme = theme
        .replace(/onPrimary:\s+'#edfaff',/, `onPrimary:              brand.onPrimary,`)
        .replace(/surfaceTint:\s+'#13677b',/, `surfaceTint:            brand.primary,`)

      fs.writeFileSync(themePath, theme, 'utf-8')
      console.log('  Updated config/theme.ts')
    } else {
      console.log('  config/theme.ts — no env var pattern found, skipping')
    }
  }

  // ── 4. Clean up .env.local ────────────────────────────────────────────────
  if (fs.existsSync(envPath)) {
    const brandKeys = new Set([
      'NEXT_PUBLIC_CMS_NAME', 'NEXT_PUBLIC_CMS_TAGLINE', 'NEXT_PUBLIC_CMS_DOMAIN',
      'NEXT_PUBLIC_BRAND_PRIMARY', 'NEXT_PUBLIC_BRAND_PRIMARY_DIM', 'NEXT_PUBLIC_BRAND_ON_PRIMARY',
      'NEXT_PUBLIC_BRAND_FONT_HEADLINE', 'NEXT_PUBLIC_BRAND_FONT_BODY', 'NEXT_PUBLIC_BRAND_LOGO',
    ])

    const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
    const filtered = lines.filter(line => {
      const key = line.split('=')[0].trim()
      return !brandKeys.has(key)
    })

    // Also remove the "Brand overrides" section comment if present
    let cleaned = filtered.join('\n')
    cleaned = cleaned.replace(/\n# ── Brand overrides[^\n]*\n# [^\n]*\n/g, '\n')
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'

    fs.writeFileSync(envPath, cleaned, 'utf-8')
    console.log('  Cleaned brand vars from .env.local')
  }
}
