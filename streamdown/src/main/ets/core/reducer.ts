import { Block, BlockDiff, CodeBlock } from "./protocol";
import { handleIncompleteInlineCode } from "./utils/inline-code-handler";
import {
  countSingleBackticks,
  isPartOfTripleBacktick,
} from "./utils/code-block-utils";

/**
 * Parser states for the markdown tokenizer.
 * Each state represents the current parsing context.
 */
enum ParseMode {
  /** Normal paragraph text */
  Paragraph = 0,
  /** After opening ```, collecting language identifier */
  FenceStart = 1,
  /** Inside fenced code block, collecting code content */
  Code = 2,
  /** Inside inline code with single backtick */
  InlineCode = 3,
  Heading = 4,
}

/**
 * BlockReducer - A streaming markdown parser that processes characters incrementally.
 *
 * Supports:
 * - Paragraph blocks (default text)
 * - Fenced code blocks (```lang\ncode\n```)
 * - Inline code (`code`)
 *
 * Design goals:
 * - Incremental parsing: processes one character at a time
 * - Immutable diffs: returns changes that can be applied to external state
 * - Memory efficient: minimal object allocation per character
 */
export class BlockReducer {
  /** All parsed blocks */
  private blocks: Block[] = [];
  /** Currently active block being built */
  private currentBlock: Block | null = null;
  /** Auto-incrementing block ID */
  private nextBlockId: number = 0;

  /** Current parsing state */
  private mode: ParseMode;
  /** Number of consecutive backticks seen (1-3) */
  private pendingBackticks: number = 0;
  /** Buffer for collecting language identifier after ``` */
  private languageBuffer: string = "";

  private headingLevel: number = 0;

  /**
   * Process a single character and return any state changes.
   *
   * @param char - The input character to process
   * @returns Array of diffs representing state changes (empty if no changes)
   */
  push(char: string): BlockDiff[] {
    const diffs: BlockDiff[] = [];

    // Accumulate backticks to distinguish types (`, ``, ```)
    if (char === "`") {
      this.pendingBackticks++;
      // Got 3 backticks - this is a code fence
      if (this.pendingBackticks === 3) {
        return this.handleCodeFence(diffs);
      }
      return diffs;
    }

    // Flush pending backticks before processing the current non-backtick char
    if (this.pendingBackticks > 0) {
      this.flushPendingBackticks(diffs);
    }

    if (
      this.mode === ParseMode.Paragraph &&
      char === "#" &&
      (!this.currentBlock || this.currentBlock.text === "")
    ) {
      this.mode = ParseMode.Heading;
      this.headingLevel = 1;
      return diffs;
    }

    // Normal character routing
    switch (this.mode) {
      case ParseMode.Heading:
        if (char === "#") {
          this.headingLevel++;
          if (this.headingLevel > 6) {
            this.mode = ParseMode.Paragraph;
            this.appendToParagraph("#".repeat(this.headingLevel), diffs);
          }
          return diffs;
        } else if (char === " ") {
          this.currentBlock = {
            id: this.nextBlockId++,
            type: "heading",
            level: this.headingLevel,
            text: "",
          };
          this.blocks.push(this.currentBlock);
          diffs.push({ kind: "append", block: this.currentBlock });

          this.mode = ParseMode.Paragraph;
          this.headingLevel = 0;
          return diffs;
        } else {
          const hashes = "#".repeat(this.headingLevel);
          this.headingLevel = 0;
          this.mode = ParseMode.Paragraph;
          this.appendToParagraph(hashes + char, diffs);
          return diffs;
        }
      case ParseMode.FenceStart:
        this.handleFenceStart(char, diffs);
        break;
      case ParseMode.Code:
        this.appendToCurrentBlock(char, diffs);
        break;
      case ParseMode.InlineCode:
      default:
        if (char === "\n") {
          this.closeCurrentBlock();
          return diffs;
        }
        this.appendToCurrentBlockOrParagraph(char, diffs);
    }

    return diffs;
  }

  // ==================== Private: State Handlers ====================

  private appendToCurrentBlockOrParagraph(char: string, diffs: BlockDiff[]) {
    if (this.currentBlock) {
      this.currentBlock.text += char;
      this.emitPatch(diffs);
    } else {
      this.appendToParagraph(char, diffs);
    }
  }
  /**
   * Refined flush logic using countSingleBackticks logic.
   */
  private flushPendingBackticks(diffs: BlockDiff[]): void {
    const ticks = "`".repeat(this.pendingBackticks);
    this.pendingBackticks = 0;

    if (this.mode === ParseMode.Code) {
      this.appendToCurrentBlock(ticks, diffs);
    } else {
      // This allows parseInlineStyles in BlockView to see the backticks
      this.appendToCurrentBlockOrParagraph(ticks, diffs);
    }
  }

