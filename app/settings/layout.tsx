import { Metadata } from "next"

export const metadata: Metadata = {
  title: "席替え設定",
  description: "グループ数や条件を設定して、最適な席替え結果を生成します。",
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 