import Link from 'next/link'
import { Button } from "./components/ui/button"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">席替え名人</h1>
        <p className="text-lg mb-8">
          簡単に席替えやグループ分けができるWebアプリケーションです。
          参加者の情報を入力するだけで、バランスの取れた席替えを実現します。
        </p>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">主な機能</h2>
          <ul className="text-left space-y-2 mb-8">
            <li>• 参加者名簿の入力（名前、性別、年齢層など）</li>
            <li>• グループ数または1グループあたりの人数指定</li>
            <li>• ランダム配席生成</li>
            <li>• 条件付き配席（男女バランス、年齢層バランスなど）</li>
            <li>• 結果の表示と出力</li>
          </ul>
          <Link href="/participants">
            <Button size="lg" className="text-lg">
              席替えを始める
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
