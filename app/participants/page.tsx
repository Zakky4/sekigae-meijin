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
          variant="outline"
          size="sm"
          onClick={() => onRemove(participant.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
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
              <SelectItem value="under20">10代以下</SelectItem>
              <SelectItem value="20s">20代</SelectItem>
              <SelectItem value="30s">30代</SelectItem>
              <SelectItem value="40s">40代</SelectItem>
              <SelectItem value="50s">50代</SelectItem>
              <SelectItem value="over60">60代以上</SelectItem>
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
  const [csvFileName, setCsvFileName] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 初期化時にストアから参加者情報を取得（一度だけ）
  useEffect(() => {
    if (!initializedRef.current) {
      // 既存の参加者データの年齢区分を新しい形式に変換
      const migratedParticipants = participants.map(p => ({
        ...p,
        ageGroup: migrateAgeGroup(p.ageGroup)
      }))
      setLocalParticipants(migratedParticipants)
      setParticipants(migratedParticipants)
      initializedRef.current = true
    }
  }, [participants])

  // 年齢区分の移行ヘルパー関数
  function migrateAgeGroup(oldAgeGroup: string): 'under20' | '20s' | '30s' | '40s' | '50s' | 'over60' {
    switch (oldAgeGroup) {
      case 'child':
      case 'teen':
        return 'under20'
      case 'adult':
        return '20s'
      case 'senior':
        return 'over60'
      default:
        return '20s' // デフォルト値
    }
  }

  // 参加者を追加
  const addParticipant = () => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: '',
      gender: 'other',
      ageGroup: '20s'
    }
    const updatedParticipants = [...localParticipants, newParticipant]
    setLocalParticipants(updatedParticipants)
    setParticipants(updatedParticipants)
  }

  // サンプルCSVダウンロード
  const handleSampleDownload = () => {
    const sample = '名前\n山田太郎\n佐藤花子'
    const blob = new Blob([sample], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // CSVファイルからのインポート
  const handleCsvImport = (event: ChangeEvent<HTMLInputElement>) => {
    setCsvError(null)
    const file = event.target.files?.[0]
    if (!file) return
    setCsvFileName(file.name)

    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        if (!content) throw new Error('CSVファイルの読み込みに失敗しました')
        
        // CSVを解析
        const lines = content.split('\n')
        
        // 1行目未満の場合はエラー
        if (lines.length < 2) {
          setCsvError('CSVファイルは少なくとも2行（ヘッダー行とデータ行）必要です')
          return
        }
        
        // ヘッダー行を解析して列インデックスを特定
        const headerLine = lines[0].trim()
        const headers = headerLine.split(',').map(h => h.trim())
        
        // 名前の列インデックスを検索
        const nameIndex = headers.findIndex(h => h === '名前')
        // 性別の列インデックスを検索（任意）
        const genderIndex = headers.findIndex(h => h === '性別')
        
        // 名前列が見つからない場合はエラー
        if (nameIndex === -1) {
          setCsvError('CSVファイルには「名前」の列が必要です')
          return
        }
        
        // 新しい参加者リスト
        const newParticipants: Participant[] = []
        
        // 2行目以降を処理
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue // 空行はスキップ
          
          const values = line.split(',')
          
          // 名前がなければスキップ
          if (values.length <= nameIndex) continue
          const name = values[nameIndex].trim()
          if (!name) continue

          // 性別の判定（列があれば値を反映、なければother）
          let gender: 'male' | 'female' | 'other' = 'other'
          if (genderIndex !== -1 && values.length > genderIndex) {
            const genderValue = values[genderIndex].trim().toLowerCase()
            if (genderValue === '男性' || genderValue === 'male' || genderValue === '男') {
              gender = 'male'
            } else if (genderValue === '女性' || genderValue === 'female' || genderValue === '女') {
              gender = 'female'
            }
          }
          
          newParticipants.push({
            id: Date.now().toString() + i,
            name,
            gender,
            ageGroup: '20s'
          })
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <span className="font-bold text-xl">&#9888;</span>
            <span className="font-bold">{csvError}</span>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="csv-import" className="mb-2 block">CSVインポート</Label>
            <div className="flex items-center gap-2">
              <input
                id="csv-import"
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleCsvImport}
                className="hidden"
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                CSVファイルを選択
              </Button>
              {csvFileName && (
                <span className="text-sm text-gray-600">{csvFileName}</span>
              )}
              <Button type="button" variant="secondary" onClick={handleSampleDownload}>
                サンプルCSVダウンロード
              </Button>
            </div>
            <div className="border bg-muted px-3 py-2 rounded-md text-sm mt-2">
              <p className="font-semibold mb-1">CSV仕様</p>
              <p>1行目はヘッダー行として処理されます</p>
              <p>「名前」の列が必要です</p>
              <p>例: 名前</p>
              <p>　　山田太郎</p>
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
          <Button onClick={addParticipant} className="orange-button">
            参加者を追加
          </Button>
          <Link href="/settings">
            <Button disabled={localParticipants.length === 0} className="orange-button">
              次へ
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
} 