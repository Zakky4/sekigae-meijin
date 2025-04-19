import { Participant, Settings, Group } from '../store'

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function calculateGroupSize(participants: Participant[], settings: Settings): number {
  if (settings.groupType === 'count') {
    return Math.ceil(participants.length / settings.groupCount)
  }
  return settings.groupSize
}

function calculateBalanceScore(group: Participant[]): number {
  const genderCounts = {
    male: group.filter(p => p.gender === 'male').length,
    female: group.filter(p => p.gender === 'female').length,
    other: group.filter(p => p.gender === 'other').length
  }

  const ageCounts = {
    under20: group.filter(p => p.ageGroup === 'under20').length,
    '20s': group.filter(p => p.ageGroup === '20s').length,
    '30s': group.filter(p => p.ageGroup === '30s').length,
    '40s': group.filter(p => p.ageGroup === '40s').length,
    '50s': group.filter(p => p.ageGroup === '50s').length,
    over60: group.filter(p => p.ageGroup === 'over60').length
  }

  const genderScore = Math.max(
    Math.abs(genderCounts.male - genderCounts.female),
    Math.abs(genderCounts.male - genderCounts.other),
    Math.abs(genderCounts.female - genderCounts.other)
  )

  const ageScore = Math.max(
    Math.abs(ageCounts.under20 - ageCounts['20s']),
    Math.abs(ageCounts.under20 - ageCounts['30s']),
    Math.abs(ageCounts.under20 - ageCounts['40s']),
    Math.abs(ageCounts.under20 - ageCounts['50s']),
    Math.abs(ageCounts.under20 - ageCounts.over60),
    Math.abs(ageCounts['20s'] - ageCounts['30s']),
    Math.abs(ageCounts['20s'] - ageCounts['40s']),
    Math.abs(ageCounts['20s'] - ageCounts['50s']),
    Math.abs(ageCounts['20s'] - ageCounts.over60),
    Math.abs(ageCounts['30s'] - ageCounts['40s']),
    Math.abs(ageCounts['30s'] - ageCounts['50s']),
    Math.abs(ageCounts['30s'] - ageCounts.over60),
    Math.abs(ageCounts['40s'] - ageCounts['50s']),
    Math.abs(ageCounts['40s'] - ageCounts.over60),
    Math.abs(ageCounts['50s'] - ageCounts.over60)
  )

  return genderScore + ageScore
}

export function generateGroups(participants: Participant[], settings: Settings): Group[] {
  const groupSize = calculateGroupSize(participants, settings)
  const numGroups = Math.ceil(participants.length / groupSize)
  let bestGroups: Group[] = []
  let bestScore = Infinity

  // 100回試行して最良の結果を選択
  for (let i = 0; i < 100; i++) {
    const shuffledParticipants = shuffleArray(participants)
    const groups: Group[] = []

    for (let j = 0; j < numGroups; j++) {
      const start = j * groupSize
      const end = Math.min(start + groupSize, participants.length)
      const members = shuffledParticipants.slice(start, end)
      groups.push({ id: j + 1, members })
    }

    const totalScore = groups.reduce((sum, group) => sum + calculateBalanceScore(group.members), 0)

    if (totalScore < bestScore) {
      bestScore = totalScore
      bestGroups = groups
    }
  }

  return bestGroups
} 