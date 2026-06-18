/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Digital-twin command-center palette
        ink: {
          900: '#05070d',
          800: '#0a0f1a',
          700: '#0f1626',
          600: '#16203a',
          500: '#1e2c4d',
        },
        shrimp: '#ff6b3d', // 小龙虾 brand orange
        free: '#22d39a', // 空闲
        busy: '#ff4d6d', // 已占用
        mine: '#38bdf8', // 我的 / 选中
        soon: '#f5b942', // 即将占用
      },
      boxShadow: {
        glow: '0 0 24px rgba(56,189,248,0.35)',
        'glow-orange': '0 0 28px rgba(255,107,61,0.45)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
