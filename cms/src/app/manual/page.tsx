'use client'

import { useState } from 'react'
import { site } from '../../../config/site'

function Section({ id, icon, title, children }: { id: string; icon: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
        </div>
        <h2 className="text-xl font-headline font-bold text-on-surface">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold mt-0.5">
        {n}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-on-surface mb-2">{title}</p>
        <div className="text-sm text-on-surface-variant space-y-2">{children}</div>
      </div>
    </div>
  )
}

function Code({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative group">
      <pre className="bg-inverse-surface text-inverse-on-surface text-xs rounded-xl p-5 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
        {children}
      </pre>
      <button
        onClick={copy}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest text-on-surface text-xs px-2.5 py-1 rounded-lg font-bold"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}

function Callout({ type = 'info', children }: { type?: 'info' | 'warn' | 'tip'; children: React.ReactNode }) {
  const styles = {
    info: { bg: 'bg-primary/5 border-primary/20', icon: 'info', color: 'text-primary' },
    warn: { bg: 'bg-error/5 border-error/20', icon: 'warning', color: 'text-error' },
    tip:  { bg: 'bg-tertiary/5 border-tertiary/20', icon: 'lightbulb', color: 'text-tertiary' },
  }[type]
  return (
    <div className={`flex gap-3 border rounded-xl p-4 ${styles.bg}`}>
      <span className={`material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5 ${styles.color}`}>{styles.icon}</span>
      <div className="text-sm text-on-surface-variant">{children}</div>
    </div>
  )
}

const nav = [
  { id: 'overview',     label: 'Overview' },
  { id: 'quickstart',   label: 'Quick Start' },
  { id: 'configuration',label: 'Configuration' },
  { id: 'theme',        label: 'Theme & Branding' },
  { id: 'database',     label: 'Database' },
  { id: 'deployment',   label: 'Deployment' },
  { id: 'ai-prompt',    label: 'AI Setup Prompt' },
]

export default function ManualPage() {
  const aiPrompt = `I want to set up Veltra CMS for a new project.

Veltra CMS is a white-label Next.js 16 + Supabase admin panel.
GitHub repo: https://github.com/BartBurggraaf/Veltra-CMS-Base

Please help me:
1. Clone the repo into a \`cms/\` folder in my project (or a standalone folder)
2. Create a \`.env.local\` file with these variables filled in:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - SUPABASE_ACCESS_TOKEN  (personal access token from supabase.com/dashboard/account/tokens)
   - NEXT_PUBLIC_CMS_NAME   (my project name)
   - NEXT_PUBLIC_CMS_TAGLINE
   - NEXT_PUBLIC_CMS_DOMAIN
   - NEXT_PUBLIC_BRAND_PRIMARY       (my primary brand color, hex)
   - NEXT_PUBLIC_BRAND_PRIMARY_DIM   (darker shade, hex)
   - NEXT_PUBLIC_BRAND_ON_PRIMARY    (text color on primary bg, hex)
   - NEXT_PUBLIC_BRAND_FONT_HEADLINE (Google Font name)
   - NEXT_PUBLIC_BRAND_FONT_BODY     (Google Font name)
   - NEXT_PUBLIC_BRAND_LOGO          (path to logo in /public, e.g. /logo.svg)
3. Run \`npm run setup\` inside the cms folder — this applies the database migration and creates the first admin user
4. Run \`npm run dev\` to start the CMS at http://localhost:3000

My project details:
- Project name: [FILL IN]
- Primary brand color: [FILL IN HEX]
- Headline font: [FILL IN GOOGLE FONT NAME]
- Body font: [FILL IN GOOGLE FONT NAME]
- Supabase project URL: [FILL IN]
- Supabase anon key: [FILL IN]
- Supabase service role key: [FILL IN]
- Supabase access token: [FILL IN]

The CMS toggleable modules (set to true/false in config/site.ts or leave as defaults):
pages, blog, media, forms, seo, style, users, activity

After setup I should be able to log in at http://localhost:3000 with the admin credentials I create during \`npm run setup\`.`

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-surface-container-lowest border-b border-surface-container-high px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">menu_book</span>
          <span className="font-headline font-bold text-on-surface">{site.name} — Manual</span>
        </div>
        <a href="/dashboard" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to CMS
        </a>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-12 flex gap-12">
        {/* Sidebar nav */}
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <nav className="sticky top-24 space-y-1">
            {nav.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-sm text-outline hover:text-on-surface py-1.5 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 space-y-14 min-w-0">

          {/* Hero */}
          <div>
            <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-3">
              Veltra CMS Manual
            </h1>
            <p className="text-lg text-on-surface-variant">
              Everything you need to install, configure, and deploy the CMS for any project.
            </p>
          </div>

          {/* Overview */}
          <Section id="overview" icon="info" title="Overview">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Veltra CMS is a white-label content management admin panel built on <strong className="text-on-surface">Next.js 16</strong>, <strong className="text-on-surface">React 19</strong>, <strong className="text-on-surface">Tailwind CSS v4</strong>, and <strong className="text-on-surface">Supabase</strong>. It is designed to be cloned once and reused across multiple client projects with minimal configuration.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {['Pages', 'Blog', 'Media Library', 'Form Submissions', 'SEO Settings', 'Style Preview', 'User Management', 'Activity Log', 'Dashboard'].map(m => (
                <div key={m} className="bg-surface-container-lowest border border-surface-container-high rounded-lg px-3 py-2 text-xs font-semibold text-on-surface">
                  {m}
                </div>
              ))}
            </div>
            <Callout type="tip">
              All modules are individually toggleable in <code className="text-xs font-mono bg-surface-container px-1 rounded">config/site.ts</code>. Disable any module your client doesn&apos;t need.
            </Callout>
          </Section>

          {/* Quick Start */}
          <Section id="quickstart" icon="rocket_launch" title="Quick Start">
            <Step n={1} title="Clone the repository">
              <Code>{`git clone https://github.com/BartBurggraaf/Veltra-CMS-Base cms
cd cms`}</Code>
            </Step>
            <Step n={2} title="Create a Supabase project">
              <p>Go to <strong>supabase.com</strong> → New project. Once created, go to <strong>Project Settings → API</strong> and copy the Project URL, anon key, and service role key.</p>
              <p>Also generate a personal access token at <strong>supabase.com/dashboard/account/tokens</strong> — this is needed for the automatic migration.</p>
            </Step>
            <Step n={3} title="Create .env.local">
              <Code>{`cp .env.example .env.local
# Then fill in your values`}</Code>
              <p>At minimum you need: <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code>, <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code>, and <code className="font-mono text-xs">SUPABASE_ACCESS_TOKEN</code>.</p>
            </Step>
            <Step n={4} title="Run the setup script">
              <Code>{`npm install
npm run setup`}</Code>
              <p>This applies the database migration automatically and prompts you to create the first admin user. No Supabase dashboard interaction required.</p>
            </Step>
            <Step n={5} title="Start the CMS">
              <Code>{`npm run dev`}</Code>
              <p>The CMS is now running at <strong>http://localhost:3000</strong>. Log in with the admin credentials you just created.</p>
            </Step>
          </Section>

          {/* Configuration */}
          <Section id="configuration" icon="tune" title="Configuration">
            <p className="text-sm text-on-surface-variant">There are two ways to configure the CMS per project. Use whichever fits your workflow.</p>

            <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-surface-container-high">
                <p className="font-semibold text-on-surface text-sm">Option A — Environment variables (recommended)</p>
                <p className="text-xs text-outline mt-0.5">No source file changes. Just set vars in <code className="font-mono">.env.local</code>.</p>
              </div>
              <div className="p-5">
                <Code>{`# Identity
NEXT_PUBLIC_CMS_NAME=Acme Admin
NEXT_PUBLIC_CMS_TAGLINE=Content Portal
NEXT_PUBLIC_CMS_DOMAIN=acme.com

# Brand
NEXT_PUBLIC_BRAND_PRIMARY=#e63946
NEXT_PUBLIC_BRAND_PRIMARY_DIM=#c1121f
NEXT_PUBLIC_BRAND_ON_PRIMARY=#ffffff
NEXT_PUBLIC_BRAND_FONT_HEADLINE=Playfair Display
NEXT_PUBLIC_BRAND_FONT_BODY=DM Sans
NEXT_PUBLIC_BRAND_LOGO=/logo.svg`}</Code>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-surface-container-high">
                <p className="font-semibold text-on-surface text-sm">Option B — Edit config files directly</p>
                <p className="text-xs text-outline mt-0.5">For full control over all theme tokens.</p>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-on-surface-variant"><code className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">config/site.ts</code> — name, tagline, domain, which modules are enabled, nav order</p>
                <p className="text-sm text-on-surface-variant"><code className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">config/theme.ts</code> — full color palette, fonts, radii, sidebar width, logo</p>
                <Callout type="warn">When using Option B, these files will differ from the base repo. Be careful when pulling updates.</Callout>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-5">
              <p className="font-semibold text-on-surface text-sm mb-3">Toggling modules</p>
              <p className="text-sm text-on-surface-variant mb-3">In <code className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">config/site.ts</code>, set any feature to <code className="font-mono text-xs">false</code> to hide it from the sidebar:</p>
              <Code>{`features: {
  pages:    true,
  blog:     false,   // hide blog module
  style:    true,
  users:    true,
  media:    true,
  seo:      true,
  activity: true,
  forms:    false,   // hide forms module
}`}</Code>
            </div>
          </Section>

          {/* Theme */}
          <Section id="theme" icon="palette" title="Theme & Branding">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              The entire visual system is driven by CSS custom properties injected from <code className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">config/theme.ts</code>. Every Tailwind color class (e.g. <code className="font-mono text-xs">bg-primary</code>, <code className="font-mono text-xs">text-on-surface</code>) maps to a CSS variable, so changing one value updates the entire UI instantly.
            </p>

            <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-5 space-y-3">
              <p className="font-semibold text-on-surface text-sm">Sharing styles from a parent project</p>
              <p className="text-sm text-on-surface-variant">If your main website already has a defined color palette, copy the values into <code className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">.env.local</code> using the <code className="font-mono text-xs">NEXT_PUBLIC_BRAND_*</code> vars. The CMS will immediately adopt your brand without any code changes.</p>
              <p className="text-sm text-on-surface-variant">Fonts must be available on <strong>Google Fonts</strong>. The CMS loads them automatically by name — just provide the font family name exactly as it appears on fonts.google.com.</p>
            </div>

            <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-5 space-y-2">
              <p className="font-semibold text-on-surface text-sm">Logo</p>
              <p className="text-sm text-on-surface-variant">Place your logo file in the <code className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">public/</code> folder and set <code className="font-mono text-xs">NEXT_PUBLIC_BRAND_LOGO=/your-logo.svg</code>. SVG recommended for best quality. If no logo is set or the file is not found, only the site name is shown.</p>
            </div>

            <Callout type="tip">
              Visit <strong>/style</strong> in the CMS to preview your full color palette, typography, and component styles in real time.
            </Callout>
          </Section>

          {/* Database */}
          <Section id="database" icon="database" title="Database">
            <p className="text-sm text-on-surface-variant">The database schema is defined in <code className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">supabase/migrations/001_init.sql</code> and applied automatically by <code className="font-mono text-xs">npm run setup</code>.</p>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { table: 'profiles',         desc: 'Extends Supabase auth.users with role and status' },
                { table: 'pages',            desc: 'Website pages with JSONB content blocks' },
                { table: 'blog_posts',       desc: 'Blog posts with scheduling and tags' },
                { table: 'media',            desc: 'Uploaded files and images' },
                { table: 'form_submissions', desc: 'Inbound form data from your website' },
                { table: 'activity_log',     desc: 'Audit trail of all CMS actions' },
                { table: 'seo_settings',     desc: 'Global SEO and analytics config' },
              ].map(({ table, desc }) => (
                <div key={table} className="bg-surface-container-lowest border border-surface-container-high rounded-lg p-4">
                  <p className="font-mono text-xs font-bold text-primary mb-1">{table}</p>
                  <p className="text-xs text-on-surface-variant">{desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-5 space-y-2">
              <p className="font-semibold text-on-surface text-sm">User roles</p>
              <div className="space-y-1.5">
                {[
                  { role: 'admin',  desc: 'Full access — manage users, delete content, change settings' },
                  { role: 'editor', desc: 'Create and edit content, upload media' },
                  { role: 'viewer', desc: 'Read-only access to the CMS' },
                ].map(({ role, desc }) => (
                  <div key={role} className="flex items-start gap-3 text-sm">
                    <span className="font-mono font-bold text-xs text-primary w-14 flex-shrink-0 mt-0.5">{role}</span>
                    <span className="text-on-surface-variant">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <Callout type="info">
              Row Level Security is enabled on all tables. Users can only access data their role permits. The <code className="font-mono text-xs">current_user_role()</code> function is used in all policies.
            </Callout>
          </Section>

          {/* Deployment */}
          <Section id="deployment" icon="cloud_upload" title="Deployment">
            <p className="text-sm text-on-surface-variant">Veltra CMS is a standard Next.js app and can be deployed anywhere Next.js runs.</p>

            <div className="space-y-4">
              <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-5">
                <p className="font-semibold text-on-surface text-sm mb-3">Vercel (recommended)</p>
                <Step n={1} title="Push your configured repo to GitHub">
                  <Code>{`git add .
git commit -m "Configure for [client name]"
git push`}</Code>
                </Step>
                <Step n={2} title="Import to Vercel">
                  <p>Go to <strong>vercel.com</strong> → New Project → Import your repo. Set the root directory to <code className="font-mono text-xs">cms/</code> if the CMS is a subfolder.</p>
                </Step>
                <Step n={3} title="Add environment variables">
                  <p>In Vercel project settings → Environment Variables, add all vars from your <code className="font-mono text-xs">.env.local</code>. Do <strong>not</strong> commit <code className="font-mono text-xs">.env.local</code> to git.</p>
                </Step>
              </div>

              <Callout type="warn">
                <strong>Never commit .env.local to git.</strong> It contains your Supabase service role key which grants full database access. The <code className="font-mono text-xs">.gitignore</code> already excludes it.
              </Callout>

              <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-5">
                <p className="font-semibold text-on-surface text-sm mb-2">Multi-client setup</p>
                <p className="text-sm text-on-surface-variant">For each client: create a new Supabase project, clone the repo, configure <code className="font-mono text-xs">.env.local</code> with their credentials and brand, run <code className="font-mono text-xs">npm run setup</code>, deploy. Each client gets a fully isolated CMS with their own database and branding.</p>
              </div>
            </div>
          </Section>

          {/* AI Prompt */}
          <Section id="ai-prompt" icon="smart_toy" title="AI Setup Prompt">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Copy the prompt below into Claude (or any AI assistant) to have it set up a new Veltra CMS instance for your project automatically. Fill in your project details before sending.
            </p>
            <Callout type="tip">
              This prompt works best in <strong>Claude Code</strong> — it will clone the repo, create <code className="font-mono text-xs">.env.local</code>, run the setup script, and start the dev server for you.
            </Callout>

            <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-surface-container-high flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-error">checklist</span>
                <p className="font-semibold text-on-surface text-sm">Before you run the prompt — collect these first</p>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-on-surface-variant">Have the following ready before pasting the prompt. The AI will ask for them.</p>
                <div className="space-y-2">
                  {[
                    { item: 'Supabase project URL', where: 'supabase.com → your project → Project Settings → API → Project URL' },
                    { item: 'Supabase anon key',    where: 'Project Settings → API → Project API keys → anon / public' },
                    { item: 'Supabase service role key', where: 'Project Settings → API → Project API keys → service_role (secret)' },
                    { item: 'Supabase personal access token', where: 'supabase.com/dashboard/account/tokens → Generate new token' },
                    { item: 'Primary brand color (hex)', where: 'Your design file or brand guide, e.g. #e63946' },
                    { item: 'Headline & body font names', where: 'Your design file — must be exact Google Fonts names, e.g. "Playfair Display"' },
                    { item: 'Logo file (SVG or PNG)', where: 'Your brand assets — will be placed in /public/logo.svg' },
                    { item: 'Admin email & password', where: 'Choose credentials for your first admin account' },
                  ].map(({ item, where }) => (
                    <div key={item} className="flex gap-3 text-sm">
                      <span className="material-symbols-outlined text-[16px] text-primary flex-shrink-0 mt-0.5">check_circle</span>
                      <div>
                        <p className="font-semibold text-on-surface">{item}</p>
                        <p className="text-xs text-outline">{where}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Callout type="warn">
                  Keep the service role key and access token private — they grant full database access. Never share them or commit them to git.
                </Callout>
              </div>
            </div>

            <Code>{aiPrompt}</Code>
          </Section>

        </main>
      </div>
    </div>
  )
}
