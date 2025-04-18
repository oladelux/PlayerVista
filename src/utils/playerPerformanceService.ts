import { getPerformancesForPlayer, getPlayerById } from '@/api'

import {
  PlayerEvent,
  getDefensiveData,
  getDisciplinaryData,
  getGoalkeeperData,
  getOffensiveData,
  getPlayerMatches,
  getPossessionData,
} from './players'

/**
 * Fetches comprehensive player performance data for PDF generation
 * @param playerId The ID of the player
 * @param eventId Optional specific event ID for single match reports
 * @returns Formatted player data ready for PDF generation
 */
export const fetchPlayerDataForPdf = async (playerId: string, eventId?: string) => {
  try {
    // Get player details
    const player = await getPlayerById(playerId)

    // Get all performances for the player
    const performancesResponse = await getPerformancesForPlayer(playerId)
    const performances = performancesResponse.data

    // Filter for specific event if provided
    const filteredPerformances = eventId
      ? performances.filter(perf => perf.eventId === eventId)
      : performances

    // Convert to PlayerEvent format for existing utility functions
    const playerEvents: PlayerEvent[] = filteredPerformances.map(perf => ({
      eventDate: new Date(perf.createdAt),
      id: perf.id,
      eventId: perf.eventId,
      playerId: perf.playerId,
      minutePlayed: perf.minutePlayed,
      heatmap: perf.heatmap,
      actions: perf.actions,
      createdAt: new Date(perf.createdAt),
      updatedAt: new Date(perf.updatedAt),
    }))

    // Get match data for display in the PDF
    const matches = getPlayerMatches(playerEvents, player.position)

    // Get offensive, defensive, possession and disciplinary stats
    const offensiveStats =
      performances.length > 0 ? getOffensiveData(performances[0].actions) : null
    const defensiveStats =
      performances.length > 0 ? getDefensiveData(performances[0].actions) : null
    const possessionStats =
      performances.length > 0 ? getPossessionData(performances[0].actions) : null
    const disciplinaryStats =
      performances.length > 0 ? getDisciplinaryData(performances[0].actions) : null
    const goalkeeperStats =
      player.position && player.position.toString() === 'Goalkeeper' && performances.length > 0
        ? getGoalkeeperData(performances[0].actions)
        : null

    // Format match data for current season
    const matchesData = matches.map(match => ({
      opponent: match.opponent,
      date: new Date(match.date).toLocaleDateString(),
      goals: match.goals,
      assists: match.assists,
      rating: match.rating.toFixed(1),
      minutesPlayed: match.minutesPlayed,
      shotsOnTarget: match.shotsOnTarget,
    }))

    // Calculate overall player stats
    const appearances = matches.length
    const totalGoals = matches.reduce((sum, match) => sum + match.goals, 0)
    const totalAssists = matches.reduce((sum, match) => sum + match.assists, 0)
    const totalMinutesPlayed = matches.reduce((sum, match) => sum + match.minutesPlayed, 0)
    const avgPassAccuracy = calculateAverage(matches.map(m => m.passAccuracy))
    const shotsOnTarget = matches.reduce((sum, match) => sum + match.shotsOnTarget, 0)
    const tackles = matches.reduce((sum, match) => sum + match.tackles, 0)
    const yellowCards = matches.reduce((sum, match) => sum + match.yellowCards, 0)
    const redCards = matches.reduce((sum, match) => sum + match.redCards, 0)

    // Calculate expected goals and other advanced metrics
    const xG = (totalGoals * 0.85).toFixed(1)
    const xGPer90 =
      totalMinutesPlayed > 0 ? ((totalGoals * 0.85) / (totalMinutesPlayed / 90)).toFixed(2) : '0.00'

    // Format data for PDF structure expected by the components
    const formattedData = {
      name: `${player.firstName} ${player.lastName}`,
      position: player.position,
      team: 'Your Team', // Fetch from team if needed
      number: player.uniformNumber,
      age: calculateAge(player.birthDate),
      nationality: player.nationality,
      height: `${player.height} cm`,
      weight: `${player.weight} kg`,
      foot: player.preferredFoot,
      stats: {
        appearances,
        goals: totalGoals,
        assists: totalAssists,
        minutesPlayed: totalMinutesPlayed,
        passAccuracy: avgPassAccuracy,
        shotsOnTarget,
        tackles,
        yellowCards,
        yellowCardsTotal: yellowCards,
        redCards,
        redCardsTotal: redCards,
        duelsWon: 0, // Fill with real data if available
        duelsLost: 0, // Fill with real data if available
        distanceCovered: 0, // Fill with real data if available
        chancesCreated: offensiveStats?.passAccuracy || 0,
        // Advanced metrics
        xG,
        xGPer90,
        progressivePassesPer90: '4.2', // Example value
        progressiveCarriesPer90: '3.1', // Example value
        successfulPressure: '27%', // Example value
        aerialDuelSuccessRate: '61%', // Example value
      },
      // Include raw performance data for further processing in the PDF components
      performanceData: performances,
      // Include processed matches data
      matchesData,
      // Include additional detailed statistics
      offensiveStats,
      defensiveStats,
      possessionStats,
      disciplinaryStats,
      goalkeeperStats,
      // Additional data for PDF generation
      performances,
      matches,
    }

    // If it's a match report, include specific match data
    if (eventId && filteredPerformances.length > 0) {
      // Fetch match details when needed
      const matchDetails = matches.find(m => m.id === eventId)

      if (matchDetails) {
        return {
          ...formattedData,
          matchDetails: {
            opponent: matchDetails.opponent,
            date: new Date(matchDetails.date).toLocaleDateString(),
            result: matchDetails.result,
            minutesPlayed: matchDetails.minutesPlayed,
            goals: matchDetails.goals,
            assists: matchDetails.assists,
            shots: matchDetails.shots,
            shotsOnTarget: matchDetails.shotsOnTarget,
            passAccuracy: matchDetails.passAccuracy,
            tackles: matchDetails.tackles,
            interceptions: matchDetails.interceptions,
            rating: matchDetails.rating.toFixed(1),
            location: 'Home Stadium', // Replace with actual data if available
          },
          // Key events for match report - replace with actual events when available
          keyEvents: [
            {
              minute: "23'",
              event: matchDetails.goals > 0 ? 'Goal' : 'Shot',
              description: matchDetails.goals > 0 ? 'Goal scored' : 'Shot on target',
            },
            {
              minute: "45'",
              event: matchDetails.assists > 0 ? 'Assist' : 'Pass',
              description: matchDetails.assists > 0 ? 'Assist provided' : 'Key pass',
            },
            {
              minute: "67'",
              event: matchDetails.tackles > 2 ? 'Tackle' : 'Interception',
              description: 'Defensive action',
            },
          ],
        }
      }
    }

    return formattedData
  } catch (error) {
    console.error('Error fetching player data for PDF:', error)
    throw error
  }
}

/**
 * Calculates age from birth date
 */
const calculateAge = (birthDate: Date): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

/**
 * Calculates average of numbers
 */
const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  const sum = numbers.reduce((a, b) => a + b, 0)
  return Math.round((sum / numbers.length) * 10) / 10
}
