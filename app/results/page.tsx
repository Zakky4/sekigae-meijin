'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "../components/ui/button"
import Link from 'next/link'
import { useStore } from "../store"
import { generateGroups } from "../utils/seating"
import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'

export default function ResultsPage() {
  const { participants, settings, groups, setGroups } = useStore()
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const hasExecutedRef = useRef(false)
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

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

  // 画像としてダウンロードする機能
  const downloadAsImage = async () => {
    if (!resultsRef.current) return
    
    setDownloading(true)
    
    try {
      // 完全に新しいDOM要素を作成して、シンプルなスタイルでのみ表示する
      const captureContainer = document.createElement('div')
      captureContainer.style.position = 'absolute'
      captureContainer.style.left = '-9999px'
      captureContainer.style.width = '800px'
      captureContainer.style.padding = '20px'
      captureContainer.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#ffffff'
      captureContainer.style.color = document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
      document.body.appendChild(captureContainer)
      
      // タイトル
      const title = document.createElement('h1')
      title.textContent = '席替え結果'
      title.style.fontSize = '24px'
      title.style.fontWeight = 'bold'
      title.style.marginBottom = '16px'
      title.style.color = document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
      captureContainer.appendChild(title)

      // 各グループを生成
      groups.forEach(group => {
        const groupDiv = document.createElement('div')
        groupDiv.style.marginBottom = '24px'
        groupDiv.style.padding = '16px'
        groupDiv.style.border = `1px solid ${document.documentElement.classList.contains('dark') ? '#333' : '#e5e7eb'}`
        groupDiv.style.borderRadius = '8px'
        
        const groupTitle = document.createElement('h2')
        groupTitle.textContent = `グループ ${group.id}`
        groupTitle.style.fontSize = '18px'
        groupTitle.style.fontWeight = 'bold'
        groupTitle.style.marginBottom = '12px'
        groupTitle.style.color = document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
        groupDiv.appendChild(groupTitle)
        
        const membersList = document.createElement('div')
        membersList.style.display = 'flex'
        membersList.style.flexDirection = 'column'
        membersList.style.gap = '8px'
        
        group.members.forEach(member => {
          const memberItem = document.createElement('div')
          memberItem.style.display = 'flex'
          memberItem.style.alignItems = 'center'
          memberItem.style.gap = '12px'
          
          const avatar = document.createElement('div')
          avatar.style.width = '32px'
          avatar.style.height = '32px'
          avatar.style.borderRadius = '50%'
          avatar.style.backgroundColor = '#e5e7eb'
          avatar.style.display = 'flex'
          avatar.style.justifyContent = 'center'
          avatar.style.alignItems = 'center'
          avatar.textContent = member.name[0] || '?'
          memberItem.appendChild(avatar)
          
          const infoDiv = document.createElement('div')
          
          const nameDiv = document.createElement('div')
          nameDiv.textContent = member.name || '名前なし'
          nameDiv.style.fontWeight = '500'
          nameDiv.style.color = document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
          infoDiv.appendChild(nameDiv)
          
          const metaDiv = document.createElement('div')
          metaDiv.textContent = `${member.gender === 'male' ? '男性' : member.gender === 'female' ? '女性' : 'その他'} / ${
            member.ageGroup === 'under20' ? '10代以下' : 
            member.ageGroup === '20s' ? '20代' : 
            member.ageGroup === '30s' ? '30代' : 
            member.ageGroup === '40s' ? '40代' : 
            member.ageGroup === '50s' ? '50代' : '60代以上'
          }`
          metaDiv.style.fontSize = '14px'
          metaDiv.style.color = document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'
          infoDiv.appendChild(metaDiv)
          
          memberItem.appendChild(infoDiv)
          membersList.appendChild(memberItem)
        })
        
        groupDiv.appendChild(membersList)
        captureContainer.appendChild(groupDiv)
      })
      
      // 生成した要素を画像化
      const canvas = await html2canvas(captureContainer, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      })
      
      // 不要になった要素を削除
      document.body.removeChild(captureContainer)
      
      // 画像データをDataURLに変換
      const imageData = canvas.toDataURL('image/png')
      
      // ダウンロードリンクを作成
      const link = document.createElement('a')
      link.href = imageData
      link.download = `席替え結果_${new Date().toISOString().split('T')[0]}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('画像のダウンロード中にエラーが発生しました:', error)
      alert('画像生成中にエラーが発生しました。別の方法で保存してください。')
    } finally {
      setDownloading(false)
    }
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
        
        <div ref={resultsRef} className="space-y-8 mb-8 p-4 bg-background rounded-lg">
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
                        {member.ageGroup === 'under20' ? '10代以下' : 
                         member.ageGroup === '20s' ? '20代' : 
                         member.ageGroup === '30s' ? '30代' : 
                         member.ageGroup === '40s' ? '40代' : 
                         member.ageGroup === '50s' ? '50代' : '60代以上'}
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
            <Button onClick={downloadAsImage} disabled={downloading}>
              {downloading ? 'ダウンロード中...' : '画像としてダウンロード'}
              {!downloading && <Download className="ml-2 h-4 w-4" />}
            </Button>
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