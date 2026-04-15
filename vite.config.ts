import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Service Worker の自動更新
      registerType: 'autoUpdate',
      // 静的アセットのプリキャッシュ対象
      includeAssets: ['favicon.svg'],
      // PWA マニフェスト設定
      manifest: {
        name: 'oto-note',
        short_name: 'oto-note',
        description: 'アマチュア音楽団体の出欠管理・スケジュール・連絡をひとつに。',
        theme_color: '#F2F2F7',
        background_color: '#F2F2F7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      // Workbox ランタイムキャッシング設定
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      // 開発時の設定（PWA機能のテスト用）
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