  /**
   * Switches between Paragraph and Code Block modes using ``` fence.
   */
  private handleCodeFence(diffs: BlockDiff[]): BlockDiff[] {
    this.pendingBackticks = 0;

    // If already in a code block (or language line), close it
    if (this.mode === ParseMode.Code || this.mode === ParseMode.FenceStart) {
      this.closeCurrentBlock();
    } else {
      // Start a new fenced code block
      this.mode = ParseMode.FenceStart;
      this.languageBuffer = "";
      this.currentBlock = this.createBlock("code");
      diffs.push({ kind: "append", block: this.currentBlock });
    }
    return diffs;
  }

  /**
   * Processes the language string (e.g., ```typescript) until a newline is found.
   */
  private handleFenceStart(char: string, diffs: BlockDiff[]): void {
    if (char === "\n") {
      this.finalizeLanguage(diffs);
      this.mode = ParseMode.Code;
    } else {
      this.languageBuffer += char;
    }
  }

  /**
   * Final repair using the handleIncompleteInlineCode logic.
   */
  close(): BlockDiff[] {
    const diffs: BlockDiff[] = [];

    if (
      this.mode === ParseMode.InlineCode &&
      this.currentBlock?.type === "paragraph"
    ) {
      const originalText = this.currentBlock.text;
      const repairedText = handleIncompleteInlineCode(originalText);

      if (repairedText !== originalText) {
        this.currentBlock.text = repairedText;
        this.emitPatch(diffs);
      }
    }

    this.resetState();
    return diffs;
  }
  // ==================== Private: Block Operations ====================

  /**
   * Create a new block with the next available ID.
   */
  private createBlock(type: "paragraph" | "code" | "inlineCode"): Block {
    const block: Block = {
      id: this.nextBlockId++,
      type,
      text: "",
    } as Block;

    this.blocks.push(block);
    return block;
  }

  private startInlineCode(diffs: BlockDiff[]): void {
    this.mode = ParseMode.InlineCode;
    this.currentBlock = this.createBlock("inlineCode");
    diffs.push({ kind: "append", block: this.currentBlock });
  }

  /**
   * Append text to paragraph block, creating one if needed.
   */
  private appendToParagraph(text: string, diffs: BlockDiff[]): void {
    if (!this.currentBlock || this.currentBlock.type !== "paragraph") {
      this.currentBlock = {
        id: this.nextBlockId++,
        type: "paragraph",
        text: "",
      };
      this.blocks.push(this.currentBlock);
      diffs.push({ kind: "append", block: this.currentBlock });
    }

    this.currentBlock.text += text;
    this.emitPatch(diffs);
  }

  /**
   * Append text to the current block (code or inline code).
   */
  private appendToCurrentBlock(text: string, diffs: BlockDiff[]): void {
    if (!this.currentBlock) return;

    this.currentBlock.text += text;
    this.emitPatch(diffs);
  }

  /**
   * Finalize language identifier for code blocks.
   * Emits a patch with the updated language info.
   */
  private finalizeLanguage(diffs: BlockDiff[]): void {
    if (!this.currentBlock || this.currentBlock.type !== "code") return;

    const lang = this.languageBuffer.trim();
    if (!lang) return;

    (this.currentBlock as CodeBlock).lang = lang;

    // Emit patch with complete block state including language
    const codeBlock = this.currentBlock as CodeBlock;
    diffs.push({
      kind: "patch",
      id: codeBlock.id,
      block: {
        id: codeBlock.id,
        type: "code",
        lang: codeBlock.lang,
        text: codeBlock.text,
      },
    });
  }

  /**
   * Emit a patch diff for the current block.
   */
  private emitPatch(diffs: BlockDiff[]): void {
    if (!this.currentBlock) return;

    diffs.push({
      kind: "patch",
      id: this.currentBlock.id,
      block: { ...this.currentBlock },
    });
  }

  /**
   * Close the current block and return to paragraph mode.
   */
  private closeCurrentBlock(): void {
    this.currentBlock = null;
    this.mode = ParseMode.Paragraph;
    this.languageBuffer = "";
  }

  /**
   * Reset all state to initial values.
   */
  private resetState(): void {
    this.currentBlock = null;
    this.mode = ParseMode.Paragraph;
    this.pendingBackticks = 0;
    this.languageBuffer = "";
  }
}
