export type Block =
  | {
    id: number
    type: 'paragraph'
    text: string
  }
    | {
    id: number
    type: 'code'
    text: string
  }

export type BlockDiff =
  | { kind: 'append'; block: Block }
    | { kind: 'patch'; id: number; block: Block }
