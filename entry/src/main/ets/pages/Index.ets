import { StreamDown, createStreamDown } from '@ycj3/streamdown'


@Entry
@Component
struct Index {
  private stream = createStreamDown()

  aboutToAppear() {
// Demo text with various inline styles
    const text = `
# StreamDown Demo

Welcome to **StreamDown** - A streaming markdown renderer for HarmonyOS!

## 1. Inline Styles
- **Bold text** with double asterisks
- *Italic text* with single asterisks
- ~~Strikethrough text~~ with double tildes
- ***Bold and Italic*** combined

## 2. Inline Code Priority
- Normal \`inline code\`
- Verbatim: \`**this is not bold**\` (Markdown standard: code shields styles)
- Mixed: **Bold** and then \`code\`

## 3. Fenced Code Block
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
        StreamDown({
          controller: this.stream
        })
      }
      .padding(16)
    }
    .width('100%')
    .height('100%')
  }
}
