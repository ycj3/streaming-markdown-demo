import { Block, BlockDiff } from './protocol'

export class BlockReducer {
  private blocks: Block[] = []
  private current: Block | null = null
  private id = 0

  push(token: string): BlockDiff[] {
    if (token === '\n' && this.current) {
      this.close()
      return []
    }
    if (!this.current) {
      this.current = { id: this.id++, type: 'paragraph', text: token }
      this.blocks.push(this.current)
      return [{ kind: 'append', block: this.current }]
    }

    this.current.text += token
    return [{ kind: 'patch', id: this.current.id, block: { ...this.current } }]
  }

  close(): void {
    this.current = null
  }
}
