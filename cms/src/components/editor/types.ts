// ─── Block definitions ────────────────────────────────────────────────────────

export interface HeadingBlock {
  id: string; type: 'heading'
  data: { text: string; level: 1 | 2 | 3 }
}
export interface ParagraphBlock {
  id: string; type: 'paragraph'
  data: { text: string }
}
export interface ImageBlock {
  id: string; type: 'image'
  data: { src: string; alt: string }
}
export interface ButtonBlock {
  id: string; type: 'button'
  data: { label: string; href: string; variant: 'primary' | 'secondary' }
}
export interface DividerBlock {
  id: string; type: 'divider'
  data: Record<string, never>
}
export interface SpacerBlock {
  id: string; type: 'spacer'
  data: { size: 'sm' | 'md' | 'lg' }
}

export type Block =
  | HeadingBlock | ParagraphBlock | ImageBlock
  | ButtonBlock  | DividerBlock   | SpacerBlock

export type BlockType = Block['type']

// ─── Page content envelope ────────────────────────────────────────────────────

export interface PageContent {
  v: 1
  blocks: Block[]
}

// ─── Palette entry (shown in the Add Block sidebar) ──────────────────────────

export interface BlockDef {
  type: BlockType
  label: string
  icon: string
  create: () => Block
}
