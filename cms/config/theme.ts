/**
 * THEME CONFIG — full visual token set.
 * Brand-specific values (primary color, fonts, logo) come from config/brand.ts.
 * Everything else (neutral palette, radii, surfaces) lives here.
 *
 * To rebrand a client: edit config/brand.ts and commit. Done.
 */
import { brand } from './brand'

export const theme = {
  colors: {
    primary:                brand.primary,
    primaryDim:             brand.primaryDim,
    primaryFixed:           '#aef58d',
    primaryFixedDim:        '#93d874',
    onPrimary:              brand.onPrimary,
    onPrimaryFixed:         '#062100',
    onPrimaryFixedVariant:  '#185200',
    primaryContainer:       '#44832a',
    onPrimaryContainer:     '#f8ffee',

    secondary:              '#af3000',
    secondaryDim:           '#862300',
    secondaryFixed:         '#ffdbd1',
    secondaryFixedDim:      '#ffb59f',
    onSecondary:            '#ffffff',
    onSecondaryFixed:       '#3a0a00',
    onSecondaryFixedVariant:'#862300',
    secondaryContainer:     '#fe6433',
    onSecondaryContainer:   '#5b1500',

    tertiary:               '#43625e',
    tertiaryDim:            '#2d4c49',
    tertiaryFixed:          '#c7e9e5',
    tertiaryFixedDim:       '#accdc9',
    onTertiary:             '#ffffff',
    onTertiaryFixed:        '#00201e',
    onTertiaryFixedVariant: '#2d4c49',
    tertiaryContainer:      '#5b7b77',
    onTertiaryContainer:    '#f3fffc',

    error:                  '#ba1a1a',
    errorDim:               '#93000a',
    errorContainer:         '#ffdad6',
    onError:                '#ffffff',
    onErrorContainer:       '#93000a',

    surface:                '#e4fffb',
    surfaceBright:          '#e4fffb',
    surfaceDim:             '#bfe1dc',
    surfaceVariant:         '#d2f5f0',
    surfaceTint:            brand.primary,
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow:    '#d8fbf6',
    surfaceContainer:       '#d2f5f0',
    surfaceContainerHigh:   '#cdefea',
    surfaceContainerHighest:'#c7e9e5',
    inverseSurface:         '#163533',

    onSurface:              '#00201e',
    onSurfaceVariant:       '#41493b',
    onBackground:           '#00201e',
    background:             '#e4fffb',

    outline:                '#717a6a',
    outlineVariant:         '#c1c9b7',
    inverseOnSurface:       '#d5f8f3',
    inversePrimary:         '#93d874',
  },

  fonts: {
    headline: brand.fontHeadline,
    body:     brand.fontBody,
    label:    brand.fontLabel,
  },

  radius: {
    sm:   '0.25rem',
    md:   '0.5rem',
    lg:   '0.75rem',
    full: '9999px',
  },

  sidebarWidth: '16rem',

  logo: brand.logo,
}

export type Theme = typeof theme
