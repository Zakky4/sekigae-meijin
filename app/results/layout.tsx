import { Metadata } from "next"

export const metadata: Metadata = {
  title: "席替え結果",
  description: "生成されたグループ分け結果を確認できます。結果をコピーして共有も可能です。",
}

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 