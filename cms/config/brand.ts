/**
 * BRAND CONFIG — edit this per client, then commit.
 * This file is intentionally committed to git so brand settings
 * are versioned alongside the project.
 *
 * Secrets (Supabase keys, access tokens) stay in .env.local — never here.
 */
export const brand = {
  /** Displayed in the sidebar and browser tab */
  name:    'CMS Admin',
  tagline: 'Management Portal',

  /** Client domain — used for SEO previews */
  domain: 'example.com',

  /** Primary brand color family */
  primary:    '#13677b',
  primaryDim: '#005a6e',
  onPrimary:  '#edfaff',

  /** Typography — use exact Google Fonts family names */
  fontHeadline: 'Manrope',
  fontBody:     'Inter',

  /** Logo — path relative to /public (e.g. /logo.svg) */
  logo: '/logo.svg',
}

export type Brand = typeof brand
