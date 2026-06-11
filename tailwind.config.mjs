/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Bright, playful primary-school palette (taken from the PTAF poster).
        // `DEFAULT` shades are bright and used for decorative fills (bunting,
        // borders, dots, pills with dark text). `dark` shades are tuned to meet
        // WCAG AA contrast for coloured text on light backgrounds, and for
        // surfaces that carry white text (header, call-to-action).
        brand: {
          teal: { DEFAULT: '#1FA6BC', dark: '#0C7585' },
          green: { DEFAULT: '#5DAE3A', dark: '#357A28' },
          coral: { DEFAULT: '#F0594C', dark: '#CE3A2C' },
          yellow: '#FBB724',
          purple: { DEFAULT: '#9B6FC4', dark: '#7A4FB0' },
          pink: '#F37FA6'
        }
      },
      fontFamily: {
        // Rounded, friendly display + body fonts
        display: ['Fredoka', 'ui-rounded', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
