/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0B2418',
          900: '#123524',
          800: '#164229',
          700: '#1E5631',
          600: '#2F6D45',
        },
        mist: '#EEF2EE',
        note: '#F3F6E4',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 28px rgba(22, 66, 41, 0.06)',
      },
    },
  },
  plugins: [],
};
