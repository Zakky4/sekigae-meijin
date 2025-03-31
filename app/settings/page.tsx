'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'

interface Settings {
  groupType: 'count' | 'size'
  groupCount: number
  groupSize: number
  balanceGender: boolean
  balanceAge: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    groupType: 'count',
    groupCount: 2,
    groupSize: 4,
    balanceGender: true,
    balanceAge: true
  })

  const updateSetting = (field: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">席替え設定</h1>
        
        <div className="space-y-6">
          <div>
            <Label>グループの指定方法</Label>
            <Select
              value={settings.groupType}
              onValueChange={(value: 'count' | 'size') => updateSetting('groupType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="count">グループ数を指定</SelectItem>
                <SelectItem value="size">1グループあたりの人数を指定</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {settings.groupType === 'count' ? (
            <div>
              <Label>グループ数</Label>
              <Select
                value={settings.groupCount.toString()}
                onValueChange={(value) => updateSetting('groupCount', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}グループ
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label>1グループあたりの人数</Label>
              <Select
                value={settings.groupSize.toString()}
                onValueChange={(value) => updateSetting('groupSize', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}人
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="balanceGender"
                checked={settings.balanceGender}
                onChange={(e) => updateSetting('balanceGender', e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="balanceGender">性別のバランスを考慮する</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="balanceAge"
                checked={settings.balanceAge}
                onChange={(e) => updateSetting('balanceAge', e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="balanceAge">年齢層のバランスを考慮する</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Link href="/participants">
            <Button variant="outline">
              戻る
            </Button>
          </Link>
          <Link href="/results">
            <Button>
              席替えを実行
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
} 