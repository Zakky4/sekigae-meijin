'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface Participant {
  id: string
  name: string
  gender: 'male' | 'female' | 'other'
  ageGroup: 'child' | 'teen' | 'adult' | 'senior'
}

interface Group {
  id: number
  members: Participant[]
}

export default function ResultsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // ここで実際の席替えロジックを実装
    // 仮のデータで表示
    const mockGroups: Group[] = [
      {
        id: 1,
        members: [
          { id: '1', name: '山田太郎', gender: 'male', ageGroup: 'adult' },
          { id: '2', name: '鈴木花子', gender: 'female', ageGroup: 'adult' },
          { id: '3', name: '佐藤一郎', gender: 'male', ageGroup: 'teen' },
        ]
      },
      {
        id: 2,
        members: [
          { id: '4', name: '田中次郎', gender: 'male', ageGroup: 'adult' },
          { id: '5', name: '中村美咲', gender: 'female', ageGroup: 'teen' },
          { id: '6', name: '小林三郎', gender: 'male', ageGroup: 'adult' },
        ]
      }
    ]
    setGroups(mockGroups)
  }, [])

  const copyToClipboard = () => {
    const text = groups.map(group => 
      `グループ${group.id}:\n${group.members.map(member => 
        `${member.name} (${member.gender === 'male' ? '男性' : member.gender === 'female' ? '女性' : 'その他'})`
      ).join('\n')}`
    ).join('\n\n')

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">席替え結果</h1>
        
        <div className="space-y-8 mb-8">
          {groups.map((group) => (
            <div key={group.id} className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">グループ {group.id}</h2>
              <div className="space-y-2">
                {group.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {member.name[0]}
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">
                        {member.gender === 'male' ? '男性' : member.gender === 'female' ? '女性' : 'その他'} / 
                        {member.ageGroup === 'child' ? '子ども' : 
                         member.ageGroup === 'teen' ? '10代' : 
                         member.ageGroup === 'adult' ? '20-60代' : '70代以上'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Link href="/settings">
            <Button variant="outline">
              設定に戻る
            </Button>
          </Link>
          <div className="space-x-4">
            <Button onClick={copyToClipboard}>
              {copied ? 'コピーしました！' : '結果をコピー'}
            </Button>
            <Link href="/">
              <Button variant="outline">
                最初からやり直す
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 