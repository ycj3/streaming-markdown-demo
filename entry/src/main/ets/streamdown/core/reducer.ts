import { Block, BlockDiff, CodeBlock } from "./protocol";

enum Mode {
  Paragraph,
  FenceStart,    // After opening ```, collecting language
  Code,          // Inside code block, collecting code
}

export class BlockReducer {
  private blocks: Block[] = [];
  private current: Block | null = null;
  private id = 0;

  private mode: Mode = Mode.Paragraph;
  private backticks = 0;
  private langBuffer = "";  // Buffer for collecting language identifier

  push(token: string): BlockDiff[] {
    const diffs: BlockDiff[] = [];

    if (token === "`") {
      this.backticks++;
      if (this.backticks < 3) {
        // Delay processing until we know if it's a code fence
        return diffs;
      }
    } else {
      // If not a backtick, flush any delayed backticks to the paragraph
      if (this.backticks > 0 && this.backticks < 3) {
        for (let i = 0; i < this.backticks; i++) {
          this.appendToParagraph("`", diffs);
        }
      }
      this.backticks = 0; // Reset backticks
    }

    if (this.backticks === 3) {
      // Handle code fence
      this.backticks = 0; // Reset backticks after detecting a fence
      if (this.mode === Mode.Code || this.mode === Mode.FenceStart) {
        // Close code block
        this.mode = Mode.Paragraph;
        this.current = null;
        this.langBuffer = "";
      } else {
        // Open code block - switch to FenceStart mode to capture language
        this.mode = Mode.FenceStart;
        this.langBuffer = "";
        this.current = {
          id: this.id++,
          type: "code",
          text: "",
        };
        this.blocks.push(this.current);
        diffs.push({ kind: "append", block: this.current });
      }
      return diffs;
    }

    if (this.mode === Mode.FenceStart) {
      // Collecting language identifier
      if (token === "\n") {
        // End of language line, switch to Code mode
        if (this.current && this.current.type === 'code' && this.langBuffer.trim()) {
          (this.current as CodeBlock).lang = this.langBuffer.trim();
          // Update the block with language info
          diffs.push({
            kind: "patch",
            id: this.current.id,
            block: { ...this.current },
          });
        }
        this.mode = Mode.Code;
        this.langBuffer = "";
      } else {
        // Collect language characters
        this.langBuffer += token;
      }
    } else if (this.mode === Mode.Code) {
      // Append to code block
      this.appendToCode(token, diffs);
    } else {
      // Append to paragraph
      this.appendToParagraph(token, diffs);
    }

    return diffs;
  }

  close() {
    this.finishCurrent();
  }
  // ---------- helpers ----------

  private finishCurrent() {
    this.current = null;
    this.backticks = 0;
    this.langBuffer = "";
  }

  private appendToParagraph(token: string, diffs: BlockDiff[]) {
    if (!this.current || this.current.type !== "paragraph") {
      this.current = {
        id: this.id++,
        type: "paragraph",
        text: token,
      };
      this.blocks.push(this.current);
      diffs.push({ kind: "append", block: this.current });
    } else {
      this.current.text += token;
      diffs.push({
        kind: "patch",
        id: this.current.id,
        block: { ...this.current },
      });
    }
  }

  private appendToCode(token: string, diffs: BlockDiff[]) {
    if (!this.current || this.current.type !== "code") return;

    if (token !== "`") {
      this.current.text += token;
      diffs.push({
        kind: "patch",
        id: this.current.id,
        block: { ...this.current },
      });
    }
  }
}
