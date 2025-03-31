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
    child: group.filter(p => p.ageGroup === 'child').length,
    teen: group.filter(p => p.ageGroup === 'teen').length,
    adult: group.filter(p => p.ageGroup === 'adult').length,
    senior: group.filter(p => p.ageGroup === 'senior').length
  }

  const genderScore = Math.max(
    Math.abs(genderCounts.male - genderCounts.female),
    Math.abs(genderCounts.male - genderCounts.other),
    Math.abs(genderCounts.female - genderCounts.other)
  )

  const ageScore = Math.max(
    Math.abs(ageCounts.child - ageCounts.teen),
    Math.abs(ageCounts.child - ageCounts.adult),
    Math.abs(ageCounts.child - ageCounts.senior),
    Math.abs(ageCounts.teen - ageCounts.adult),
    Math.abs(ageCounts.teen - ageCounts.senior),
    Math.abs(ageCounts.adult - ageCounts.senior)
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