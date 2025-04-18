import { pdf } from '@react-pdf/renderer'

import PlayerMatchPDF, { MatchDetails, PlayerMatchPdfData } from '@/components/pdf/PlayerMatchPDF'
import PlayerSeasonPDF, {
  PlayerPdfData as SeasonPlayerPdfData,
} from '@/components/pdf/PlayerSeasonPDF'
import { CoachNotesFormValues } from '@/components/ui/pdf-coach-notes-modal'
import { PdfTypeEnum } from '@/config/PdfType'

import { fetchPlayerDataForPdf } from './playerPerformanceService'

export interface PlayerPdfData {
  player: Record<string, unknown>
  matches: Record<string, unknown>
  comparison?: boolean
}

export interface PlayerStats {
  appearances: number
  goals: number
  assists: number
  minutesPlayed: number
  passAccuracy: number
  shotsOnTarget: number
  tackles: number
  yellowCards: number
  redCards: number
  distanceCovered: number
}

export interface PlayerInfo {
  name: string
  position: string
  team: string
  number: number
  age: number
  nationality: string
  height: number
  weight: number
  foot: string
}

export interface PlayerFormat {
  name: string
  position: string
  team: string
  number: number
  age: number
  nationality: string
  height: number
  weight: number
  foot: string
  stats: PlayerStats
  performanceData?: unknown[]
  matchesData?: unknown[]
}

export interface PdfExportOptions {
  title: string
  subtitle?: string
  content?: string
  data?: PlayerPdfData | unknown
  filename?: string
  exportType: PdfTypeEnum
  templateName?: string
  includeImages?: boolean
  footerText?: string
  playerId?: string
  eventId?: string
  notes: CoachNotesFormValues | undefined
}

// Adapters to convert generic data to specific types
const adaptToPlayerMatchPdfData = (player: Record<string, unknown>): PlayerMatchPdfData => {
  return {
    name: String(player.name || 'Unknown Player'),
    position: String(player.position || 'Forward'),
    team: String(player.team || 'Team'),
    number: Number(player.number || 0),
    age: Number(player.age || 25),
    nationality: String(player.nationality || 'Unknown'),
    height: String(player.height || '180cm'),
    weight: String(player.weight || '75kg'),
    foot: String(player.foot || 'Right'),
    stats: {
      appearances: Number(player.appearances || 0),
      goals: Number(player.goals || 0),
      assists: Number(player.assists || 0),
      minutesPlayed: Number(player.minutesPlayed || 0),
      passAccuracy: Number(player.passAccuracy || 0),
      shotsOnTarget: Number(player.shotsOnTarget || 0),
      tackles: Number(player.tackles || 0),
      yellowCards: Number(player.yellowCards || 0),
      redCards: Number(player.redCards || 0),
      duelsWon: Number(player.duelsWon || 0),
      duelsLost: Number(player.duelsLost || 0),
      distanceCovered: Number(player.distanceCovered || 0),
      chancesCreated: Number(player.chancesCreated || 0),
    },
  }
}

const adaptToMatchDetails = (match: Record<string, unknown>): MatchDetails => {
  return {
    opponent: String(match.opponent || 'Opponent FC'),
    date: String(match.date || new Date().toLocaleDateString()),
    result: String(match.result || '0-0'),
    minutesPlayed: Number(match.minutesPlayed || 90),
    goals: Number(match.goals || 0),
    assists: Number(match.assists || 0),
    shots: Number(match.shots || 0),
    shotsOnTarget: Number(match.shotsOnTarget || 0),
    passAccuracy: Number(match.passAccuracy || 0),
    tackles: Number(match.tackles || 0),
    interceptions: Number(match.interceptions || 0),
    rating: String(match.rating || '6.0'),
    location: String(match.location || 'Home Stadium'),
  }
}

export const generatePdf = async (options: PdfExportOptions): Promise<boolean> => {
  try {
    console.log('Generating PDF with options:', options)

    // Set default filename if not provided
    const filename =
      options.filename ||
      `${options.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.pdf`

    // Check if we should fetch real player data
    let realPlayerData = null
    if (options.playerId) {
      realPlayerData = await fetchPlayerDataForPdf(options.playerId, options.eventId)
      console.log('Using real player data for PDF:', realPlayerData)
    }

    // Create PDF component based on export type
    let PdfComponent
    switch (options.exportType) {
      case PdfTypeEnum.FULL_PLAYER_REPORT:
        PdfComponent = <PlayerSeasonPDF playerData={realPlayerData as SeasonPlayerPdfData} />
        break
      case PdfTypeEnum.SINGLE_MATCH_PLAYER_REPORT:
        if (realPlayerData) {
          const matchData = realPlayerData.matches?.find(m => m.id === options.eventId)
          PdfComponent = (
            <PlayerMatchPDF
              playerData={realPlayerData as unknown as PlayerMatchPdfData}
              matchData={
                matchData
                  ? {
                      opponent: String(matchData.opponent || ''),
                      date:
                        typeof matchData.date === 'object'
                          ? matchData.date.toLocaleDateString()
                          : String(matchData.date || ''),
                      result: String(matchData.result || ''),
                      minutesPlayed: Number(matchData.minutesPlayed || 0),
                      goals: Number(matchData.goals || 0),
                      assists: Number(matchData.assists || 0),
                      shots: Number(matchData.shots || 0),
                      shotsOnTarget: Number(matchData.shotsOnTarget || 0),
                      passAccuracy: Number(matchData.passAccuracy || 0),
                      tackles: Number(matchData.tackles || 0),
                      interceptions: Number(matchData.interceptions || 0),
                      rating: String(matchData.rating || '0'),
                    }
                  : null
              }
              isComparison={false}
            />
          )
        } else {
          const data = options.data as PlayerPdfData
          PdfComponent = (
            <PlayerMatchPDF
              playerData={
                data?.player ? adaptToPlayerMatchPdfData(data.player) : ({} as PlayerMatchPdfData)
              }
              matchData={data?.matches ? adaptToMatchDetails(data.matches) : null}
              isComparison={data?.comparison || false}
            />
          )
        }
        break
      default:
        throw new Error(`Unknown export type: ${options.exportType}`)
    }

    // Generate PDF blob
    const pdfBlob = await pdf(PdfComponent).toBlob()

    // Create download link
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100)

    console.log('PDF generated and downloaded successfully')
    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    return false
  }
}

export const PdfTemplates = {
  PLAYER_SEASON_OVERVIEW: 'player-season-overview',
  PLAYER_MATCH_DETAIL: 'player-match-detail',
}

// Format player data for PDF export
export const formatPlayerDataForPdf = (playerData: PlayerFormat) => {
  return {
    playerInfo: {
      name: playerData.name,
      position: playerData.position,
      team: playerData.team,
      number: playerData.number,
      age: playerData.age,
      nationality: playerData.nationality,
      height: playerData.height,
      weight: playerData.weight,
      foot: playerData.foot,
    },
    seasonStats: {
      appearances: playerData.stats.appearances,
      goals: playerData.stats.goals,
      assists: playerData.stats.assists,
      minutesPlayed: playerData.stats.minutesPlayed,
      passAccuracy: playerData.stats.passAccuracy,
      shotsOnTarget: playerData.stats.shotsOnTarget,
      tackles: playerData.stats.tackles,
      yellowCards: playerData.stats.yellowCards,
      redCards: playerData.stats.redCards,
      distanceCovered: playerData.stats.distanceCovered,
    },
    performanceData: playerData.performanceData || [],
    matchesData: playerData.matchesData || [],
  }
}
