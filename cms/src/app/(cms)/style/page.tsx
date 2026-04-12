'use client'

import TopBar from '@/components/layout/TopBar'
import { theme } from '../../../../config/theme'

const colorGroups = [
  {
    label: 'Primary',
    swatches: [
      { name: 'primary',         label: 'Primary',         value: theme.colors.primary },
      { name: 'primaryDim',      label: 'Primary Dim',     value: theme.colors.primaryDim },
      { name: 'onPrimary',       label: 'On Primary',      value: theme.colors.onPrimary },
      { name: 'primaryContainer',label: 'Primary Container', value: theme.colors.primaryContainer },
    ],
  },
  {
    label: 'Surface',
    swatches: [
      { name: 'surface',                  label: 'Surface',           value: theme.colors.surface },
      { name: 'surfaceContainerLowest',   label: 'Container Lowest',  value: theme.colors.surfaceContainerLowest },
      { name: 'surfaceContainerLow',      label: 'Container Low',     value: theme.colors.surfaceContainerLow },
      { name: 'surfaceContainer',         label: 'Container',         value: theme.colors.surfaceContainer },
      { name: 'surfaceContainerHigh',     label: 'Container High',    value: theme.colors.surfaceContainerHigh },
    ],
  },
  {
    label: 'Text',
    swatches: [
      { name: 'onSurface',        label: 'On Surface',         value: theme.colors.onSurface },
      { name: 'onSurfaceVariant', label: 'On Surface Variant', value: theme.colors.onSurfaceVariant },
      { name: 'outline',          label: 'Outline',            value: theme.colors.outline },
    ],
  },
  {
    label: 'Status',
    swatches: [
      { name: 'tertiary',        label: 'Tertiary',         value: theme.colors.tertiary },
      { name: 'error',           label: 'Error',            value: theme.colors.error },
      { name: 'errorContainer',  label: 'Error Container',  value: theme.colors.errorContainer },
    ],
  },
]

