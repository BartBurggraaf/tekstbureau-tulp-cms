/**
 * THEME CONFIG — edit this per client
 * All visual tokens live here. Swap colors, fonts, radii, logo.
 * Nothing in src/ needs to change for a full rebrand.
 */
export const theme = {
  /** Brand colors — swap these for each client */
  colors: {
    primary:                '#13677b',
    primaryDim:             '#005a6e',
    primaryFixed:           '#b2ebff',
    primaryFixedDim:        '#99dff6',
    onPrimary:              '#edfaff',
    onPrimaryFixed:         '#004655',
    onPrimaryFixedVariant:  '#0d6478',
    primaryContainer:       '#b2ebff',
    onPrimaryContainer:     '#005a6d',

    secondary:              '#5d5f61',
    secondaryDim:           '#515355',
    secondaryFixed:         '#e1e3e4',
    secondaryFixedDim:      '#d3d5d6',
    onSecondary:            '#f7f9fa',
    onSecondaryFixed:       '#3d4041',
    onSecondaryFixedVariant:'#595c5d',
    secondaryContainer:     '#e1e3e4',
    onSecondaryContainer:   '#4f5253',

    tertiary:               '#4c6175',
    tertiaryDim:            '#405568',
    tertiaryFixed:          '#d1e8ff',
    tertiaryFixedDim:       '#c3daf0',
    onTertiary:             '#f6f9ff',
    onTertiaryFixed:        '#2e4355',
    onTertiaryFixedVariant: '#4a6073',
    tertiaryContainer:      '#d1e8ff',
    onTertiaryContainer:    '#405668',

    error:                  '#9f403d',
    errorDim:               '#4e0309',
    errorContainer:         '#fe8983',
    onError:                '#fff7f6',
    onErrorContainer:       '#752121',

    surface:                '#f8f9fa',
    surfaceBright:          '#f8f9fa',
    surfaceDim:             '#d1dce0',
    surfaceVariant:         '#dbe4e7',
    surfaceTint:            '#13677b',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow:    '#f1f4f6',
    surfaceContainer:       '#eaeff1',
    surfaceContainerHigh:   '#e3e9ec',
    surfaceContainerHighest:'#dbe4e7',
    inverseSurface:         '#0c0f10',

    onSurface:              '#2b3437',
    onSurfaceVariant:       '#586064',
    onBackground:           '#2b3437',
    background:             '#f8f9fa',

    outline:                '#737c7f',
    outlineVariant:         '#abb3b7',
    inverseOnSurface:       '#9b9d9e',
    inversePrimary:         '#a1e7ff',
  },

  /** Fonts — use any Google Font name, or a system font */
  fonts: {
    headline: 'Manrope',
    body:     'Inter',
  },

  /** Border radii */
  radius: {
    sm:   '0.125rem',
    md:   '0.25rem',
    lg:   '0.5rem',
    full: '0.75rem',
  },

  /** Sidebar width */
  sidebarWidth: '16rem',

  /** Logo path (place file in /public) */
  logo: '/logo.svg',
}

export type Theme = typeof theme
