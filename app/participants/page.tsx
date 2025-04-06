'use client'

import { useState, useEffect, useRef } from 'react'
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
            <SelectContent>
              <SelectItem value="male">男性</SelectItem>
              <SelectItem value="female">女性</SelectItem>
              <SelectItem value="other">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="age-select mt-2">
          <Label htmlFor={`age-${participant.id}`}>年齢層</Label>
          <Select
            value={participant.ageGroup}
            onValueChange={(value) => onUpdate(participant.id, 'ageGroup', value)}
          >
            <SelectTrigger id={`age-${participant.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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