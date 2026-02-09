import { StreamingMarkdown, createStreamingMarkdown } from '@ycj3/streaming-markdown'


@Entry
@Component
struct Index {
  private stream = createStreamingMarkdown()

  aboutToAppear() {
// Demo text with various inline styles
    const text = `
# StreamDown Demo

Welcome to **StreamDown** - A streaming markdown renderer for HarmonyOS!

Visit our [GitHub repository](https://github.com/ycj3/streamdown-arkts-demo) for more info.

## 1. Inline Styles
- **Bold text** with double asterisks
- *Italic text* with single asterisks
- ~~Strikethrough text~~ with double tildes
- ***Bold and Italic*** combined

## 2. Inline Code Priority
- Normal \`inline code\`
- Verbatim: \`**this is not bold**\` (Markdown standard: code shields styles)
- Mixed: **Bold** and then \`code\`

## 3. Unordered Lists
- First item with **bold**
- Second item with *italic*
- Third item with \`inline code\`
- Nested styles: ***bold italic*** and ~~strikethrough~~

## 4. Ordered Lists
1. First ordered item
2. Second ordered item with **bold**
3. Third ordered item with \`code\`

## 5. Task Lists
- [ ] Unchecked task item
- [x] Checked task item
- [X] Another checked task

## 6. Blockquotes
> This is a blockquote
> With multiple lines
> And **bold** text inside

## 7. Horizontal Rule

---

## 8. Fenced Code Block
\`\`\`typescript
function hello() {
  console.log("Hello StreamDown!");
}
\`\`\`

Enjoy the smooth streaming experience! 🚀
`
    let i = 0

    const timer = setInterval(() => {
      if (i >= text.length) {
        clearInterval(timer)
        this.stream.close()
        return
      }
      const char = text.charAt(i)
      this.stream.push(char)
      i++
    }, 30)
  }

  build() {
    Scroll() {
      Column() {
        StreamingMarkdown({
          controller: this.stream
        })
      }
      .padding(16)
    }
    .width('100%')
    .height('100%')
  }
}
