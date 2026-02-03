import { createStreamDown } from '../streamdown/core/stream'
import { StreamDown } from '../streamdown/ui/StreamDown'

@Entry
@Component
struct Index {
  private stream = createStreamDown()

  aboutToAppear() {
    const text = 'Hello, this is a streaming markdown demo.\n\nIt feels like ChatGPT.'
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
    }, 50)
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
