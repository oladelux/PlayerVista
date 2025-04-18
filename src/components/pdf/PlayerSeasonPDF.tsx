import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import PDFFooter from './PDFFooter'
import PDFHeader from './PDFHeader'
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
  playerInfo: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#F1F0FB',
    padding: 10,
    borderRadius: 5,
  },
  playerDetails: {
    flex: 2,
  },
  playerBasicInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  playerBasicInfoItem: {
    flex: 1,
  },
  playerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1F2C',
  },
  playerPosition: {
    fontSize: 14,
    color: '#8E9196',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 10,
    color: '#8E9196',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#403E43',
  },
  seasonStats: {
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  chartPlaceholder: {
    height: 180,
    backgroundColor: '#F1F0FB',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  performanceAnalysis: {
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 10,
    lineHeight: 1.5,
    color: '#403E43',
  },
  strengthsWeaknesses: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  strengthsSection: {
    flex: 1,
    marginRight: 10,
  },
  weaknessesSection: {
    flex: 1,
    marginLeft: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 10,
    marginRight: 5,
    color: '#8B5CF6',
  },
  listItemText: {
    fontSize: 10,
    flex: 1,
    color: '#403E43',
  },
  confidential: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FDE1D3',
    borderRadius: 5,
  },
  confidentialText: {
    fontSize: 9,
    color: '#F97316',
    textAlign: 'center',
  },
  trainingFocus: {
    backgroundColor: '#E5DEFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  coachInsights: {
    backgroundColor: '#D3E4FD',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  progressSection: {
    backgroundColor: '#F2FCE2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  comparisonSection: {
    backgroundColor: '#FDE1D3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  developmentPlanSection: {
    backgroundColor: '#FEF7CD',
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
  branding: {
    position: 'absolute',
    bottom: 10,
    right: 30,
    fontSize: 8,
    color: '#8E9196',
  },
})

// Define proper types for the various statistics objects
export interface OffensiveStats {
  totalShots?: number
  shotsOnTarget?: number
  shotsOffTarget?: number
  shotsAccuracy?: number
  totalDribbles?: number
  successfulDribbles?: number
  dribblesAccuracy?: number
  totalPasses?: number
  successfulPasses?: number
  passAccuracy?: number
  totalGoals?: number
  totalAssists?: number
  penaltiesScored?: number
  penaltiesLost?: number
  penaltiesAccuracy?: number
  // Add other fields as needed
}

export interface DefensiveStats {
  successfulTackles?: number
  totalTackles?: number
  totalInterceptions?: number
  totalClearances?: number
  totalBlocks?: number
  totalAerialDuels?: number
  aerialDuelsWon?: number
  // Add other fields as needed
}

export interface PossessionStats {
  totalCrosses?: number
  successfulCrosses?: number
  totalTouches?: number
  attemptedTakeOns?: number
  successfulTakeOns?: number
  totalCorners?: number
  totalFreeKicks?: number
  totalFoulsReceived?: number
  // Add other fields as needed
}

export interface DisciplinaryStats {
  totalYellowCards?: number
  totalRedCards?: number
  totalFouls?: number
  // Add other fields as needed
}

export interface GoalkeeperStats {
  shotsOnTargetAgainst?: number
  saves?: number
  savePercentage?: number
  penaltySaves?: number
  penaltyMisses?: number
  penaltySavePercentage?: number
  directFreeKickFaced?: number
  freeKickSaved?: number
  freeKickGoalSaved?: number
  oneVOneFaced?: number
  oneVOneSaved?: number
  oneVOneSavedPercentage?: number
  // Add other fields as needed
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
  yellowCardsTotal?: number
  redCards: number
  redCardsTotal?: number
  duelsWon: number
  duelsLost: number
  distanceCovered: number
  chancesCreated: number
  dribbleSuccess?: number
  shotsTotal?: number
  xG?: string | number
  xGPer90?: string | number
  progressivePassesPer90?: string | number
  progressiveCarriesPer90?: string | number
  successfulPressure?: string | number
  aerialDuelSuccessRate?: string | number
}

export interface MatchData {
  opponent: string
  date: string
  goals: number
  assists: number
  rating: string
  minutesPlayed?: number
  shotsOnTarget?: number
  [key: string]: string | number | undefined
}

export interface PerformanceData {
  // Define a proper type for performance data
  id?: string
  eventId?: string
  playerId?: string
  minutePlayed?: number
  actions?: Record<string, unknown>
  createdAt?: Date
  updatedAt?: Date
  heatmap?: Array<{ x: number; y: number; timestamp: number }>
  // Add other fields as needed
}

export interface PlayerPdfData {
  name: string
  position: string
  team: string
  number: number
  age: number
  nationality: string
  height: string | number
  weight: string | number
  foot: string
  stats: PlayerStats
  matchesData?: MatchData[]
  performanceData?: PerformanceData[]
  offensiveStats?: OffensiveStats
  defensiveStats?: DefensiveStats
  possessionStats?: PossessionStats
  disciplinaryStats?: DisciplinaryStats
  goalkeeperStats?: GoalkeeperStats
  // Optional data for future use
  performances?: PerformanceData[]
  matches?: Record<string, unknown>[]
}

export interface SeasonData {
  year: number
  team: string
  league?: string
  startDate?: Date
  endDate?: Date
  // Add other fields as needed
}

interface PlayerSeasonPDFProps {
  playerData: PlayerPdfData
}

// Function to generate strengths and weaknesses based on player stats
const generateAnalysis = (playerData: PlayerPdfData) => {
  // This would be more sophisticated in a real implementation
  const strengths = []
  const weaknesses = []

  // Simple example logic
  if (playerData.stats.goals > 10) {
    strengths.push(
      'Excellent goal-scoring ability with ' + playerData.stats.goals + ' goals this season',
    )
  } else if (playerData.stats.goals < 5 && playerData.position === 'Forward') {
    weaknesses.push('Needs to improve goal conversion rate')
  }

  if (playerData.stats.passAccuracy > 80) {
    strengths.push('Impressive pass accuracy of ' + playerData.stats.passAccuracy + '%')
  } else if (playerData.stats.passAccuracy < 70) {
    weaknesses.push('Could improve pass completion rate')
  }

  if (playerData.stats.assists > 7) {
    strengths.push('Creative playmaker with ' + playerData.stats.assists + ' assists')
  }

  if (playerData.stats.dribbleSuccess && playerData.stats.dribbleSuccess > 70) {
    strengths.push(
      'Excellent dribbling skills with ' + playerData.stats.dribbleSuccess + '% success rate',
    )
  }

  if (playerData.stats.duelsWon > playerData.stats.duelsLost * 1.5) {
    strengths.push('Strong in physical confrontations, winning most duels')
  } else if (playerData.stats.duelsLost > playerData.stats.duelsWon) {
    weaknesses.push('Needs to improve strength in duels')
  }

  // Fill in with defaults if needed
  if (strengths.length < 3) {
    strengths.push('Consistent performer with good work ethic')
    strengths.push('Well-integrated team player')
  }

  if (weaknesses.length < 2) {
    weaknesses.push('Could improve decision-making in the final third')
    weaknesses.push('Room for improvement in defensive positioning')
  }

  return { strengths, weaknesses }
}

// Generate training focus areas based on player stats and position
const generateTrainingFocus = (playerData: PlayerPdfData) => {
  const trainingFocus = []

  // Position-based training focus
  if (playerData.position.includes('Forward') || playerData.position.includes('Striker')) {
    trainingFocus.push('Finishing drills focusing on first-time shots and weak foot development')
    trainingFocus.push('Movement patterns to create separation from defenders in the box')
  } else if (playerData.position.includes('Midfielder')) {
    trainingFocus.push('Passing exercises emphasizing weight of pass and through-ball accuracy')
    trainingFocus.push(
      'Transitional play drills to improve decision making when switching from defense to attack',
    )
  } else if (playerData.position.includes('Defender')) {
    trainingFocus.push('1v1 defensive positioning drills to improve containment techniques')
    trainingFocus.push('Building from the back exercises to enhance passing under pressure')
  }

  // Stat-based training focus
  if (playerData.stats.passAccuracy < 75) {
    trainingFocus.push('Targeted passing drills with emphasis on technique and body position')
  }

  if (playerData.stats.dribbleSuccess && playerData.stats.dribbleSuccess < 60) {
    trainingFocus.push('Close control exercises in tight spaces to improve dribbling efficiency')
  }

  if (
    playerData.stats.shotsTotal &&
    playerData.stats.shotsOnTarget / playerData.stats.shotsTotal < 0.5
  ) {
    trainingFocus.push('Shooting accuracy drills with focus on proper technique and placement')
  }

  if (
    playerData.stats.duelsWon / (playerData.stats.duelsWon + playerData.stats.duelsLost) < 0.5 &&
    playerData.stats.duelsWon + playerData.stats.duelsLost > 0
  ) {
    trainingFocus.push('Strength and conditioning program to improve physical duels')
  }

  // General development areas
  trainingFocus.push('Video analysis sessions of elite players in similar positions')
  trainingFocus.push('Mental resilience training to maintain performance under pressure')

  return trainingFocus
}

// Generate coach insights
const generateCoachInsights = (playerData: PlayerPdfData) => {
  const insights = []

  // Role insights
  insights.push(
    `${playerData.name}'s natural role appears to be as a ${playerData.position} with particular strengths in ${playerData.stats.goals > playerData.stats.assists ? 'finishing' : 'creating opportunities'}.`,
  )

  // Performance insights
  if (playerData.stats.appearances > 25) {
    insights.push(
      'Has shown excellent consistency throughout the season, becoming a reliable performer for the team.',
    )
  } else if (playerData.stats.appearances < 15) {
    insights.push(
      'Limited playing time suggests need for more consistent performances in training to earn match opportunities.',
    )
  }

  // Integration insights
  insights.push(
    `Player shows good understanding of team tactics and integrates well with other ${playerData.position.includes('Forward') ? 'attacking' : playerData.position.includes('Defender') ? 'defensive' : 'midfield'} players.`,
  )

  // Development path
  insights.push(
    `Based on current trajectory, player should focus on ${playerData.age < 23 ? 'technical development and game understanding' : 'maintaining physical condition and mentoring younger players'}.`,
  )

  return insights
}

// Generate a development plan
const generateDevelopmentPlan = (playerData: PlayerPdfData) => {
  const plan = []

  // Short-term goals (next 3 months)
  plan.push(
    'Short-term (3 months): ' +
      (playerData.stats.goals < 5
        ? 'Improve goal conversion rate by 10%'
        : playerData.stats.passAccuracy < 70
          ? 'Increase pass completion rate to 75%'
          : 'Maintain current performance levels while improving game awareness'),
  )

  // Medium-term goals (season)
  plan.push(
    'Medium-term (end of season): ' +
      (playerData.position.includes('Forward')
        ? `Achieve ${Math.round(playerData.stats.goals * 1.2)} goals for the season`
        : playerData.position.includes('Midfielder')
          ? `Reach ${Math.round(playerData.stats.assists * 1.2)} assists for the season`
          : `Contribute to ${Math.round(playerData.stats.appearances * 0.3)} clean sheets`),
  )

  // Long-term development
  plan.push(
    'Long-term (next season): ' +
      (playerData.age < 23
        ? 'Establish as a consistent starter and increase contribution to team performance'
        : 'Take on more leadership responsibilities and maintain peak physical condition'),
  )

  return plan
}

const PlayerSeasonPDF: React.FC<PlayerSeasonPDFProps> = ({ playerData }) => {
  const { strengths, weaknesses } = generateAnalysis(playerData)
  const trainingFocus = generateTrainingFocus(playerData)
  const coachInsights = generateCoachInsights(playerData)
  const developmentPlan = generateDevelopmentPlan(playerData)

  // Use real match data if available, otherwise fallback to demo data
  const matchPerformanceData =
    playerData.matchesData && playerData.matchesData.length > 0
      ? playerData.matchesData.slice(0, 5) // Use the 5 most recent matches
      : [
          { opponent: 'Liverpool', date: '12/08/2023', goals: 1, assists: 1, rating: '8.4' },
          { opponent: 'Arsenal', date: '19/08/2023', goals: 0, assists: 0, rating: '6.8' },
          { opponent: 'Newcastle', date: '26/08/2023', goals: 2, assists: 0, rating: '9.1' },
          { opponent: 'Chelsea', date: '02/09/2023', goals: 0, assists: 1, rating: '7.2' },
          { opponent: 'Tottenham', date: '09/09/2023', goals: 1, assists: 0, rating: '8.7' },
        ]

  const matchColumns = [
    { key: 'opponent', header: 'Opponent', width: 1.5 },
    { key: 'date', header: 'Date', width: 1 },
    { key: 'goals', header: 'Goals', width: 0.7 },
    { key: 'assists', header: 'Assists', width: 0.7 },
    { key: 'rating', header: 'Rating', width: 0.7 },
  ]

  // Advanced season stats for player development
  const advancedStatsData = [
    {
      category: 'Expected Goals (xG)',
      value: playerData.stats.xG || (playerData.stats.goals * 0.85).toFixed(1),
    },
    {
      category: 'xG Per 90 Minutes',
      value:
        playerData.stats.xGPer90 ||
        ((playerData.stats.goals * 0.85) / (playerData.stats.minutesPlayed / 90)).toFixed(2),
    },
    {
      category: 'Progressive Passes Per 90',
      value: playerData.stats.progressivePassesPer90 || '4.2',
    },
    {
      category: 'Progressive Carries Per 90',
      value: playerData.stats.progressiveCarriesPer90 || '3.1',
    },
    {
      category: 'Successful Pressure %',
      value: playerData.stats.successfulPressure || '27%',
    },
    {
      category: 'Aerial Duel Success Rate',
      value: playerData.stats.aerialDuelSuccessRate || '61%',
    },
  ]

  const advancedStatsColumns = [
    { key: 'category', header: 'Advanced Metric', width: 2 },
    { key: 'value', header: 'Value', width: 1 },
  ]

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <PDFHeader
          title={`${playerData.name} - Season Report`}
          subtitle={`${playerData.team} - ${new Date().getFullYear()}`}
        />

        <View style={styles.playerInfo}>
          <View style={styles.playerDetails}>
            <Text style={styles.playerName}>{playerData.name}</Text>
            <Text style={styles.playerPosition}>
              {playerData.position} | #{playerData.number}
            </Text>

            <View style={styles.playerBasicInfo}>
              <View style={styles.playerBasicInfoItem}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{playerData.age}</Text>
              </View>
              <View style={styles.playerBasicInfoItem}>
                <Text style={styles.infoLabel}>Nationality</Text>
                <Text style={styles.infoValue}>{playerData.nationality}</Text>
              </View>
              <View style={styles.playerBasicInfoItem}>
                <Text style={styles.infoLabel}>Height</Text>
                <Text style={styles.infoValue}>{playerData.height}</Text>
              </View>
              <View style={styles.playerBasicInfoItem}>
                <Text style={styles.infoLabel}>Preferred Foot</Text>
                <Text style={styles.infoValue}>{playerData.foot}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Season Highlights</Text>
          <View style={styles.statRow}>
            <StatItem title='Appearances' value={playerData.stats.appearances} />
            <StatItem title='Goals' value={playerData.stats.goals} highlight={true} />
            <StatItem title='Assists' value={playerData.stats.assists} highlight={true} />
            <StatItem title='Minutes Played' value={playerData.stats.minutesPlayed} />
            <StatItem title='Pass Accuracy' value={`${playerData.stats.passAccuracy}%`} />
            <StatItem title='Chances Created' value={playerData.stats.chancesCreated} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Analysis</Text>
          <Text style={styles.paragraph}>
            {playerData.name} has demonstrated{' '}
            {playerData.stats.goals > 10 ? 'exceptional' : 'solid'}
            performance throughout the season, contributing {playerData.stats.goals} goals and{' '}
            {playerData.stats.assists} assists in {playerData.stats.appearances} appearances for{' '}
            {playerData.team}.
          </Text>
          <Text style={styles.paragraph}>
            With a pass accuracy of {playerData.stats.passAccuracy}% and creating{' '}
            {playerData.stats.chancesCreated} chances,
            {playerData.name} has been{' '}
            {playerData.stats.chancesCreated > 30 ? 'instrumental' : 'valuable'} to the team's
            offensive play.{' '}
            {playerData.stats.duelsWon > playerData.stats.duelsLost
              ? `Showing strong physical presence, winning ${playerData.stats.duelsWon} duels.`
              : `Physical confrontations remain an area for development.`}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Season Metrics</Text>
          <PlayerStatsTable
            data={advancedStatsData}
            columns={advancedStatsColumns}
            highlight={[]}
          />
        </View>

        <View style={styles.strengthsWeaknesses}>
          <View style={styles.strengthsSection}>
            <Text style={styles.sectionTitle}>Strengths</Text>
            {strengths.map((strength, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.listItemText}>{strength}</Text>
              </View>
            ))}
          </View>

          <View style={styles.weaknessesSection}>
            <Text style={styles.sectionTitle}>Areas for Improvement</Text>
            {weaknesses.map((weakness, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.listItemText}>{weakness}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Match Performance</Text>
          <PlayerStatsTable
            data={matchPerformanceData}
            columns={matchColumns}
            highlight={['rating']}
          />
        </View>

        {/* Development-focused sections */}
        <View style={styles.trainingFocus}>
          <Text style={styles.sectionTitle}>Training Focus Areas</Text>
          {trainingFocus.map((focus, index) => (
            <View key={`training-${index}`} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listItemText}>{focus}</Text>
            </View>
          ))}
        </View>

        <View style={styles.coachInsights}>
          <Text style={styles.sectionTitle}>Coach's Insights</Text>
          {coachInsights.map((insight, index) => (
            <View key={`coach-${index}`} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listItemText}>{insight}</Text>
            </View>
          ))}
        </View>

        <View style={styles.developmentPlanSection}>
          <Text style={styles.sectionTitle}>Player Development Plan</Text>
          {developmentPlan.map((item, index) => (
            <View key={`plan-${index}`} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.confidential}>
          <Text style={styles.confidentialText}>
            PLAYER DEVELOPMENT REPORT - FOR INTERNAL USE ONLY
          </Text>
        </View>

        <PDFFooter text={`${playerData.team} Football Club`} />
        <Text style={styles.branding}>Generated by PlayerVista</Text>
      </Page>
    </Document>
  )
}

export default PlayerSeasonPDF
