/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '15px',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '960px',
      xl: '1200px',
    },
    fontFamily: {
      // display: headlines. body: running text. mono: labels, code, UI chrome.
      display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      primary: ['var(--font-body)', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        ink: '#0b121a', // page background
        primary: '#15202b', // brand navy: panels
        panel: '#101a24',
        accent: {
          DEFAULT: '#29d4ff', // phosphor cyan
          hover: '#1d9bf0',
        },
        amber: '#ffb547', // vinyl / walnut warmth
        success: '#3ddc97', // "passed"
        error: '#ff6b7a', // "failed"
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        spin360: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        blink: 'blink 1.1s steps(1) infinite',
        'spin-slow': 'spin360 40s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
