import { Metadata } from "next"

export const metadata: Metadata = {
  title: "参加者情報の入力",
  description: "席替えに参加する人の情報を入力してください。CSVファイルからの一括インポートも可能です。",
}

export default function ParticipantsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 