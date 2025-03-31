'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'

interface Participant {
  id: string
  name: string
  gender: 'male' | 'female' | 'other'
  ageGroup: 'child' | 'teen' | 'adult' | 'senior'
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])

  const addParticipant = () => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: '',
      gender: 'other',
      ageGroup: 'adult'
    }
    setParticipants([...participants, newParticipant])
  }

  const updateParticipant = (id: string, field: keyof Participant, value: string) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id))
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">参加者情報の入力</h1>
        
        <div className="space-y-6 mb-8">
          {participants.map((participant) => (
            <div key={participant.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">参加者 {participants.indexOf(participant) + 1}</h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeParticipant(participant.id)}
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
                    onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor={`gender-${participant.id}`}>性別</Label>
                  <Select
                    value={participant.gender}
                    onValueChange={(value) => updateParticipant(participant.id, 'gender', value)}
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

                <div>
                  <Label htmlFor={`age-${participant.id}`}>年齢層</Label>
                  <Select
                    value={participant.ageGroup}
                    onValueChange={(value) => updateParticipant(participant.id, 'ageGroup', value)}
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
          ))}
        </div>

        <div className="flex justify-between">
          <Button onClick={addParticipant}>
            参加者を追加
          </Button>
          <Link href="/settings">
            <Button disabled={participants.length === 0}>
              次へ
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
} 