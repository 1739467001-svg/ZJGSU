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
        // 工商蓝 navy base — bluer & lighter than the old near-black
        ink: {
          900: '#071a33',
          800: '#0b2444',
          700: '#103057',
          600: '#17406e',
          500: '#1f5290',
        },
        // 浙江工商大学 校色 · 工商蓝
        zsblue: {
          DEFAULT: '#1f6fe0',
          light: '#4f97f5',
          deep: '#0a3f8f',
        },
        gold: '#f5c84b', // 校徽点缀
        shrimp: '#ff6b3d', // 小龙虾 brand orange (mascot accent)
        free: '#22d39a', // 空闲
        busy: '#ff5d7a', // 已占用
        mine: '#22d3ee', // 我的 / 选中
        soon: '#f5b942', // 即将占用
      },
      boxShadow: {
        glow: '0 0 24px rgba(31,111,224,0.40)',
        'glow-blue': '0 0 26px rgba(31,111,224,0.55)',
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
