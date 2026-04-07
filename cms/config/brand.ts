/**
 * BRAND CONFIG — edit this per client, then commit.
 * This file is intentionally committed to git so brand settings
 * are versioned alongside the project.
 *
 * Secrets (Supabase keys, access tokens) stay in .env.local — never here.
 */
export const brand = {
  /** Displayed in the sidebar and browser tab */
  name:    'Tekstbureau Tulp',
  tagline: 'Meer klanten door tekst en SEO',

  /** Client domain — used for SEO previews */
  domain: 'example.com',

  /** Primary brand color family */
  primary:    '#529237',
  primaryDim: '#3d6e2a',
  onPrimary:  '#ffffff',

  /** Typography — use exact Google Fonts family names */
  fontHeadline: 'Nokora',
  fontBody:     'Nokora',

  /** Logo — path relative to /public (e.g. /logo.svg) */
  logo: '/logo.svg',
}

export type Brand = typeof brand
