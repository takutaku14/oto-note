import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { PlaceholderPage } from './pages/PlaceholderPage'

/**
 * アプリケーションのルート定義
 * 基本設計書 §3 の画面一覧に基づくルーティング構成
 */
function App() {
  return (
    <Routes>
      {/* ============================
       * メインレイアウト付きルート
       * タブバー / サイドバーを伴う通常画面
       * ============================ */}
      <Route element={<AppLayout />}>
        {/* ホーム：マイタイムライン (全団体横断) */}
        <Route index element={<PlaceholderPage title="ホーム" subtitle="マイタイムラインで全団体の予定を一覧" />} />

        {/* 団体選択画面 */}
        <Route path="organizations" element={<PlaceholderPage title="団体一覧" subtitle="所属団体の選択・新規作成" />} />

        {/* 団体別ダッシュボード */}
        <Route path="org/:orgId" element={<PlaceholderPage title="ダッシュボード" subtitle="団体別のイベント・お知らせ" />} />

        {/* イベント詳細 */}
        <Route path="org/:orgId/events/:eventId" element={<PlaceholderPage title="イベント詳細" />} />

        {/* 掲示板 */}
        <Route path="org/:orgId/boards" element={<PlaceholderPage title="掲示板" subtitle="カテゴリ別スレッド一覧" />} />
        <Route path="org/:orgId/boards/:boardId" element={<PlaceholderPage title="スレッド詳細" />} />

        {/* メンバー名簿 (一般向け) */}
        <Route path="org/:orgId/members" element={<PlaceholderPage title="メンバー名簿" />} />

        {/* 幹部専用: 団体設定 */}
        <Route path="org/:orgId/admin/settings" element={<PlaceholderPage title="団体設定" subtitle="幹部専用" />} />

        {/* 幹部専用: メンバー管理 */}
        <Route path="org/:orgId/admin/members" element={<PlaceholderPage title="メンバー管理" subtitle="幹部専用" />} />

        {/* イベント作成・編集 */}
        <Route path="org/:orgId/admin/events/new" element={<PlaceholderPage title="イベント作成" />} />

        {/* 回答一覧 (幹部・責任者向け管理ビュー) */}
        <Route path="org/:orgId/admin/events/:eventId/responses" element={<PlaceholderPage title="回答一覧" subtitle="管理者ビュー" />} />

        {/* 通知センター */}
        <Route path="notifications" element={<PlaceholderPage title="通知" subtitle="お知らせ・リマインド" />} />

        {/* マイページ */}
        <Route path="mypage" element={<PlaceholderPage title="マイページ" subtitle="プロフィール・設定" />} />
      </Route>

      {/* ============================
       * レイアウトなしフルスクリーンルート
       * ナビゲーションバーなしの独立画面
       * ============================ */}
      <Route path="login" element={<PlaceholderPage title="ログイン" subtitle="Googleアカウントでログイン" />} />
      <Route path="join/:inviteToken" element={<PlaceholderPage title="団体に参加" subtitle="招待リンクからの参加" />} />
    </Routes>
  )
}

export default App
