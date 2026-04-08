'use client'

import { useState, useCallback } from 'react'
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Block, BlockType, PageContent } from './types'

// ─── block palette ────────────────────────────────────────────────────────────

function makeId() { return Math.random().toString(36).slice(2, 10) }

const BLOCK_PALETTE: { type: BlockType; label: string; icon: string; create: () => Block }[] = [
  { type: 'heading',   label: 'Heading',   icon: 'title',        create: () => ({ id: makeId(), type: 'heading',   data: { text: 'New heading', level: 2 } }) },
  { type: 'paragraph', label: 'Paragraph', icon: 'subject',      create: () => ({ id: makeId(), type: 'paragraph', data: { text: 'New paragraph' } }) },
  { type: 'image',     label: 'Image',     icon: 'image',        create: () => ({ id: makeId(), type: 'image',     data: { src: '', alt: '' } }) },
  { type: 'button',    label: 'Button',    icon: 'smart_button', create: () => ({ id: makeId(), type: 'button',    data: { label: 'Click me', href: '/', variant: 'primary' } }) },
  { type: 'divider',   label: 'Divider',   icon: 'horizontal_rule', create: () => ({ id: makeId(), type: 'divider',  data: {} as Record<string, never> }) },
  { type: 'spacer',    label: 'Spacer',    icon: 'space_bar',    create: () => ({ id: makeId(), type: 'spacer',    data: { size: 'md' } }) },
]

// ─── inline block editor ──────────────────────────────────────────────────────

