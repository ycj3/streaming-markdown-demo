import { Block } from '../core/protocol'

@Component
export struct BlockView {
  @Prop block: Block;

  build() {
    if (this.block.type === 'paragraph') {
      Text(this.block.text)
        .fontSize(16)
        .fontColor('#333333')
        .margin({ bottom: 8 })
    } else {
      Text(this.block.text)
        .fontFamily('Monospace')
        .backgroundColor('#F0F0F0')
    }
  }
}
