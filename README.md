# 💧 SIB — Smart Irrigation Builder

SIB (Smart Irrigation Builder) is an interactive, AI-powered web platform for designing and optimizing water-supply systems. Built for ecological efficiency, the platform allows users to construct custom irrigation flows using real-world infrastructure components such as pumps, tanks, sedimentation units, and more — all within an intuitive drag-and-drop interface.

🧠 With the support of **ChatGPT** and **Gemini**, users receive smart suggestions to reduce water overspending, optimize flow rates, and enhance operational sustainability.

---

## ✨ Key Features

- 🧱 **Visual Builder Interface**  
  Use **Svelte Flow (@xyflow/svelte)** to create water systems from scratch in Builder Mode.

- 📊 **Real-Time Insights & AI Suggestions**  
  The built-in AI assistant analyzes your setup and recommends actionable improvements.

- 📦 **Component Palette**  
  A rich, drag-and-drop node palette including reservoirs, pumps, filters, collectors, tanks, and more — all with editable properties.

- 💬 **SIB-AI Panel**  
  Suggestions are generated from user-configured systems to optimize water flow, pressure, and minimize loss.

- 📤📥 **JSON Export & Import**  
  Seamlessly save and load your irrigation system designs using structured JSON files. Perfect for backups, sharing, or continuing where you left off.

---

## 🛠 Tech Stack

| Tool                 | Role                                     |
| -------------------- | ---------------------------------------- |
| **SvelteKit**        | Frontend framework & SPA routing         |
| **TailwindCSS**      | Utility-first styling                    |
| **Flowbite-Svelte**  | UI components (buttons, sidebars, etc.)  |
| **Svelte Flow**      | Interactive system builder (nodes/edges) |
| **ChatGPT / Gemini** | AI advisory & optimization engine        |

---

## 🧩 To-Do

- [ ] Add a `Delete` shortcut using the **DEL** key to remove selected nodes and edges.
- [ ] Add data visualization & infographics with **Flowbite-Charts**.

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/alphazhan/sib

# Install dependencies
cd sib
pnpm install

# Run the development server
pnpm dev
```

Visit http://localhost:5173 to start building your irrigation system.
