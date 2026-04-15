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

// データリセット用の一時ページ
import { useMockData } from './hooks/useMockData'
import { useNavigate } from 'react-router-dom'
const DevMyPage = () => {
  const { resetAllData } = useMockData()
  const navigate = useNavigate()
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-title-2 font-bold mb-4">マイページ（開発中）</h1>
      <button
        onClick={() => {
          resetAllData()
          navigate('/')
        }}
        className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold w-full"
      >
        モックデータをリセット (localStorage消去)
      </button>
      <p className="text-caption-1 text-label-secondary">
        ※作成したイベント等が消去され、初期のモックデータに戻ります。
      </p>
    </div>
  )
}

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

          {/* マイページ（開発用リセットUI等） */}
          <Route path="mypage" element={<DevMyPage />} />

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
            <Route path="events/:eventId" element={<PlaceholderPage title="イベント詳細" />} />

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
