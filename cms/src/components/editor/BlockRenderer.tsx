/**
 * BlockRenderer — renders PageContent blocks on the public site.
 * Server component safe (no 'use client').
 */
import type { Block, PageContent } from './types'

function renderBlock(block: Block) {
  switch (block.type) {
    case 'heading': {
      const { text, level } = block.data
      const cls = level === 1
        ? 'text-4xl font-extrabold'
        : level === 2
        ? 'text-2xl font-bold'
        : 'text-xl font-semibold'
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3'
      return <Tag className={`font-headline text-on-surface ${cls} mb-4`}>{text}</Tag>
    }

    case 'paragraph':
      return (
        <p className="text-on-surface-variant leading-relaxed mb-4 whitespace-pre-line">
          {block.data.text}
        </p>
      )

    case 'image':
      return block.data.src ? (
        <figure className="mb-6">
          <img
            src={block.data.src}
            alt={block.data.alt}
            className="rounded-xl w-full object-cover"
          />
          {block.data.alt && (
            <figcaption className="text-xs text-outline mt-2 text-center">
              {block.data.alt}
            </figcaption>
          )}
        </figure>
      ) : null

    case 'button': {
      const base = 'inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-label font-bold transition-opacity hover:opacity-90 mb-4'
      const variantCls = block.data.variant === 'primary'
        ? 'primary-gradient text-on-primary'
        : 'border border-primary text-primary'
      return (
        <div>
          <a href={block.data.href} className={`${base} ${variantCls}`}>
            {block.data.label}
          </a>
        </div>
      )
    }

    case 'divider':
      return <hr className="border-outline-variant my-8" />

    case 'spacer': {
      const h = block.data.size === 'sm' ? 'h-4' : block.data.size === 'md' ? 'h-8' : 'h-16'
      return <div className={h} />
    }

    default:
      return null
  }
}

export function BlockRenderer({ content }: { content: PageContent | null | unknown }) {
  const pc = content as PageContent | null
  if (!pc?.blocks?.length) return null
  return (
    <>
      {pc.blocks.map(block => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}
    </>
  )
}
