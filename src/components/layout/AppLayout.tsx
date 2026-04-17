import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Building2, Bell, User, Music } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageTransition } from './PageTransition'

/**
 * ナビゲーション項目の定義
 */
type NavItem = {
  path: string
  label: string
  Icon: LucideIcon
}

const navItems: NavItem[] = [
  { path: '/', label: 'ホーム', Icon: Home },
  { path: '/organizations', label: '団体', Icon: Building2 },
  { path: '/notifications', label: '通知', Icon: Bell },
  { path: '/mypage', label: 'マイページ', Icon: User },
]

/**
 * レスポンシブレイアウト (DESIGN_RULE §4.1)
 *
 * - モバイル (< md): ボトムタブナビゲーション + フルスクリーンスタック
 * - デスクトップ (≥ md): 左サイドバーナビゲーション
 *
 * id="app-root" は HalfModalSheet のスケールダウン効果の対象要素
 */
export const AppLayout: React.FC = () => {
  const location = useLocation()

  /** 現在のパスがナビ項目にマッチするか判定 */
  const isActive = (path: string) => {
    const currentPath = location.pathname

    // ホームは厳密一致
    if (path === '/') return currentPath === '/'

    // 団体カテゴリ: 一覧(/organizations) または 詳細スコープ(/org/) の場合にアクティブとする
    if (path === '/organizations') {
      return currentPath.startsWith('/organizations') || currentPath.startsWith('/org/')
    }

    // その他は前方一致 (サブページを含む)
    return currentPath.startsWith(path)
  }

  // fixed inset-0: ビューポートに直接貼り付け、親の高さチェーンに依存しない堅牢なレイアウト
  return (
    <div id="app-root" className="flex fixed inset-0 w-full overflow-hidden bg-background">

      {/* ========================================
       * デスクトップ / iPad サイドバー (md以上で表示)
       * macOS のサイドバー風。背景を secondary にしてメインと分離
       * ======================================== */}
      <aside className="hidden md:flex w-64 flex-col border-r border-separator bg-background-secondary pt-12 pb-6 flex-shrink-0">
        {/* アプリロゴ */}
        <div className="px-6 pb-8 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-tint flex items-center justify-center">
            <Music className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-title-3 text-label">oto-note</h1>
        </div>

        {/* ナビゲーション */}
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150
                ${isActive(item.path)
                  ? 'bg-tint text-white'
                  : 'text-label hover:bg-fill active:bg-fill'
                }`}
            >
              <item.Icon className={`h-5 w-5 ${isActive(item.path) ? 'text-white' : 'text-tint'}`} />
              <span className="text-body">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* ========================================
       * メインコンテンツエリア
       * PageTransition でラップしてアニメーションを適用
       * モバイルではタブバーに重ならないよう下部にマージンを確保
       * ======================================== */}
      <main className="flex-1 relative overflow-hidden mb-[calc(60px+env(safe-area-inset-bottom))] md:mb-0">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      {/* ========================================
       * モバイル ボトムタブバー (md未満で表示)
       * Liquid Glass (Thin Material) のすりガラス効果を適用
       * セーフエリア (ホームインジケーター) を考慮した高さ
       * ======================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[calc(60px+env(safe-area-inset-bottom))] w-full border-t border-separator bg-background/70 backdrop-blur-xl backdrop-saturate-150 pb-[env(safe-area-inset-bottom)] md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-1 flex-col items-center justify-center gap-1 active:opacity-50 transition-opacity duration-150"
          >
            <item.Icon
              className={`h-6 w-6 ${isActive(item.path) ? 'text-tint' : 'text-label-secondary'}`}
            />
            <span
              className={`text-[10px] font-medium ${isActive(item.path) ? 'text-tint' : 'text-label-secondary'}`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
