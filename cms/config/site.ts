/**
 * SITE CONFIG — edit this per client, or override via .env.local
 * Controls the name, features shown in the sidebar, and meta info.
 *
 * ENV VAR OVERRIDES (set in .env.local to avoid editing this file):
 *   NEXT_PUBLIC_CMS_NAME      — sidebar name & browser tab title
 *   NEXT_PUBLIC_CMS_TAGLINE   — subtitle under the name
 *   NEXT_PUBLIC_CMS_DOMAIN    — client domain for SEO previews
 */
const e = (key: string, fallback: string) => process.env[key] ?? fallback

export const site = {
  /** Displayed in the sidebar header and browser tab */
  name: e('NEXT_PUBLIC_CMS_NAME', 'CMS Admin'),
  tagline: e('NEXT_PUBLIC_CMS_TAGLINE', 'Management Portal'),

  /** Client domain (used for SEO previews etc.) */
  domain: e('NEXT_PUBLIC_CMS_DOMAIN', 'example.com'),

  /** Toggle modules on/off per client */
  features: {
    pages:    true,
    blog:     true,
    style:    true,
    users:    true,
    media:    true,
    seo:      true,
    activity: true,
    forms:    true,
  },

  /** Nav items — order controls sidebar order. Only shown if feature is enabled above. */
  nav: [
    { key: 'dashboard', label: 'Dashboard', icon: 'dashboard',    href: '/dashboard' },
    { key: 'pages',     label: 'Pages',     icon: 'description',  href: '/pages' },
    { key: 'blog',      label: 'Blog',      icon: 'article',      href: '/blog' },
    { key: 'media',     label: 'Media',     icon: 'photo_library', href: '/media' },
    { key: 'forms',     label: 'Forms',     icon: 'inbox',        href: '/forms' },
    { key: 'seo',       label: 'SEO',       icon: 'travel_explore', href: '/seo' },
    { key: 'style',     label: 'Style',     icon: 'palette',      href: '/style' },
    { key: 'users',     label: 'Users',     icon: 'group',        href: '/users' },
    { key: 'activity',  label: 'Activity',  icon: 'history',      href: '/activity' },
    { key: 'manual',    label: 'Manual',    icon: 'menu_book',    href: '/manual' },
  ],
}

export type SiteConfig = typeof site
