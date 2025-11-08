module.exports = {
  content: [
    "./app/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1e40af',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#1e3a8a',
          950: '#172554'
        },
        warning: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712'
        }
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.rtl\\:text-right': {
          'text-align': 'right',
        },
        '.rtl\\:text-left': {
          'text-align': 'left',
        },
        '.rtl\\:ml-2': {
          'margin-left': '0.5rem',
        },
        '.rtl\\:mr-0': {
          'margin-right': '0',
        },
        '.rtl\\:ml-3': {
          'margin-left': '0.75rem',
        },
        '.rtl\\:ml-4': {
          'margin-left': '1rem',
        },
        '.rtl\\:mr-4': {
          'margin-right': '1rem',
        },
        '.rtl\\:-mr-2': {
          'margin-right': '-0.5rem',
        },
        '.rtl\\:flex-row-reverse': {
          'flex-direction': 'row-reverse',
        },
        '.rtl\\:space-x-reverse': {
          '--tw-space-x-reverse': '1',
        },
        '.rtl\\:rotate-180': {
          'transform': 'rotate(180deg)',
        },
        '.rtl\\:pr-0': {
          'padding-right': '0',
        },
        '.rtl\\:pl-10': {
          'padding-left': '2.5rem',
        },
        '.rtl\\:right-auto': {
          'right': 'auto',
        },
        '.rtl\\:left-3': {
          'left': '0.75rem',
        },
      })
    }
  ],
}
