'use client'

import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import Link from 'next/link'
import { useStore, Participant } from "../store"

// 個別の参加者コンポーネントを作成
function ParticipantCard({ 
  participant, 
  index, 
  onUpdate, 
  onRemove 
}: { 
  participant: Participant
  index: number
  onUpdate: (id: string, field: keyof Participant, value: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">参加者 {index + 1}</h3>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(participant.id)}
        >
          削除
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor={`name-${participant.id}`}>名前</Label>
          <Input
            id={`name-${participant.id}`}
            value={participant.name}
            onChange={(e) => onUpdate(participant.id, 'name', e.target.value)}
          />
        </div>

        <div className="gender-select">
          <Label htmlFor={`gender-${participant.id}`}>性別</Label>
          <Select
            value={participant.gender}
            onValueChange={(value) => onUpdate(participant.id, 'gender', value)}
          >
            <SelectTrigger id={`gender-${participant.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent id={`gender-dropdown-${participant.id}`}>
              <SelectItem value="male">男性</SelectItem>
              <SelectItem value="female">女性</SelectItem>
              <SelectItem value="other">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="age-select">
          <Label htmlFor={`age-${participant.id}`}>年齢層</Label>
          <Select
            value={participant.ageGroup}
            onValueChange={(value) => onUpdate(participant.id, 'ageGroup', value)}
          >
            <SelectTrigger id={`age-${participant.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent id={`age-dropdown-${participant.id}`}>
              <SelectItem value="child">子ども</SelectItem>
              <SelectItem value="teen">10代</SelectItem>
              <SelectItem value="adult">20-60代</SelectItem>
              <SelectItem value="senior">70代以上</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default function ParticipantsPage() {
  // Zustandストアから参加者情報を取得
  const { participants, setParticipants } = useStore()
  const [localParticipants, setLocalParticipants] = useState<Participant[]>([])
  const initializedRef = useRef(false)
  const [csvError, setCsvError] = useState<string | null>(null)

  // 初期化時にストアから参加者情報を取得（一度だけ）
  useEffect(() => {
    if (!initializedRef.current) {
      setLocalParticipants(participants)
      initializedRef.current = true
    }
  }, [participants])

  // 参加者を追加
  const addParticipant = () => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: '',
      gender: 'other',
      ageGroup: 'adult'
    }
    const updatedParticipants = [...localParticipants, newParticipant]
    setLocalParticipants(updatedParticipants)
    setParticipants(updatedParticipants)
  }

  // CSVファイルからのインポート
  const handleCsvImport = (event: ChangeEvent<HTMLInputElement>) => {
    setCsvError(null)
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        if (!content) throw new Error('CSVファイルの読み込みに失敗しました')
        
        // CSVを解析
        const lines = content.split('\n')
        
        // 新しい参加者リスト
        const newParticipants: Participant[] = []
        
        // 各行を処理（ヘッダー行をスキップするため1から開始も可能）
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue // 空行はスキップ
          
          const values = line.split(',')
          
          // 最低でも名前と性別が必要
          if (values.length < 2) continue
          
          const name = values[0].trim()
          let gender: 'male' | 'female' | 'other' = 'other'
          
          // 性別の判定
          const genderValue = values[1].trim().toLowerCase()
          if (genderValue === '男性' || genderValue === 'male' || genderValue === '男') {
            gender = 'male'
          } else if (genderValue === '女性' || genderValue === 'female' || genderValue === '女') {
            gender = 'female'
          }
          
          // 有効な名前があれば参加者を追加
          if (name) {
            newParticipants.push({
              id: Date.now().toString() + i, // ユニークIDを生成
              name,
              gender,
              ageGroup: 'adult' // デフォルト値として設定
            })
          }
        }
        
        // 有効な参加者が1人以上いればインポート
        if (newParticipants.length > 0) {
          const updatedParticipants = [...localParticipants, ...newParticipants]
          setLocalParticipants(updatedParticipants)
          setParticipants(updatedParticipants)
        } else {
          setCsvError('有効な参加者データが見つかりませんでした')
        }
        
      } catch (error) {
        console.error('CSVパースエラー:', error)
        setCsvError('CSVファイルの解析中にエラーが発生しました')
      }
      
      // ファイル選択をリセット
      event.target.value = ''
    }
    
    reader.onerror = () => {
      setCsvError('ファイルの読み込みに失敗しました')
      event.target.value = ''
    }
    
    reader.readAsText(file)
  }

  // 参加者情報を更新
  const updateParticipant = (id: string, field: keyof Participant, value: string) => {
    const updatedParticipants = localParticipants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    )
    setLocalParticipants(updatedParticipants)
    setParticipants(updatedParticipants)
  }

  // 参加者を削除
  const removeParticipant = (id: string) => {
    const updatedParticipants = localParticipants.filter(p => p.id !== id)
    setLocalParticipants(updatedParticipants)
    setParticipants(updatedParticipants)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">参加者情報の入力</h1>
        
        {csvError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {csvError}
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="csv-import" className="mb-2 block">CSVインポート</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="csv-import"
                  type="file"
                  accept=".csv"
                  onChange={handleCsvImport}
                  className="flex-1"
                />
                <div className="bg-muted px-3 py-2 rounded-md text-sm">
                  <p>形式: 名前,性別</p>
                  <p>例: 山田太郎,男性</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 mb-8">
          {localParticipants.map((participant, index) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              index={index}
              onUpdate={updateParticipant}
              onRemove={removeParticipant}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <Button onClick={addParticipant}>
            参加者を追加
          </Button>
          <Link href="/settings">
            <Button disabled={localParticipants.length === 0}>
              次へ
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
} 