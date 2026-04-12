import type { Metadata } from 'next'
import { theme } from '../../config/theme'
import { site } from '../../config/site'
import './globals.css'

export const metadata: Metadata = {
  title: site.name,
  description: `${site.name} — powered by Burgt CMS`,
}

/**
 * Converts the theme config into a CSS custom properties string
 * injected on <html> so every Tailwind utility class picks them up.
 */
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

    --t-fontHeadline:${t.fonts.headline};
    --t-fontBody:${t.fonts.body};
    --t-fontLabel:${t.fonts.label};

    --t-radiusSm:${t.radius.sm};
    --t-radiusMd:${t.radius.md};
    --t-radiusLg:${t.radius.lg};
    --t-radiusFull:${t.radius.full};

    --t-sidebarWidth:${t.sidebarWidth};
  `
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themeVars = buildThemeVars(theme)
  const labelFont = theme.fonts.label !== theme.fonts.body
    ? `&family=${theme.fonts.label.replace(/ /g, '+')}:wght@400;500;600;700`
    : ''
  const googleFonts = `https://fonts.googleapis.com/css2?family=${theme.fonts.headline.replace(/ /g, '+')}:wght@400;500;600;700;800&family=${theme.fonts.body.replace(/ /g, '+')}:wght@300;400;500;600${labelFont}&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap`

  return (
    <html lang="en" style={{ ['--theme' as string]: 'injected' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={googleFonts} rel="stylesheet" />
        <style>{`:root{${themeVars}}`}</style>
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
