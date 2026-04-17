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

// Phase 2 Pages
import { OrgDashboardPage } from './features/organizations/OrgDashboardPage'
import { EventCreatePage } from './features/events/EventCreatePage'
import { NotificationsPage } from './features/notifications/NotificationsPage'

// Phase 3 Pages
import { EventDetailPage } from './features/events/EventDetailPage'
import { EventEditPage } from './features/events/EventEditPage'
import { EventResponsesPage } from './features/events/EventResponsesPage'

// Phase 4/Current Pages
import { MyPage } from './features/mypage/MyPage'

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

          {/* 通知センター */}
          <Route path="notifications" element={<NotificationsPage />} />

          {/* マイページ（プロフィール、ログアウト等） */}
          <Route path="mypage" element={<MyPage />} />

          {/* ============================
           * 団体スコープルート（OrgGuard）
           * URL パラメータ :orgId から団体情報を解決
           * ============================ */}
          <Route path="org/:orgId" element={<OrgGuard />}>
            {/* 団体別ダッシュボード */}
            <Route index element={<OrgDashboardPage />} />

            {/* メンバー名簿（一般向け：退団者非表示） */}
            <Route path="members" element={<MemberListPage />} />

            {/* イベント詳細（Phase 3 で実装） */}
            <Route path="events/:eventId" element={<EventDetailPage />} />

            {/* 掲示板（Phase 5 で実装） */}
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

              {/* イベント作成 */}
              <Route path="events/new" element={<EventCreatePage />} />

              {/* イベント編集 */}
              <Route path="events/:eventId/edit" element={<EventEditPage />} />

              {/* 回答一覧・管理ビュー（Phase 3 で実装） */}
              <Route path="events/:eventId/responses" element={<EventResponsesPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