function BlockEditor({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  function set(patch: Partial<Block['data']>) {
    onChange({ ...block, data: { ...block.data, ...patch } } as Block)
  }

  const inp = 'w-full border border-surface-container-high bg-surface-container-lowest rounded-md px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
  const label = 'block text-xs text-outline mb-1'

  switch (block.type) {
    case 'heading':
      return (
        <div className="space-y-2 pt-3">
          <div>
            <span className={label}>Level</span>
            <select className={inp} value={block.data.level} onChange={e => set({ level: Number(e.target.value) as 1|2|3 })}>
              <option value={1}>H1 — Page title</option>
              <option value={2}>H2 — Section title</option>
              <option value={3}>H3 — Sub-section</option>
            </select>
          </div>
          <div>
            <span className={label}>Text</span>
            <input className={inp} value={block.data.text} onChange={e => set({ text: e.target.value })} />
          </div>
        </div>
      )

    case 'paragraph':
      return (
        <div className="pt-3">
          <span className={label}>Text</span>
          <textarea
            className={`${inp} min-h-[80px] resize-y`}
            value={block.data.text}
            onChange={e => set({ text: e.target.value })}
          />
        </div>
      )

    case 'image':
      return (
        <div className="space-y-2 pt-3">
          <div>
            <span className={label}>Image URL</span>
            <input className={inp} placeholder="https://…" value={block.data.src} onChange={e => set({ src: e.target.value })} />
          </div>
          <div>
            <span className={label}>Alt text</span>
            <input className={inp} placeholder="Describe the image" value={block.data.alt} onChange={e => set({ alt: e.target.value })} />
          </div>
        </div>
      )

    case 'button':
      return (
        <div className="space-y-2 pt-3">
          <div>
            <span className={label}>Label</span>
            <input className={inp} value={block.data.label} onChange={e => set({ label: e.target.value })} />
          </div>
          <div>
            <span className={label}>Link (href)</span>
            <input className={inp} placeholder="/contact" value={block.data.href} onChange={e => set({ href: e.target.value })} />
          </div>
          <div>
            <span className={label}>Style</span>
            <select className={inp} value={block.data.variant} onChange={e => set({ variant: e.target.value as 'primary'|'secondary' })}>
              <option value="primary">Primary (filled)</option>
              <option value="secondary">Secondary (outline)</option>
            </select>
          </div>
        </div>
      )

    case 'spacer':
      return (
        <div className="pt-3">
          <span className={label}>Size</span>
          <select className={inp} value={block.data.size} onChange={e => set({ size: e.target.value as 'sm'|'md'|'lg' })}>
            <option value="sm">Small (1rem)</option>
            <option value="md">Medium (2rem)</option>
            <option value="lg">Large (4rem)</option>
          </select>
        </div>
      )

    case 'divider':
      return <p className="pt-3 text-xs text-outline">Horizontal rule — no options.</p>

    default:
      return null
  }
}

// ─── block preview (collapsed state) ─────────────────────────────────────────

function BlockPreview({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':   return <span className="font-semibold text-on-surface">H{block.data.level} — {block.data.text || '(empty)'}</span>
    case 'paragraph': return <span className="text-outline truncate">{block.data.text?.slice(0, 60) || '(empty)'}…</span>
    case 'image':     return <span className="text-outline">{block.data.src ? `Image: ${block.data.src.slice(0, 40)}` : '(no URL set)'}</span>
    case 'button':    return <span className="text-outline">Button: &ldquo;{block.data.label}&rdquo; → {block.data.href}</span>
    case 'divider':   return <span className="text-outline">─────────────────────────</span>
    case 'spacer':    return <span className="text-outline">Spacer ({block.data.size})</span>
    default:          return null
  }
}

// ─── sortable block item ──────────────────────────────────────────────────────

function SortableBlock({
  block, isSelected, onSelect, onChange, onDelete,
}: {
  block: Block
  isSelected: boolean
  onSelect: () => void
  onChange: (b: Block) => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className={`group rounded-xl border transition-colors ${isSelected
        ? 'border-primary bg-surface-container-lowest shadow-sm'
        : 'border-surface-container-high bg-surface-container-lowest hover:border-outline-variant'
      }`}
    >
      <div className="flex items-start gap-2 px-3 py-3">
        {/* Drag handle */}
        <button
          {...attributes} {...listeners}
          className="mt-0.5 p-1 rounded text-outline hover:text-on-surface cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
          tabIndex={-1}
          aria-label="Drag to reorder"
        >
          <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
        </button>

        {/* Content preview / editor */}
        <button
          onClick={onSelect}
          className="flex-1 text-left text-sm min-w-0"
        >
          <BlockPreview block={block} />
          {isSelected && <BlockEditor block={block} onChange={onChange} />}
        </button>

        {/* Delete */}
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="mt-0.5 p-1 rounded text-outline hover:text-error hover:bg-error-container flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete block"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </div>
  )
}

// ─── main PageBuilder ─────────────────────────────────────────────────────────

export interface PageBuilderProps {
  initialContent: PageContent | null
  onChange: (content: PageContent) => void
}

export default function PageBuilder({ initialContent, onChange }: PageBuilderProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialContent?.blocks ?? [])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const emit = useCallback((next: Block[]) => {
    setBlocks(next)
    onChange({ v: 1, blocks: next })
  }, [onChange])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIdx = blocks.findIndex(b => b.id === active.id)
      const newIdx = blocks.findIndex(b => b.id === over.id)
      emit(arrayMove(blocks, oldIdx, newIdx))
    }
  }

  function addBlock(create: () => Block) {
    const block = create()
    const next = [...blocks, block]
    emit(next)
    setSelectedId(block.id)
  }

  function updateBlock(updated: Block) {
    emit(blocks.map(b => b.id === updated.id ? updated : b))
  }

  function deleteBlock(id: string) {
    emit(blocks.filter(b => b.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  return (
    <div className="flex gap-4 min-h-[400px]">
      {/* Block palette */}
      <div className="w-40 flex-shrink-0 space-y-1">
        <p className="text-[10px] font-label uppercase tracking-widest text-outline mb-3 px-1">
          Add block
        </p>
        {BLOCK_PALETTE.map(({ type, label, icon, create }) => (
          <button
            key={type}
            onClick={() => addBlock(create)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="flex-1 min-w-0">
        {blocks.length === 0 ? (
          <div className="h-full min-h-[200px] border-2 border-dashed border-surface-container-high rounded-xl flex items-center justify-center text-outline text-sm">
            Add blocks from the left to build your page
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {blocks.map(block => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    isSelected={selectedId === block.id}
                    onSelect={() => setSelectedId(selectedId === block.id ? null : block.id)}
                    onChange={updateBlock}
                    onDelete={() => deleteBlock(block.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
