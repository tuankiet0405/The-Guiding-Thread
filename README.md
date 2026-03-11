# The Guiding Thread

A highly engineered, interactive scroll-driven portfolio proving technical competence and design sensibility through flawless execution. Built with React, Vite, Tailwind CSS, GSAP, and Lenis.

## Features

- **4-Act Narrative Structure**: A continuous glowing SVG thread guides users through the experience.
- **Scroll-Driven Physics**: Advanced GSAP animations tied to scroll position (scrubbing, velocity tracking, pinning).
- **Subtractive UI Design**: "Dark void default. Light only illuminates structure."
- **Performance Optimized**: GPU-accelerated transforms, `will-change` management, and clean React + GSAP integration.
- **Fully Accessible**: Keyboard navigation support, skip-to-content links, `prefers-reduced-motion` integration, and semantic HTML.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS (Custom design system based on `Space Grotesk`, `JetBrains Mono`, and `Inter`)
- **Animation**: GSAP (ScrollTrigger, Flip)
- **Smooth Scroll**: Lenis

## Project Structure

```
src/
├── main.tsx                     # React entry point
├── App.tsx                      # Root component, assembles the 4 acts and handles global scroll
├── index.css                    # Global styles, CSS custom properties, and Tailwind config
├── components/
│   ├── GenesisHook.tsx          # Act I: The introduction
│   ├── HorizontalProcess.tsx    # Act II: Horizontal scrolling section
│   ├── ProofNodes.tsx           # Act III: Interactive portfolio pieces
│   ├── Terminal.tsx             # Act IV: Final CTA and terminal interface
│   ├── ThreadCanvas.tsx         # The guiding SVG thread and orb
│   └── ...                      # Additional UI and effect components (Starfield, Grain, etc.)
└── hooks/
    ├── useGSAP.ts               # GSAP context management hook
    ├── useLenis.ts              # Smooth scrolling integration
    ├── useThread.ts             # SVG thread drawing logic
    └── useReducedMotion.ts      # Accessibility motion preference
```

## Getting Started

### Prerequisites

Ensure you have Node.js (v18+) and npm installed.

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the local development server:

```bash
npm run dev
```

### Building for Production

To create a production-ready build:

```bash
npm run build
```

You can preview the production build locally using:

```bash
npm run preview
```

## Performance Guidelines

When contributing to this project, adhere strictly to these performance rules:
- Use `will-change: transform, opacity` *only* during animations.
- Animate *only* `transform` and `opacity` properties.
- Avoid using SVG filters like `<feGaussianBlur>` on animating elements (use `.webp` image alternatives instead).
- Use `gsap.quickTo()` for velocity-based parallax effects (bypasses React state updates).

## License

Private Repository. All Rights Reserved.
# The-Guiding-Thread