export default function StylePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Style" />
      <div className="p-9 space-y-9">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
            Global Style Settings
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            Visual reference for the current theme. Edit <code className="text-xs bg-surface-container px-1.5 py-0.5 rounded">config/theme.ts</code> to change.
          </p>
        </div>

        {/* Font preview */}
        <div className="bg-surface-container-lowest rounded-xl p-8 space-y-6">
          <h2 className="text-sm font-label font-bold uppercase tracking-widest text-outline">Typography</h2>
          <div className="space-y-6 divide-y divide-surface-container-high">
            <div className="space-y-3">
              <p className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-widest">Headline — {theme.fonts.headline}</p>
              <div className="space-y-2">
                <div className="flex items-baseline gap-4">
                  <span className="text-[10px] font-mono text-outline w-6 flex-shrink-0">h1</span>
                  <p className="font-headline text-4xl font-extrabold text-on-surface" style={{ letterSpacing: '-0.025em' }}>The quick brown fox</p>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-[10px] font-mono text-outline w-6 flex-shrink-0">h2</span>
                  <p className="font-headline text-2xl font-bold text-on-surface" style={{ letterSpacing: '-0.02em' }}>The quick brown fox</p>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-[10px] font-mono text-outline w-6 flex-shrink-0">h3</span>
                  <p className="font-headline text-xl font-semibold text-on-surface">The quick brown fox</p>
                </div>
              </div>
            </div>
            <div className="pt-5 space-y-2">
              <p className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-widest">Body — {theme.fonts.body}</p>
              <p className="font-body text-base text-on-surface leading-relaxed">
                Consistent, purposeful typography communicates brand authority. Good body copy is easy to scan, comfortable to read, and never competes with the headline.
              </p>
            </div>
            <div className="pt-5 space-y-2">
              <p className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-widest">Label — {theme.fonts.label}</p>
              <p className="font-label text-xs font-bold uppercase tracking-widest text-outline">
                Category label &bull; Status tag &bull; Metadata
              </p>
            </div>
          </div>
        </div>

        {/* Color palette */}
        <div className="bg-surface-container-lowest rounded-xl p-8 space-y-8">
          <h2 className="text-sm font-label font-bold uppercase tracking-widest text-outline">Color Palette</h2>
          {colorGroups.map(group => (
            <div key={group.label}>
              <p className="text-xs font-bold text-on-surface-variant mb-3">{group.label}</p>
              <div className="flex flex-wrap gap-4">
                {group.swatches.map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg shadow-sm border border-surface-container"
                      style={{ backgroundColor: s.value }}
                    />
                    <div>
                      <p className="text-xs font-semibold text-on-surface">{s.label}</p>
                      <p className="text-[10px] text-outline font-mono">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Component preview */}
        <div className="bg-surface-container-lowest rounded-xl p-8 space-y-6">
          <h2 className="text-sm font-label font-bold uppercase tracking-widest text-outline">Components</h2>

          <div className="space-y-4">
            <p className="text-xs font-label font-bold text-on-surface-variant">Buttons — Primary</p>
            <div className="flex flex-wrap gap-3 items-center">
              <button className="primary-gradient text-on-primary px-5 py-2.5 rounded-lg text-sm font-label font-bold">
                Default
              </button>
              <button className="primary-gradient text-on-primary px-5 py-2.5 rounded-lg text-sm font-label font-bold opacity-80">
                Hover
              </button>
              <button className="primary-gradient text-on-primary px-5 py-2.5 rounded-lg text-sm font-label font-bold scale-[0.98]">
                Active
              </button>
              <button disabled className="primary-gradient text-on-primary px-5 py-2.5 rounded-lg text-sm font-label font-bold opacity-40 cursor-not-allowed">
                Disabled
              </button>
            </div>
            <p className="text-xs font-label font-bold text-on-surface-variant mt-4">Buttons — Secondary</p>
            <div className="flex flex-wrap gap-3 items-center">
              <button className="border border-primary text-primary px-5 py-2.5 rounded-lg text-sm font-label font-bold">
                Default
              </button>
              <button className="border border-primary text-primary px-5 py-2.5 rounded-lg text-sm font-label font-bold bg-primary/5">
                Hover
              </button>
              <button className="border border-primary text-primary px-5 py-2.5 rounded-lg text-sm font-label font-bold scale-[0.98] bg-primary/10">
                Active
              </button>
              <button disabled className="border border-outline text-outline px-5 py-2.5 rounded-lg text-sm font-label font-bold opacity-40 cursor-not-allowed">
                Disabled
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-on-surface-variant">Inputs</p>
            <div className="flex flex-wrap gap-4 max-w-lg">
              <input
                className="flex-1 bg-surface-container-high rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Default input"
              />
              <input
                className="flex-1 bg-error-container rounded-lg px-4 py-3 text-sm text-on-error-container focus:outline-none focus:ring-2 focus:ring-error"
                placeholder="Error state"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-on-surface-variant">Tags / Chips</p>
            <div className="flex gap-2">
              {['Design', 'Development', 'CMS', 'Published'].map(tag => (
                <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-secondary-fixed-dim text-on-secondary-fixed">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-label font-bold text-on-surface-variant">Tinted shadow token</p>
            <div className="flex flex-wrap gap-6">
              {[12, 20, 32].map(px => (
                <div
                  key={px}
                  className="w-24 h-14 rounded-lg bg-surface-container-lowest flex items-center justify-center text-[10px] font-mono text-outline"
                  style={{ boxShadow: `0 ${px}px ${px * 3}px color-mix(in srgb, var(--color-primary) 12%, transparent)` }}
                >
                  {px}px
                </div>
              ))}
            </div>
            <p className="text-xs text-outline">
              Use: <code className="bg-surface-container px-1.5 py-0.5 rounded text-[10px]">shadow-[0_16px_48px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]</code>
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-label font-bold text-on-surface-variant">Border Radii</p>
            <div className="flex gap-4 items-center">
              {Object.entries(theme.radius).map(([key, val]) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 bg-primary/20"
                    style={{ borderRadius: val }}
                  />
                  <span className="text-[10px] text-outline font-mono">{val}</span>
                  <span className="text-[10px] text-outline">{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
