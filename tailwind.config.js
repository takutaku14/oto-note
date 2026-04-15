/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // ダークモードはOSの設定に連動（CSS変数で色を切り替え）
  darkMode: 'media',
  theme: {
    extend: {
      // Apple SF Pro システムフォントスタック
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      // HIG準拠 Dynamic Type トラッキング (DESIGN_RULE §3.1)
      fontSize: {
        'large-title': ['34px', { lineHeight: '41px', letterSpacing: '0.011em', fontWeight: '700' }],
        'title-1':     ['28px', { lineHeight: '34px', letterSpacing: '0.013em', fontWeight: '700' }],
        'title-2':     ['22px', { lineHeight: '28px', letterSpacing: '0.016em', fontWeight: '700' }],
        'title-3':     ['20px', { lineHeight: '25px', letterSpacing: '0.019em', fontWeight: '600' }],
        'headline':    ['17px', { lineHeight: '22px', letterSpacing: '-0.025em', fontWeight: '600' }],
        'body':        ['17px', { lineHeight: '22px', letterSpacing: '-0.025em', fontWeight: '400' }],
        'callout':     ['16px', { lineHeight: '21px', letterSpacing: '-0.020em', fontWeight: '400' }],
        'subhead':     ['15px', { lineHeight: '20px', letterSpacing: '-0.016em', fontWeight: '400' }],
        'footnote':    ['13px', { lineHeight: '18px', letterSpacing: '-0.006em', fontWeight: '400' }],
        'caption-1':   ['12px', { lineHeight: '16px', letterSpacing: '0em', fontWeight: '400' }],
        'caption-2':   ['11px', { lineHeight: '13px', letterSpacing: '0.006em', fontWeight: '400' }],
      },
      // iOS セマンティックカラー (DESIGN_RULE §3.2)
      // background / tint: RGB チャンネル形式 → opacity修飾子(/70等)対応
      // label / separator / fill: 完全な色値（opacity内蔵のため修飾子不要）
      colors: {
        background: {
          DEFAULT:            'rgb(var(--color-system-background) / <alpha-value>)',
          secondary:          'rgb(var(--color-secondary-system-background) / <alpha-value>)',
          tertiary:           'rgb(var(--color-tertiary-system-background) / <alpha-value>)',
          grouped:            'rgb(var(--color-system-grouped-background) / <alpha-value>)',
          'grouped-secondary': 'rgb(var(--color-secondary-system-grouped-background) / <alpha-value>)',
          'grouped-tertiary':  'rgb(var(--color-tertiary-system-grouped-background) / <alpha-value>)',
        },
        label: {
          DEFAULT:    'var(--color-label)',
          secondary:  'var(--color-secondary-label)',
          tertiary:   'var(--color-tertiary-label)',
          quaternary: 'var(--color-quaternary-label)',
        },
        separator: {
          DEFAULT: 'var(--color-separator)',
          opaque:  'var(--color-opaque-separator)',
        },
        fill: 'var(--color-system-fill)',
        tint: 'rgb(var(--color-tint) / <alpha-value>)',
      },
      // iOS物理ベースのアニメーションカーブ (DESIGN_RULE §5.2)
      transitionTimingFunction: {
        'apple-ease':   'cubic-bezier(0.32, 0.72, 0, 1)',
        'apple-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
};
