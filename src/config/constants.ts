import DefaultPlayerImage from '../assets/images/test.png'
import DefaultPlayerImage2 from '../assets/images/test2.png'
import DefaultPlayerImage3 from '../assets/images/test3.png'
export const title = 'PlayerVista | Player Management System'

export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export type PlayerType = {
  id: number
  countryCode: string
  country: string
  dob: string
  name: string
  position: string
  age: string
  appearance: string
  number: string
  imgSrc: string
}

export const players: PlayerType[] = [
  {
    id: 123,
    countryCode: 'NG',
    country: 'Nigeria',
    name: 'Abdul Jabber',
    position: 'CM',
    dob: '11/02/2002',
    age: '21',
    appearance: '52',
    number: '10',
    imgSrc: DefaultPlayerImage,
  },
  {
    id: 433,
    countryCode: 'US',
    country: 'United States of America',
    name: 'Rashad Dennis',
    position: 'CF',
    dob: '14/05/2005',
    age: '18',
    appearance: '102',
    number: '9',
    imgSrc: DefaultPlayerImage2,
  },
  {
    id: 221,
    countryCode: 'GB',
    country: 'United Kingdom',
    name: 'Mid Better',
    position: 'GK',
    dob: '11/01/1994',
    age: '29',
    appearance: '5',
    number: '1',
    imgSrc: DefaultPlayerImage3,
  },
  {
    id: 78,
    countryCode: 'IE',
    country: 'Ireland',
    name: 'Abdul Jabber',
    position: 'CM',
    dob: '11/02/2002',
    age: '21',
    appearance: '52',
    number: '8',
    imgSrc: DefaultPlayerImage,
  },
  {
    id: 12,
    countryCode: 'GH',
    country: 'Ghana',
    name: 'Rashad Dennis',
    position: 'LB',
    dob: '11/02/2005',
    age: '18',
    appearance: '102',
    number: '3',
    imgSrc: DefaultPlayerImage2,
  },
  {
    id: 3,
    countryCode: 'NG',
    country: 'Nigeria',
    name: 'Mid Better',
    position: 'GK',
    dob: '16/01/1994',
    age: '29',
    appearance: '5',
    number: '12',
    imgSrc: DefaultPlayerImage3,
  },
]

export const matchData = [
  {
    matchId: 2,
    timestamp: '10-7-2023',
    type: 'Training',
    name: 'Training Session 1',
    stage: 'Preparation',
    homeTeamName: 'Team A',
    homeScore: 3,
    awayTeamName: 'Team B',
    awayScore: 2,
  },
  {
    matchId: 3,
    timestamp: '20-6-2023',
    type: 'Match',
    name: 'League',
    stage: 'Round 1',
    homeTeamName: 'Team E',
    homeScore: 2,
    awayTeamName: 'Team F',
    awayScore: 0,
  },
  {
    matchId: 2,
    timestamp: '25-6-2023',
    type: 'Training',
    name: 'Training Session 2',
    stage: 'Preparation',
    homeTeamName: 'Team G',
    homeScore: 4,
    awayTeamName: 'Team H',
    awayScore: 2,
  },
  {
    matchId: 3,
    timestamp: '01-7-2023',
    type: 'Match',
    name: 'Cup',
    stage: 'QF',
    homeTeamName: 'Team Q',
    homeScore: 1,
    awayTeamName: 'Team R',
    awayScore: 3,
  },
]

export const OffensiveStatsItems = [
  {
    name: 'goals',
    placeholder: 'Goals',
  },
  {
    name: 'assists',
    placeholder: 'Assists',
  },
  {
    name: 'shotsOnTarget',
    placeholder: 'Shots on Target',
  },
  {
    name: 'blockedShots',
    placeholder: 'Blocked Shots',
  },
  {
    name: 'shotsOffTarget',
    placeholder: 'Shots off Target',
  },
  {
    name: 'shotsInsidePenaltyArea',
    placeholder: 'Shots inside Penalty Area',
  },
  {
    name: 'shotsOutsidePenaltyArea',
    placeholder: 'Shots outside Penalty Area',
  },
  {
    name: 'offsides',
    placeholder: 'Offsides',
  },
  {
    name: 'freeKicks',
    placeholder: 'Free Kicks',
  },
  {
    name: 'corners',
    placeholder: 'Corners',
  },
  {
    name: 'throwIns',
    placeholder: 'Throw-ins',
  },
  {
    name: 'takeOnsSuccess',
    placeholder: 'Take-ons Success',
  },
  {
    name: 'takeOnsTotal',
    placeholder: 'Total Take-ons',
  },
]

