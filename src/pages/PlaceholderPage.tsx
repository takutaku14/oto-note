/**
 * プレースホルダーページ
 * Phase 1 以降で実装する各画面の仮コンテンツ。
 * ルーティングの動作確認と、レイアウト構造のテストに使用。
 */

type PlaceholderPageProps = {
  title: string
  subtitle?: string
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      {/* アイコン */}
      <div className="h-20 w-20 rounded-3xl bg-fill flex items-center justify-center mb-6">
        <span className="text-4xl">🎵</span>
      </div>

      {/* タイトル */}
      <h1 className="text-title-1 text-label mb-2 text-center">{title}</h1>

      {/* サブタイトル */}
      {subtitle && (
        <p className="text-body text-label-secondary text-center max-w-xs">{subtitle}</p>
      )}

      {/* ステータスメッセージ */}
      <div className="mt-6 px-4 py-2 rounded-full bg-fill">
        <p className="text-footnote text-label-tertiary">Phase 1 以降で実装予定</p>
      </div>
    </div>
  )
}
