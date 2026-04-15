import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { PlaceholderPage } from './pages/PlaceholderPage'

// Guards
import { AuthGuard } from './components/guards/AuthGuard'
import { OrgGuard } from './components/guards/OrgGuard'
import { AdminGuard } from './components/guards/AdminGuard'

// Feature Pages
import { LoginPage } from './features/auth/LoginPage'
import { HomePage } from './features/timeline/HomePage'
import { OrganizationsPage } from './features/organizations/OrganizationsPage'
import { JoinPage } from './features/organizations/JoinPage'
import { OrgSettingsPage } from './features/organizations/OrgSettingsPage'
import { MemberListPage } from './features/members/MemberListPage'
import { MemberManagePage } from './features/members/MemberManagePage'

/**
 * アプリケーションのルート定義
 * AuthGuard → OrgGuard → AdminGuard のネスト構造で
 * 認証 → 団体メンバーシップ → 幹部権限 のアクセス制御を実現
 */
function App() {
  return (
    <Routes>
      {/* ============================
       * 認証不要ルート（フルスクリーン）
       * ============================ */}
      <Route path="login" element={<LoginPage />} />
      <Route path="join/:inviteToken" element={<JoinPage />} />

      {/* ============================
       * 認証必須ルート（AuthGuard）
       * ============================ */}
      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
          {/* ホーム：簡易版マイタイムライン（全団体横断） */}
          <Route index element={<HomePage />} />

          {/* 団体選択・作成画面 */}
          <Route path="organizations" element={<OrganizationsPage />} />

          {/* 通知センター（Phase 4 で実装） */}
          <Route path="notifications" element={<PlaceholderPage title="通知" subtitle="お知らせ・リマインド" />} />

          {/* マイページ（Phase 5 で実装） */}
          <Route path="mypage" element={<PlaceholderPage title="マイページ" subtitle="プロフィール・設定" />} />

          {/* ============================
           * 団体スコープルート（OrgGuard）
           * URL パラメータ :orgId から団体情報を解決
           * ============================ */}
          <Route path="org/:orgId" element={<OrgGuard />}>
            {/* 団体別ダッシュボード（Phase 2 で実装） */}
            <Route index element={<PlaceholderPage title="ダッシュボード" subtitle="団体別のイベント・お知らせ" />} />

            {/* メンバー名簿（一般向け：退団者非表示） */}
            <Route path="members" element={<MemberListPage />} />

            {/* イベント詳細（Phase 2 で実装） */}
            <Route path="events/:eventId" element={<PlaceholderPage title="イベント詳細" />} />

            {/* 掲示板（Phase 3 で実装） */}
            <Route path="boards" element={<PlaceholderPage title="掲示板" subtitle="カテゴリ別スレッド一覧" />} />
            <Route path="boards/:boardId" element={<PlaceholderPage title="スレッド詳細" />} />

            {/* ============================
             * 幹部専用ルート（AdminGuard）
             * ============================ */}
            <Route path="admin" element={<AdminGuard />}>
              {/* 団体・シーズン設定 */}
              <Route path="settings" element={<OrgSettingsPage />} />

              {/* メンバー管理（幹部専用：退団者も表示） */}
              <Route path="members" element={<MemberManagePage />} />

              {/* イベント作成・編集（Phase 2 で実装） */}
              <Route path="events/new" element={<PlaceholderPage title="イベント作成" />} />

              {/* 回答一覧・管理ビュー（Phase 3 で実装） */}
              <Route path="events/:eventId/responses" element={<PlaceholderPage title="回答一覧" subtitle="管理者ビュー" />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
