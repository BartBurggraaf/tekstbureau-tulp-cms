import TopBar from '@/components/layout/TopBar'
import { createClient } from '@/lib/supabase/server'

const typeIcon: Record<string, string> = {
  image:    'image',
  video:    'videocam',
  document: 'description',
  other:    'attach_file',
}

function formatBytes(bytes: number) {
  if (bytes < 1024)       return `${bytes} B`
  if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(date).toLocaleDateString('nl-NL')
}

export default async function MediaPage() {
  const supabase = await createClient()
  const { data: files } = await supabase
    .from('media')
    .select('id, name, public_url, media_type, size_bytes, alt_text, created_at')
    .order('created_at', { ascending: false })

  const rows = files ?? []
  const images = rows.filter(f => f.media_type === 'image')
  const others = rows.filter(f => f.media_type !== 'image')

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Media" />
      <div className="p-9 space-y-7">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              Media Library
            </h1>
            <p className="text-on-surface-variant mt-1 text-sm">
              {rows.length} file{rows.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>
          <button className="primary-gradient text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[18px]">upload</span>
            Upload Files
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex gap-2">
          {['All', 'Images', 'Documents', 'Videos'].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container text-outline hover:bg-surface-container-high'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl py-20 flex flex-col items-center gap-4 text-outline">
            <span className="material-symbols-outlined text-6xl opacity-30">photo_library</span>
            <p className="text-sm">No files yet. Upload your first file.</p>
          </div>
        ) : (
          <>
            {/* Image grid */}
            {images.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xs font-label font-bold uppercase tracking-widest text-outline">Images</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {images.map(file => (
                    <div key={file.id} className="group relative bg-surface-container-lowest rounded-xl overflow-hidden aspect-square">
                      <img
                        src={file.public_url}
                        alt={file.alt_text ?? file.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-inverse-surface/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div className="w-full">
                          <p className="text-on-primary text-xs font-bold truncate">{file.name}</p>
                          <p className="text-on-primary/70 text-[10px]">{formatBytes(file.size_bytes)}</p>
                        </div>
                        <button className="absolute top-2 right-2 w-7 h-7 rounded-md bg-surface-container-lowest/80 flex items-center justify-center text-on-surface hover:bg-error-container hover:text-on-error-container transition-colors">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Other files list */}
            {others.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xs font-label font-bold uppercase tracking-widest text-outline">Other Files</h2>
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
                  {others.map((file, i) => (
                    <div
                      key={file.id}
                      className={`group flex items-center justify-between px-6 py-4 hover:bg-surface-container-low transition-colors ${i < others.length - 1 ? 'border-b border-surface-container' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-outline">
                          <span className="material-symbols-outlined text-[18px]">{typeIcon[file.media_type] ?? 'attach_file'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{file.name}</p>
                          <p className="text-xs text-outline">{formatBytes(file.size_bytes)} &bull; {timeAgo(file.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-surface-container rounded-md text-outline">
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                        <button className="p-1.5 hover:bg-error-container rounded-md text-outline hover:text-on-error-container">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
