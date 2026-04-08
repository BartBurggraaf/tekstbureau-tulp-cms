import TopBar from '@/components/layout/TopBar'
import { createPage } from '../actions'

export default function NewPagePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="New Page" />
      <div className="p-9 max-w-lg">
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          New Page
        </h1>
        <p className="text-on-surface-variant text-sm mb-8">
          Give the page a title and a URL slug. You can edit the content after creation.
        </p>

        <form action={createPage} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">
              Title
            </label>
            <input
              name="title"
              type="text"
              required
              placeholder="e.g. About us"
              className="w-full border border-surface-container-high bg-surface-container-lowest rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">
              Slug <span className="text-outline font-normal">(URL path)</span>
            </label>
            <div className="flex items-center border border-surface-container-high bg-surface-container-lowest rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary">
              <span className="px-3 py-2.5 text-sm text-outline bg-surface-container border-r border-surface-container-high select-none">
                /
              </span>
              <input
                name="slug"
                type="text"
                required
                placeholder="over-ons"
                pattern="[a-z0-9-]+"
                title="Lowercase letters, numbers, and hyphens only"
                className="flex-1 px-3 py-2.5 text-sm text-on-surface bg-transparent focus:outline-none"
              />
            </div>
            <p className="text-xs text-outline mt-1.5">Lowercase letters, numbers, hyphens only.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="primary-gradient text-on-primary px-6 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Create Page
            </button>
            <a
              href="/pages"
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
