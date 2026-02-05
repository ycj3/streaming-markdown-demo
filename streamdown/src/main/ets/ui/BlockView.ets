import { Block, CodeBlock, TextSegment, HeadingBlock } from '../core/protocol'
import { CodeBlockHeader } from './code-block/CodeBlockHeader'
import { CodeBlockBody } from './code-block/CodeBlockBody'
import { parseInlineStyles } from '../core/utils/inline-style-parser'

@Component
export struct BlockView {
  @Prop block: Block;

  // Helper to parse segments from the paragraph text
  parseSegments(text: string): TextSegment[] {
    return parseInlineStyles(text);
  }

  build() {
    Column() {
      if (this.block.type === 'heading') {
        Text() {
          ForEach(this.parseSegments(this.block.text), (seg: TextSegment) => {
            Span(seg.content)
              .fontSize(this.getHeadingSize((this.block as HeadingBlock).level))
              .fontWeight(FontWeight.Bold)
              .fontColor('#1A1A1A')
              .fontFamily(seg.isCode ? 'monospace' : 'sans-serif')
              .fontStyle(seg.isItalic ? FontStyle.Italic : FontStyle.Normal)
              .decoration({
                type: seg.isStrikethrough ? TextDecorationType.LineThrough : TextDecorationType.None,
                color: '#1A1A1A'
              })
              .textBackgroundStyle(seg.isCode ? { color: '#F5F5F5', radius: 4 } : undefined)
          })
        }
        .width('100%')
        .margin({ top: 12, bottom: 8 })
      } else if (this.block.type === 'paragraph') {
        Text() {
          ForEach(this.parseSegments(this.block.text), (seg: TextSegment) => {
            Span(seg.content)
              .fontSize(16)
              // Use monospace for code, otherwise standard sans-serif
              .fontFamily(seg.isCode ? 'monospace' : 'sans-serif')
              // Code usually has a distinct color
              .fontColor(seg.isCode ? '#D32F2F' : '#333333')
              .fontWeight(seg.isBold ? FontWeight.Bold : FontWeight.Normal)
              .fontStyle(seg.isItalic ? FontStyle.Italic : FontStyle.Normal)
              .decoration({
                type: seg.isStrikethrough ? TextDecorationType.LineThrough : TextDecorationType.None,
                color: seg.isCode ? '#D32F2F' : '#333333' // Color is required for some engine versions
              })
              // Inline code background style
              .textBackgroundStyle(seg.isCode ? { color: '#F5F5F5', radius: 4 } : undefined)
          })
        }
        .width('100%')
        .margin({ bottom: 8 })
      } else if (this.block.type === 'code') {
        Column() {
          CodeBlockHeader({
            language: (this.block as CodeBlock).lang || '',
            code: this.block.text
          })
          Divider().color('#EEEEEE').strokeWidth(1)
          CodeBlockBody({
            code: this.block.text,
            language: (this.block as CodeBlock).lang || ''
          })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ top: 16, bottom: 16 })
        .width('100%')
        .clip(true)
        .borderRadius(12)
        .border({ width: 1, color: '#E5E5E5' })
      }
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
  }

  getHeadingSize(level: number): number {
    const sizes = [0, 28, 24, 20, 18, 16, 14];
    return sizes[level] || 16;
  }
}
