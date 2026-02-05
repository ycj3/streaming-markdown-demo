export type ParagraphBlock = {
  id: number
  type: 'paragraph'
  text: string
}

export type CodeBlock = {
  id: number
  type: 'code'
  lang?: string
  text: string
}

export type HeadingBlock = {
  id: number
  type: 'heading'
  level: number // 1 for #, 2 for ##, etc.
  text: string
}

export class TextSegment {
  content: string = ""
  isCode: boolean = false
  isBold: boolean = false
  isItalic: boolean = false
  isStrikethrough: boolean = false
}

export type Block = ParagraphBlock | CodeBlock | HeadingBlock

export type BlockDiff =
  | { kind: 'append'; block: Block }
    | { kind: 'patch'; id: number; block: Block }
