export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg)', surface: 'var(--panel)', fg: 'var(--fg)', mute: 'var(--mute)',
        line: 'var(--line)', side: 'var(--side)', accent: 'var(--accent)',
        heart: '#E5484D', teal: '#1F9E8F', amber: '#E9A23B',
      },
      fontFamily: { display: ['"Bricolage Grotesque"', 'sans-serif'], body: ['"Source Sans 3"', 'sans-serif'] },
    },
  },
  plugins: [],
}