export const DistributionStatsItems = [
  {
    name: 'successfulPasses',
    placeholder: 'Successful Passes',
  },
  {
    name: 'totalPasses',
    placeholder: 'Total Passes',
  },
  {
    name: 'passAccuracy',
    placeholder: 'Pass Accuracy',
  },
  {
    name: 'keyPasses',
    placeholder: 'Key Passes',
  },
  {
    name: 'totalPassesInFinalThird',
    placeholder: 'Total Passes in Final Third',
  },
  {
    name: 'successfulPassesInFinalThird',
    placeholder: 'Successful Passes in Final Third',
  },
  {
    name: 'totalPassesInMiddleThird',
    placeholder: 'Total Passes in Middle Third',
  },
  {
    name: 'successfulPassesInMiddleThird',
    placeholder: 'Successful Passes in Middle Third',
  },
  {
    name: 'totalPassesInDefenciveThird',
    placeholder: 'Total Passes in Defensive Third',
  },
  {
    name: 'successfulPassesInDefenciveThird',
    placeholder: 'Successful Passes in Defensive Third',
  },
  {
    name: 'totalLongPasses',
    placeholder: 'Total Long Passes',
  },
  {
    name: 'successfulLongPasses',
    placeholder: 'Successful Long Passes',
  },
  {
    name: 'totalMediumPasses',
    placeholder: 'Total Medium Passes',
  },
  {
    name: 'successfulMediumPasses',
    placeholder: 'Successful Medium Passes',
  },
  {
    name: 'totalShortPasses',
    placeholder: 'Total Short Passes',
  },
  {
    name: 'successfulShortPasses',
    placeholder: 'Successful Short Passes',
  },
  {
    name: 'totalForwardPasses',
    placeholder: 'Total Forward Passes',
  },
  {
    name: 'successfulForwardPasses',
    placeholder: 'Successful Forward Passes',
  },
  {
    name: 'totalSidewaysPasses',
    placeholder: 'Total Sideways Passes',
  },
  {
    name: 'successfulSidewaysPasses',
    placeholder: 'Successful Sideways Passes',
  },
  {
    name: 'totalBackwardPasses',
    placeholder: 'Total Backward Passes',
  },
  {
    name: 'successfulBackwardPasses',
    placeholder: 'Successful Backward Passes',
  },
  {
    name: 'totalCrosses',
    placeholder: 'Total Crosses',
  },
  {
    name: 'successfulCrosses',
    placeholder: 'Successful Crosses',
  },
  {
    name: 'totalControlUnderPressure',
    placeholder: 'Total Control Under Pressure',
  },
  {
    name: 'successfulControlUnderPressure',
    placeholder: 'Successful Control Under Pressure',
  },
]

export const DefensiveStatsItems = [
  {
    name: 'totalTackles',
    placeholder: 'Total Tackles',
  },
  {
    name: 'successfulTackles',
    placeholder: 'Successful Tackles',
  },
  {
    name: 'totalAerialDuels',
    placeholder: 'Total Aerial Duels',
  },
  {
    name: 'successfulAerialDuels',
    placeholder: 'Successful Aerial Duels',
  },
  {
    name: 'totalGroundDuels',
    placeholder: 'Total Ground Duels',
  },
  {
    name: 'successfulGroundDuels',
    placeholder: 'Successful Ground Duels',
  },
  {
    name: 'interceptions',
    placeholder: 'Interceptions',
  },
  {
    name: 'clearances',
    placeholder: 'Clearances',
  },
  {
    name: 'recoveries',
    placeholder: 'Recoveries',
  },
  {
    name: 'blocks',
    placeholder: 'Blocks',
  },
  {
    name: 'mistakes',
    placeholder: 'Mistakes',
  },
  {
    name: 'fouls',
    placeholder: 'Fouls',
  },
  {
    name: 'wonFouls',
    placeholder: 'Won Fouls',
  },
  {
    name: 'yellowCards',
    placeholder: 'Yellow Cards',
  },
  {
    name: 'redCards',
    placeholder: 'Red Cards',
  },
]

export const GoalkeeperStatsItems = [
  {
    name: 'goalsConceded',
    placeholder: 'Goals Conceded',
  },
  {
    name: 'catches',
    placeholder: 'Catches',
  },
  {
    name: 'parries',
    placeholder: 'Parries',
  },
  {
    name: 'totalGoalKicks',
    placeholder: 'Total Goal Kicks',
  },
  {
    name: 'successfulGoalKicks',
    placeholder: 'Successful Goal Kicks',
  },
  {
    name: 'totalAerialClearance',
    placeholder: 'Total Aerial Clearance',
  },
  {
    name: 'successfulAerialClearance',
    placeholder: 'Successful Aerial Clearance',
  },
]

export const PhysicalDataItems = [
  {
    name: 'totalDistanceCovered',
    placeholder: 'Total Distance Covered',
  },
  {
    name: 'averageSpeed',
    placeholder: 'Average Speed',
  },
  {
    name: 'maximumSpeed',
    placeholder: 'Maximum Speed',
  },
]

export type DefensiveStatsType = {
  date: string
  opponentName: string
  minutes: string
  tackles: string
  successfulTackles: string
  interception: string
  successfulInterceptions: string
  fouls: string
  clearance: string
  ownGoals: string
  blocks: string
}

export const sampleDefensiveData:DefensiveStatsType[] = [
  {
    date: '2023-01-01',
    opponentName: 'Team A',
    minutes: '90',
    tackles: '5',
    successfulTackles: '4',
    interception: '2',
    successfulInterceptions: '2',
    fouls: '3',
    clearance: '6',
    ownGoals: '0',
    blocks: '1',
  },
  {
    date: '2023-01-10',
    opponentName: 'Team B',
    minutes: '90',
    tackles: '3',
    successfulTackles: '3',
    interception: '1',
    successfulInterceptions: '1',
    fouls: '2',
    clearance: '4',
    ownGoals: '0',
    blocks: '2',
  },
]

export type OffensiveStatsType = {
  date: string
  opponentName: string
  minutes: string
  goals: string
  assists: string
  sonT: string
  sOffT: string
  drb: string
  fouled: string
  disp: string
}

export const sampleOffensiveData:OffensiveStatsType[] = [
  {
    date: '2023-01-05',
    opponentName: 'Team C',
    minutes: '90',
    goals: '2',
    assists: '1',
    sonT: '5',
    sOffT: '3',
    drb: '2',
    fouled: '3',
    disp: '1',
  },
  {
    date: '2023-01-15',
    opponentName: 'Team D',
    minutes: '90',
    goals: '1',
    assists: '2',
    sonT: '3',
    sOffT: '2',
    drb: '3',
    fouled: '2',
    disp: '2',
  },
]
