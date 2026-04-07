/**
 * SITE CONFIG — controls the name, features shown in the sidebar, and meta info.
 * Brand identity (name, tagline, domain) comes from config/brand.ts.
 *
 * To rebrand a client: edit config/brand.ts and commit. Done.
 */
import { brand } from './brand'

export const site = {
  /** Displayed in the sidebar header and browser tab */
  name:    brand.name,
  tagline: brand.tagline,

  /** Client domain (used for SEO previews etc.) */
  domain:  brand.domain,

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
