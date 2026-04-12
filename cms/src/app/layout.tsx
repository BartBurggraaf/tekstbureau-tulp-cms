import type { Metadata } from 'next'
import { Spectral, Figtree, Bricolage_Grotesque } from 'next/font/google'
import { theme } from '../../config/theme'
import { site } from '../../config/site'
import './globals.css'

export const metadata: Metadata = {
  title: site.name,
  description: `${site.name} — powered by Burgt CMS`,
}

// Self-hosted via next/font — no render-blocking cross-origin request
const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-spectral',
  display: 'swap',
})

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-figtree',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bricolage',
  display: 'swap',
})

function buildThemeVars(t: typeof theme): string {
  const c = t.colors
  return `
    --t-primary:${c.primary};
    --t-primaryDim:${c.primaryDim};
    --t-primaryFixed:${c.primaryFixed};
    --t-primaryFixedDim:${c.primaryFixedDim};
    --t-onPrimary:${c.onPrimary};
    --t-onPrimaryFixed:${c.onPrimaryFixed};
    --t-onPrimaryFixedVariant:${c.onPrimaryFixedVariant};
    --t-primaryContainer:${c.primaryContainer};
    --t-onPrimaryContainer:${c.onPrimaryContainer};

    --t-secondary:${c.secondary};
    --t-secondaryDim:${c.secondaryDim};
    --t-secondaryFixed:${c.secondaryFixed};
    --t-secondaryFixedDim:${c.secondaryFixedDim};
    --t-onSecondary:${c.onSecondary};
    --t-onSecondaryFixed:${c.onSecondaryFixed};
    --t-onSecondaryFixedVariant:${c.onSecondaryFixedVariant};
    --t-secondaryContainer:${c.secondaryContainer};
    --t-onSecondaryContainer:${c.onSecondaryContainer};

    --t-tertiary:${c.tertiary};
    --t-tertiaryDim:${c.tertiaryDim};
    --t-tertiaryFixed:${c.tertiaryFixed};
    --t-tertiaryFixedDim:${c.tertiaryFixedDim};
    --t-onTertiary:${c.onTertiary};
    --t-onTertiaryFixed:${c.onTertiaryFixed};
    --t-onTertiaryFixedVariant:${c.onTertiaryFixedVariant};
    --t-tertiaryContainer:${c.tertiaryContainer};
    --t-onTertiaryContainer:${c.onTertiaryContainer};

    --t-error:${c.error};
    --t-errorDim:${c.errorDim};
    --t-errorContainer:${c.errorContainer};
    --t-onError:${c.onError};
    --t-onErrorContainer:${c.onErrorContainer};

    --t-surface:${c.surface};
    --t-surfaceBright:${c.surfaceBright};
    --t-surfaceDim:${c.surfaceDim};
    --t-surfaceVariant:${c.surfaceVariant};
    --t-surfaceTint:${c.surfaceTint};
    --t-surfaceContainerLowest:${c.surfaceContainerLowest};
    --t-surfaceContainerLow:${c.surfaceContainerLow};
    --t-surfaceContainer:${c.surfaceContainer};
    --t-surfaceContainerHigh:${c.surfaceContainerHigh};
    --t-surfaceContainerHighest:${c.surfaceContainerHighest};
    --t-inverseSurface:${c.inverseSurface};

    --t-onSurface:${c.onSurface};
    --t-onSurfaceVariant:${c.onSurfaceVariant};
    --t-onBackground:${c.onBackground};
    --t-background:${c.background};

    --t-outline:${c.outline};
    --t-outlineVariant:${c.outlineVariant};
    --t-inverseOnSurface:${c.inverseOnSurface};
    --t-inversePrimary:${c.inversePrimary};

    --t-fontHeadline:var(--font-spectral);
    --t-fontBody:var(--font-figtree);
    --t-fontLabel:var(--font-bricolage);

    --t-radiusSm:${t.radius.sm};
    --t-radiusMd:${t.radius.md};
    --t-radiusLg:${t.radius.lg};
    --t-radiusFull:${t.radius.full};

    --t-sidebarWidth:${t.sidebarWidth};
  `
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themeVars = buildThemeVars(theme)
  const fontClasses = `${spectral.variable} ${figtree.variable} ${bricolage.variable}`

  return (
    <html lang="nl" className={fontClasses}>
      <head>
        {/* Material Symbols — icons only, not fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
        <style>{`:root{${themeVars}}`}</style>
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
