'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "../components/ui/button"
import Link from 'next/link'
import { useStore } from "../store"
import { generateGroups } from "../utils/seating"

export default function ResultsPage() {
  const { participants, settings, groups, setGroups } = useStore()
  const [copied, setCopied] = useState(false)
  const hasExecutedRef = useRef(false)
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)

  useEffect(() => {
    // 既に実行済みの場合は再実行しない
    if (hasExecutedRef.current) return;
    
    // 参加者情報と設定に基づいて席替えを実行
    if (participants.length > 0) {
      const newGroups = generateGroups(participants, settings)
      setGroups(newGroups)
      hasExecutedRef.current = true;
    }
  }, [participants, settings, setGroups]);

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

  // グループを選択する関数
  const toggleGroupSelection = (groupId: number) => {
    if (selectedGroup === groupId) {
      setSelectedGroup(null)
    } else {
      setSelectedGroup(groupId)
    }
  }

  // 参加者がいない場合
  if (participants.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">参加者情報がありません</h1>
          <p className="mb-8">席替えを行うには参加者情報を入力してください。</p>
          <Link href="/participants">
            <Button>
              参加者情報入力に戻る
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">席替え結果</h1>
        
        <div className="space-y-8 mb-8">
          {groups.map((group) => (
            <div 
              key={group.id} 
              className={`p-6 border rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md ${selectedGroup === group.id ? 'border-primary bg-primary/5' : ''}`}
              onClick={() => toggleGroupSelection(group.id)}
            >
              <h2 className="text-xl font-semibold mb-4">グループ {group.id}</h2>
              <div className="space-y-2">
                {group.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {member.name[0] || '?'}
                    </div>
                    <div>
                      <div className="font-medium">{member.name || '名前なし'}</div>
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