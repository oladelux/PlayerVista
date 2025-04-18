import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import PDFFooter from './PDFFooter'
import PDFHeader from './PDFHeader'
import { PlayerPdfData } from './PlayerSeasonPDF'
import PlayerStatsTable from './PlayerStatsTable'
import StatItem from './StatItem'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1F2C',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5DEFF',
  },
  matchInfo: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#F1F0FB',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamVs: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1F2C',
    marginBottom: 5,
    textAlign: 'center',
  },
  versusText: {
    fontSize: 12,
    color: '#8E9196',
    marginHorizontal: 10,
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 5,
  },
  matchDate: {
    fontSize: 10,
    color: '#8E9196',
  },
  matchLocation: {
    fontSize: 10,
    color: '#8E9196',
    marginTop: 2,
  },
  playerInfo: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FDE1D3',
    padding: 15,
    borderRadius: 5,
  },
  playerDetails: {
    flex: 2,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1F2C',
  },
  playerPosition: {
    fontSize: 12,
    color: '#8E9196',
    marginBottom: 5,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  performanceDetails: {
    marginBottom: 20,
  },
  performanceText: {
    fontSize: 10,
    marginBottom: 10,
    lineHeight: 1.5,
    color: '#403E43',
  },
  highlightText: {
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  heatmapPlaceholder: {
    height: 180,
    backgroundColor: '#F1F0FB',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPlaysTable: {
    marginBottom: 20,
  },
  comparisonTable: {
    marginBottom: 20,
  },
  notableStats: {
    marginBottom: 20,
  },
  confidential: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#E5DEFF',
    borderRadius: 5,
  },
  confidentialText: {
    fontSize: 9,
    color: '#8B5CF6',
    textAlign: 'center',
  },
  improveSection: {
    backgroundColor: '#E5DEFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  coachSection: {
    backgroundColor: '#D3E4FD',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1F2C',
    marginBottom: 8,
  },
  bulletPoints: {
    marginLeft: 10,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bullet: {
    fontSize: 10,
    marginRight: 5,
    color: '#8B5CF6',
  },
  bulletText: {
    fontSize: 10,
    flex: 1,
    color: '#403E43',
    lineHeight: 1.4,
  },
  branding: {
    position: 'absolute',
    bottom: 10,
    right: 30,
    fontSize: 8,
    color: '#8E9196',
  },
})

// Interface for match-specific report data
export interface MatchDetails {
  opponent: string
  date: string
  result: string
  minutesPlayed: number
  goals: number
  assists: number
  shots: number
  shotsOnTarget: number
  passAccuracy: number
  tackles: number
  interceptions: number
  rating: string
  location?: string
}

export interface KeyEvent {
  minute: string
  event: string
  description: string
  [key: string]: string | unknown
}

export interface PlayerMatchPdfData extends PlayerPdfData {
  matchDetails?: MatchDetails
  keyEvents?: KeyEvent[]
}

interface PlayerMatchPDFProps {
  playerData: PlayerMatchPdfData
  matchData?: MatchDetails | null
  isComparison?: boolean
}

const PlayerMatchPDF: React.FC<PlayerMatchPDFProps> = ({
  playerData,
  matchData,
  isComparison = false,
}) => {
  // Use the specific match data if provided, or fall back to the first match in playerData
  const matchDetails = matchData ||
    playerData.matchDetails || {
      opponent: 'Opponent FC',
      date: new Date().toLocaleDateString(),
      result: '1-1',
      minutesPlayed: 90,
      goals: 0,
      assists: 0,
      shots: 0,
      shotsOnTarget: 0,
      passAccuracy: 0,
      tackles: 0,
      interceptions: 0,
      rating: '6.0',
      location: 'Home Stadium',
    }

  // Create key events data
  const keyEventsData = playerData.keyEvents || [
    { minute: "23'", event: 'Goal', description: 'Right-footed shot from inside the box' },
    { minute: "45+2'", event: 'Yellow Card', description: 'Tactical foul on opponent midfielder' },
    { minute: "67'", event: 'Assist', description: 'Cross from right wing to striker' },
    { minute: "83'", event: 'Shot', description: 'Long-range effort saved by goalkeeper' },
  ]

  const keyEventsColumns = [
    { key: 'minute', header: 'Min', width: 0.5 },
    { key: 'event', header: 'Event', width: 0.7 },
    { key: 'description', header: 'Description', width: 2 },
  ]

  // Improvement points for coach notes
  const generateImprovementPoints = (playerData: PlayerMatchPdfData, match: MatchDetails) => {
    const points = []

    // Shooting efficiency
    if (match.shots > 0 && match.shotsOnTarget / match.shots < 0.5) {
      points.push(
        'Work on shooting accuracy - only ' +
          ((match.shotsOnTarget / match.shots) * 100).toFixed(0) +
          '% of shots on target',
      )
    }

    // Passing
    if (match.passAccuracy < 75) {
      points.push(
        'Improve passing accuracy - ' + match.passAccuracy + '% completion rate is below target',
      )
    }

    // Defensive contribution
    if (playerData.position.includes('Midfielder') && match.tackles < 2) {
      points.push('Increase defensive contribution - only ' + match.tackles + ' successful tackles')
    }

    // Goal threat
    if (playerData.position.includes('Forward') && match.shots < 2) {
      points.push('Be more assertive in final third - only ' + match.shots + ' shots attempted')
    }

    // Default improvement point
    if (points.length === 0) {
      points.push('Continue to work on overall game management and tactical understanding')
      points.push('Focus on maintaining consistent performance levels throughout the match')
    }

    return points
  }

  const generateCoachNotes = (playerData: PlayerMatchPdfData, match: MatchDetails) => {
    const notes = []

    // Overall performance assessment
    const ratingNum = parseFloat(match.rating)
    let performanceAssessment = 'average'

    if (ratingNum >= 8.5) {
      performanceAssessment = 'exceptional'
    } else if (ratingNum >= 7.5) {
      performanceAssessment = 'very good'
    } else if (ratingNum >= 6.5) {
      performanceAssessment = 'solid'
    } else if (ratingNum < 6) {
      performanceAssessment = 'below par'
    }

    notes.push(
      `Overall ${performanceAssessment} performance with a match rating of ${match.rating}.`,
    )

    // Specific performance notes
    if (match.goals > 0) {
      notes.push(
        `Good composure in front of goal, converting ${match.goals} of ${match.shots} chances.`,
      )
    }

    if (match.assists > 0) {
      notes.push(`Created ${match.assists} assist(s), showing good vision and passing ability.`)
    }

    if (match.passAccuracy > 85) {
      notes.push(
        `Excellent passing accuracy at ${match.passAccuracy}%, maintaining possession well.`,
      )
    }

    if (match.tackles + match.interceptions > 5) {
      notes.push(
        `Strong defensive contribution with ${match.tackles} tackles and ${match.interceptions} interceptions.`,
      )
    }

    // Next opponent preparation
    notes.push(
      'Preparation for next match should focus on maintaining strengths shown and addressing improvement areas.',
    )

    return notes
  }

  // Generate improvement points and coach notes
  const improvementPoints = generateImprovementPoints(playerData, matchDetails)
  const coachNotes = generateCoachNotes(playerData, matchDetails)

  // Stats comparison if needed
  const statsComparisonData = isComparison
    ? [
        {
          metric: 'Goals',
          player: matchDetails.goals,
          teamAvg: '0.8',
          leagueAvg: '0.5',
        },
        {
          metric: 'Assists',
          player: matchDetails.assists,
          teamAvg: '0.6',
          leagueAvg: '0.4',
        },
        {
          metric: 'Shots',
          player: matchDetails.shots,
          teamAvg: '2.3',
          leagueAvg: '1.9',
        },
        {
          metric: 'Pass Accuracy',
          player: matchDetails.passAccuracy + '%',
          teamAvg: '79%',
          leagueAvg: '76%',
        },
        {
          metric: 'Tackles',
          player: matchDetails.tackles,
          teamAvg: '1.8',
          leagueAvg: '1.7',
        },
      ]
    : []

  const comparisonColumns = [
    { key: 'metric', header: 'Metric', width: 1 },
    { key: 'player', header: 'Player', width: 0.7 },
    { key: 'teamAvg', header: 'Team Avg', width: 0.7 },
    { key: 'leagueAvg', header: 'League Avg', width: 0.7 },
  ]

  // Render the PDF
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <PDFHeader
          title={`${playerData.name} - Match Report`}
          subtitle={`vs. ${matchDetails.opponent} - ${matchDetails.date}`}
        />

        {/* Match Info Section */}
        <View style={styles.matchInfo}>
          <View>
            <Text style={styles.teamName}>{playerData.team}</Text>
            <Text style={styles.matchLocation}>{matchDetails.location || 'Home Stadium'}</Text>
          </View>
          <View style={styles.teamVs}>
            <Text style={styles.result}>{matchDetails.result}</Text>
          </View>
          <View>
            <Text style={styles.teamName}>{matchDetails.opponent}</Text>
            <Text style={styles.matchDate}>{matchDetails.date}</Text>
          </View>
        </View>

        {/* Player Info Section */}
        <View style={styles.playerInfo}>
          <View style={styles.playerDetails}>
            <Text style={styles.playerName}>{playerData.name}</Text>
            <Text style={styles.playerPosition}>
              {playerData.position} | #{playerData.number}
            </Text>
          </View>
        </View>

        {/* Key Match Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>
          <View style={styles.statRow}>
            <StatItem title='Rating' value={matchDetails.rating} highlight={true} />
            <StatItem title='Minutes' value={matchDetails.minutesPlayed} />
            <StatItem title='Goals' value={matchDetails.goals} />
            <StatItem title='Assists' value={matchDetails.assists} />
            <StatItem title='Shots' value={matchDetails.shots} />
            <StatItem title='Pass %' value={`${matchDetails.passAccuracy}%`} />
          </View>

          <View style={styles.performanceDetails}>
            <Text style={styles.performanceText}>
              {playerData.name} had a{' '}
              {parseFloat(matchDetails.rating) >= 7.5
                ? 'strong'
                : parseFloat(matchDetails.rating) >= 6.5
                  ? 'solid'
                  : 'challenging'}{' '}
              performance against {matchDetails.opponent}, achieving a match rating of{' '}
              <Text style={styles.highlightText}>{matchDetails.rating}</Text>.{' '}
              {matchDetails.goals > 0
                ? `Contributed with ${matchDetails.goals} goal(s) and ${matchDetails.assists} assist(s).`
                : matchDetails.assists > 0
                  ? `Provided ${matchDetails.assists} assist(s) to teammates.`
                  : `Focused on overall team play and positional responsibilities.`}
            </Text>
            <Text style={styles.performanceText}>
              With a pass completion rate of{' '}
              <Text style={styles.highlightText}>{matchDetails.passAccuracy}%</Text>,{' '}
              {matchDetails.passAccuracy >= 85
                ? 'excellent ball distribution was a highlight of the performance.'
                : matchDetails.passAccuracy >= 75
                  ? 'maintained good ball circulation throughout the match.'
                  : 'there is room for improvement in retention of possession.'}{' '}
              {matchDetails.tackles > 2
                ? `Made a strong defensive contribution with ${matchDetails.tackles} tackles and ${matchDetails.interceptions} interceptions.`
                : ''}
            </Text>
          </View>
        </View>

        {/* Key Events Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Events</Text>
          <PlayerStatsTable data={keyEventsData} columns={keyEventsColumns} highlight={['event']} />
        </View>

        {/* Stats Comparison - Only shown if comparison is true */}
        {isComparison && (
          <View style={styles.comparisonTable}>
            <Text style={styles.sectionTitle}>Performance Comparison</Text>
            <PlayerStatsTable
              data={statsComparisonData}
              columns={comparisonColumns}
              highlight={['player']}
            />
          </View>
        )}

        {/* Areas for Improvement */}
        <View style={styles.improveSection}>
          <Text style={styles.sectionTitle}>Areas for Improvement</Text>
          <View style={styles.bulletPoints}>
            {improvementPoints.map((point, index) => (
              <View key={`improve-${index}`} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Coach's Notes */}
        <View style={styles.coachSection}>
          <Text style={styles.sectionTitle}>Coach's Notes</Text>
          <View style={styles.bulletPoints}>
            {coachNotes.map((note, index) => (
              <View key={`coach-${index}`} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{note}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Confidential Footer */}
        <View style={styles.confidential}>
          <Text style={styles.confidentialText}>MATCH ANALYSIS REPORT - FOR INTERNAL USE ONLY</Text>
        </View>

        <PDFFooter text={`${playerData.team} Football Club`} />
        <Text style={styles.branding}>Generated by PlayerVista</Text>
      </Page>
    </Document>
  )
}

export default PlayerMatchPDF
