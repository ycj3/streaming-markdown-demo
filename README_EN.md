# StreamDown ArkTS Demo

> [中文版本](./README.md)

`StreamDown ArkTS Demo` is a streaming markdown renderer demo project for HarmonyOS ArkTS, designed for real-time LLM chat scenarios.

> **Live Demo**: Run in DevEco Studio to see the streaming rendering effect

## 📺 Rendering Effect

<div align="left">
  <video src="https://github.com/user-attachments/assets/d4ba10a2-5311-4a15-b844-976112c95f36" width="300px" autoplay muted loop>
  </video>
</div>

## 🚀 Quick Start

### Requirements

- DevEco Studio 4.0+
- HarmonyOS SDK 6.0.1+
- Node.js 16+

### Run the Project

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd StreamDownDemo
   ```

2. **Open the project**

   - Open the project root directory in DevEco Studio
   - Wait for Gradle Sync to complete

3. **Run the Demo**
   - Connect a HarmonyOS device or start an emulator
   - Click the **Run** ▶️ button

---

## 📦 StreamDown Package Roadmap

> The roadmap represents planned directions and may change based on feedback.

### v1.0.0 (Current)

> Core Markdown rendering capabilities

- [x] Streaming character-level parsing
- [x] Basic rendering for headings, paragraphs, code blocks
- [x] Inline styles (bold, italic, strikethrough, inline code)
- [x] Code block copy functionality
- [x] Basic syntax highlighting
- [x] Official ohpm release

### v1.1.0 (Planned)

> Extended Markdown syntax support

- [ ] Unordered lists (`- item`)
- [ ] Ordered lists (`1. item`)
- [ ] Task lists (`- [ ] task`)
- [ ] Blockquotes (`> quote`)
- [ ] Horizontal rules (`---`)
- [ ] Link rendering (`[text](url)`)

### v1.2.0 (Planned)

> Tables and enhanced features

- [ ] Table support (`| col1 | col2 |`)
- [ ] Image rendering (`![alt](url)`)
- [ ] LaTeX formula blocks (`$$...$$`)
- [ ] Collapsible details (`<details>`)
- [ ] Theme configuration API

### v2.0.0 (Planned)

> Stable release

- [ ] Performance optimization (large data rendering)
- [ ] Full unit test coverage
- [ ] Complete TypeScript types
- [ ] API stabilization
- [ ] Detailed documentation and examples

### v2.1.0+ (Future)

- [ ] Mermaid diagram support
- [ ] Custom component extensions
- [ ] Virtual scroll optimization
- [ ] Dark mode support

---

## 🏗️ Project Structure

```
StreamDownDemo/
├── entry/              # Demo app entry
│   └── src/main/ets/pages/
│       └── Index.ets   # Demo page
├── streamdown/         # HAR module (core library)
│   ├── src/main/ets/
│   │   ├── core/       # Parsing engine
│   │   └── ui/         # UI components
│   ├── README.md       # Chinese documentation
│   └── README_EN.md    # English documentation
└── build-profile.json5 # Build configuration
```

---

## 🤝 Contributing

Issues and PRs are welcome! Please ensure:

1. Code follows ArkTS coding standards
2. New features include test cases
3. Relevant documentation is updated

---

## 📮 Contact

For questions or suggestions, please contact us via:

- Submit a [GitHub Issue](../../issues)
- Email: <carlsonyuandev@gmail.com>
