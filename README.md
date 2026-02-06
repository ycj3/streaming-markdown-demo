# StreamDown ArkTS Demo

> [English Version](./README_EN.md)

`StreamDown ArkTS Demo` 是 HarmonyOS ArkTS 的流式 Markdown 渲染器演示项目，专为实时 LLM 对话场景设计。

> **在线体验**: 在 DevEco Studio 中运行，查看流式渲染效果

## 📺 渲染效果

<div align="left">
  <video src="https://github.com/user-attachments/assets/d4ba10a2-5311-4a15-b844-976112c95f36" width="300px" autoplay muted loop>
  </video>
</div>

## 🚀 快速开始

### 环境要求

- DevEco Studio 4.0+
- HarmonyOS SDK 6.0.1+
- Node.js 16+

### 运行项目

1. **克隆仓库**

   ```bash
   git clone https://github.com/ycj3/streamdown-arkts-demo.git
   cd StreamDownDemo
   ```

2. **打开项目**

   - 使用 DevEco Studio 打开项目根目录
   - 等待 Gradle Sync 完成

3. **运行 Demo**
   - 连接 HarmonyOS 设备或启动模拟器
   - 点击 **Run** ▶️ 按钮

---

## 📦 StreamDown 包开发路线图

> The roadmap represents planned directions and may change based on feedback.

### v1.0.0 (当前版本)

> 核心 Markdown 渲染能力

- [x] 流式字符级解析
- [x] 标题、段落、代码块基础渲染
- [x] 行内样式（粗体、斜体、删除线、行内代码）
- [x] 代码块复制功能
- [x] 基础语法高亮
- [x] ohpm 官方发布

### v1.1.0 (规划中)

> 扩展 Markdown 语法支持

- [ ] 无序列表 (`- item`)
- [ ] 有序列表 (`1. item`)
- [ ] 任务列表 (`- [ ] task`)
- [ ] 引用块 (`> quote`)
- [ ] 分割线 (`---`)
- [ ] 链接渲染 (`[text](url)`)

### v1.2.0 (规划中)

> 表格与增强功能

- [ ] 表格支持 (`| col1 | col2 |`)
- [ ] 图片渲染 (`![alt](url)`)
- [ ] LaTeX 公式块 (`$$...$$`)
- [ ] 折叠详情块 (`<details>`)
- [ ] 主题配置 API

### v2.0.0 (规划中)

> 稳定版发布

- [ ] 性能优化（大数据量渲染）
- [ ] 完整单元测试覆盖
- [ ] TypeScript 类型完善
- [ ] API 稳定化
- [ ] 详细文档与示例
- [ ] ohpm 官方发布

### v2.1.0+ (未来规划)

- [ ] Mermaid 图表支持
- [ ] 自定义组件扩展
- [ ] 虚拟滚动优化
- [ ] 暗黑模式支持

---

## 🏗️ 项目结构

```
StreamDownDemo/
├── entry/              # 示例应用入口
│   └── src/main/ets/pages/
│       └── Index.ets   # Demo 页面
├── streamdown/         # HAR 模块（核心库）
│   ├── src/main/ets/
│   │   ├── core/       # 解析引擎
│   │   └── ui/         # UI 组件
│   ├── README.md       # 中文文档
│   └── README_EN.md    # 英文文档
└── build-profile.json5 # 构建配置
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 PR！请确保：

1. 代码符合 ArkTS 编码规范
2. 新增功能包含测试用例
3. 更新相关文档

---

## 📮 联系我们

如有问题或建议，欢迎通过以下方式联系：

- 提交 [GitHub Issue](../../issues)
- 发送邮件至：<carlsonyuandev@gmail.com>
