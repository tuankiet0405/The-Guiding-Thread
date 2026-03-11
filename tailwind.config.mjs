/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      /* ─── Color Architecture: "The Illuminated Void" ─── */
      colors: {
        void: {
          deep: '#050505',
          surface: '#0A0A0C',
          glass: 'rgba(18, 18, 20, 0.6)',
          line: '#1A1A20',
        },
        thread: {
          cyan: '#00F0FF',
          violet: '#8A2BE2',
        },
        metric: {
          success: '#10B981',
        },
        signal: {
          high: '#F3F4F6',
          mid: '#A1A1AA',
          low: '#52525B',
        },
      },

      /* ─── Typography ─── */
      fontFamily: {
        architect: ['"Space Grotesk"', 'sans-serif'],
        engineer: ['"JetBrains Mono"', 'monospace'],
        narrator: ['"Inter"', 'sans-serif'],
      },

      /* ─── Motion: Physics eases ─── */
      transitionTimingFunction: {
        'physics-glide': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'physics-snap': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'hover-in': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'hover-out': 'cubic-bezier(0.4, 0.0, 1, 1)',
      },

      /* ─── Letter Spacing ─── */
      letterSpacing: {
        'architect-tight': '-0.04em',
        'architect-base': '-0.02em',
        'engineer-label': '0.05em',
      },

      /* ─── Z-Index Hierarchy ─── */
      zIndex: {
        'parallax': '-10',
        'base': '0',
        'horizontal': '10',
        'node-rest': '20',
        'node-bloom': '30',
        'thread': '40',
        'orb': '50',
        'overlay': '100',
      },

      /* ─── Animations ─── */
      animation: {
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
