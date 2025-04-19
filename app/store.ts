import { create } from 'zustand'

export interface Participant {
  id: string
  name: string
  gender: 'male' | 'female' | 'other'
  ageGroup: 'under20' | '20s' | '30s' | '40s' | '50s' | 'over60'
}

export interface Settings {
  groupType: 'count' | 'size'
  groupCount: number
  groupSize: number
  balanceGender: boolean
  balanceAge: boolean
}

export interface Group {
  id: number
  members: Participant[]
}

interface Store {
  participants: Participant[]
  settings: Settings
  groups: Group[]
  setParticipants: (participants: Participant[]) => void
  setSettings: (settings: Settings) => void
  setGroups: (groups: Group[]) => void
  reset: () => void
}

export const useStore = create<Store>((set) => ({
  participants: [],
  settings: {
    groupType: 'count',
    groupCount: 2,
    groupSize: 4,
    balanceGender: true,
    balanceAge: true
  },
  groups: [],
  setParticipants: (participants) => set({ participants }),
  setSettings: (settings) => set({ settings }),
  setGroups: (groups) => set({ groups }),
  reset: () => set({ participants: [], groups: [] })
})) 