import TopBar from '@/components/layout/TopBar'
import { createClient } from '@/lib/supabase/server'

export default async function SeoPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('seo_settings').select('*').single()
  const settings = data ?? {}

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="SEO" />
      <div className="p-9 space-y-7 max-w-3xl">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
            SEO Settings
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            Global metadata and search engine configuration
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Basic */}
          <div className="bg-surface-container-lowest rounded-xl p-7 space-y-5">
            <h2 className="text-sm font-label font-bold uppercase tracking-widest text-outline">Basic</h2>

            <div className="space-y-1">
              <label className="text-xs font-label font-bold uppercase tracking-widest text-outline">
                Site Title
              </label>
              <input
                name="site_title"
                defaultValue={settings.site_title ?? ''}
                className="w-full bg-surface-container-high rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="My Website"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-label font-bold uppercase tracking-widest text-outline">
                Site Description
              </label>
              <textarea
                name="site_description"
                defaultValue={settings.site_description ?? ''}
                rows={3}
                className="w-full bg-surface-container-high rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="A short description of the website (max 160 characters)"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-label font-bold uppercase tracking-widest text-outline">
                OG Image URL
              </label>
              <input
                name="og_image"
                defaultValue={settings.og_image ?? ''}
                className="w-full bg-surface-container-high rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/og.jpg"
              />
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-surface-container-lowest rounded-xl p-7 space-y-5">
            <h2 className="text-sm font-label font-bold uppercase tracking-widest text-outline">Analytics</h2>

            <div className="space-y-1">
              <label className="text-xs font-label font-bold uppercase tracking-widest text-outline">
                Google Analytics ID
              </label>
              <input
                name="google_analytics_id"
                defaultValue={settings.google_analytics_id ?? ''}
                className="w-full bg-surface-container-high rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </div>

          {/* Robots.txt */}
          <div className="bg-surface-container-lowest rounded-xl p-7 space-y-5">
            <h2 className="text-sm font-label font-bold uppercase tracking-widest text-outline">Robots.txt</h2>
            <textarea
              name="robots_txt"
              defaultValue={settings.robots_txt ?? 'User-agent: *\nAllow: /'}
              rows={6}
              className="w-full bg-surface-container-high rounded-lg px-4 py-3 text-sm font-mono text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* SERP Preview */}
          <div className="bg-surface-container-lowest rounded-xl p-7 space-y-4">
            <h2 className="text-sm font-label font-bold uppercase tracking-widest text-outline">SERP Preview</h2>
            <div className="p-4 bg-surface-container-low rounded-lg space-y-1">
              <p className="text-xs text-outline">{settings.site_title ?? 'example.com'}</p>
              <p className="text-base text-primary font-medium">{settings.site_title ?? 'My Website'}</p>
              <p className="text-sm text-on-surface-variant">{settings.site_description ?? 'A description of your website will appear here.'}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="primary-gradient text-on-primary px-6 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
