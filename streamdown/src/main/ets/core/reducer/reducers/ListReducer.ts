import { BlockDiff, ListItemBlock } from "../../protocol";
import { BaseReducer } from "../BaseReducer";
import { ReducerContext, ReducerResult, ParseMode } from "../types";

/**
 * ListReducer - Handles unordered list items
 *
 * Responsibilities:
 * 1. Detect list item start (- at line start followed by space)
 * 2. Collect list item content
 * 3. Handle newlines (end current list item)
 *
 * State transitions:
 * Paragraph -> List (- detected at line start followed by space)
 * List -> Paragraph (newline encountered)
 */
export class ListReducer extends BaseReducer {
  /**
   * Check if list item mode can start
   * Must be at line start and see "- " pattern
   */
  canStartList(char: string, context: ReducerContext): boolean {
    return (
      char === "-" &&
      context.mode === ParseMode.Paragraph &&
      (!context.currentBlock || context.currentBlock.text === "")
    );
  }

  /**
   * Start list item mode
   * Note: Returns handled: true and newMode so we switch to List mode
   * The '-' character will be skipped (not part of content)
   */
  startList(context: ReducerContext): ReducerResult {
    // Don't create block yet, wait for space
    // handled: true means the '-' character is consumed (skipped)
    return { diffs: [], handled: true, newMode: ParseMode.List };
  }

  /**
   * Main processing logic
   */
  process(char: string, context: ReducerContext): ReducerResult {
    if (context.mode !== ParseMode.List) {
      return this.notHandled();
    }

    const diffs: BlockDiff[] = [];

    // Handle newline - end list item mode
    if (char === "\n") {
      context.mode = ParseMode.Paragraph;
      context.currentBlock = null;  // Clear current block for next list item detection
      return this.noChange();
    }

    // If no current block, create list item block
    if (!context.currentBlock || context.currentBlock.type !== "listItem") {
      const block = this.createListItemBlock(context);
      diffs.push(this.createAppendDiff(block));
      
      // Skip the first space after '-' if present
      if (char === " ") {
        return this.withDiffs(...diffs);
      }
    }

    // Append to current list item
    this.appendToCurrentBlock(char, context);
    const patch = this.emitPatch(context);
    if (patch) {
      diffs.push(patch);
    }

    return this.withDiffs(...diffs);
  }

  /**
   * Flush pending backticks
   */
  flushBackticks(count: number, context: ReducerContext): ReducerResult {
    if (context.mode !== ParseMode.List) {
      return this.notHandled();
    }

    const ticks = "`".repeat(count);
    
    // If no current block yet, create one
    if (!context.currentBlock || context.currentBlock.type !== "listItem") {
      const block = this.createListItemBlock(context);
      block.text = ticks;
      const patch = this.emitPatch(context);
      return this.withDiffs(
        this.createAppendDiff(block),
        ...(patch ? [patch] : [])
      );
    }

    this.appendToCurrentBlock(ticks, context);
    const patch = this.emitPatch(context);
    return patch ? this.withDiffs(patch) : this.noChange();
  }

  /**
   * Create list item block
   */
  private createListItemBlock(context: ReducerContext): ListItemBlock {
    const block: ListItemBlock = {
      id: context.nextBlockId++,
      type: "listItem",
      text: "",
    };

    context.blocks.push(block);
    context.currentBlock = block;
    return block;
  }
}
