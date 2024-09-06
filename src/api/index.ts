import { getCookie } from '../services/cookies'

const apiURI = import.meta.env.VITE_API_URI
const cloudinaryAPI = import.meta.env.VITE_CLOUDINARY_API
const cloudName = import.meta.env.VITE_CLOUD_NAME

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export class UnauthorizedError extends Error {
  constructor (url: string, status: number, public responseBody: Record<string, unknown>) {
    super(`Unauthorized request to endpoint ${url}, status ${status}, code ${responseBody.code}`)
  }
}

export class ApiError extends Error {
  constructor(url: string, status: number, public responseBody: string) {
    super(
      `bad request to endpoint ${url}, status ${status}, response body ${responseBody}`,
    )
  }
}

/**
 * Error class for API requests resulting in a 4xx status code.
 */
export class ClientError extends Error {
  constructor (url: string, status: number, public responseBody: Record<string, never>) {
    super(`Erroneous request to endpoint ${url}, status ${status}, code ${responseBody.code}`)
  }
}

async function apiResponse(res: Response) {
  const isResponseJson = res.headers.get('content-type')?.includes('application/json')
  if (res.status === 401) {
    const responseBody = isResponseJson ? await res.json() : { code: 'UNKNOWN' }
    throw new UnauthorizedError(res.url, res.status, responseBody)
  } else if (res.status >= 400 && res.status < 500) {
    const responseBody = isResponseJson ? await res.json() : { code: 'UNKNOWN' }
    throw new ClientError(res.url, res.status, responseBody)
  } else if (res.status >= 500) {
    throw new ApiError(res.url, res.status, await res.text())
  } else {
    return res
  }
}

const apiRequest = async (
  endpoint: string,
  method: Method,
  data: object = {},
): Promise<Response> => {
  const requestURL = apiURI + endpoint
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const accessToken = getCookie('access-token')
  if (accessToken) {
    headers.append('Authorization', `Bearer ${accessToken}`)
  }

  if (method === 'GET') {
    return fetch(requestURL, {
      headers: headers,
      credentials: 'include',
    }).then(apiResponse)
  }

  const res = await fetch(requestURL, {
    method,
    headers: headers,
    credentials: 'include',
    body: JSON.stringify(data),
  })

  return apiResponse(res)
}

const senRequestToCloudinary = async (endpoint: string, data: object = {}): Promise<Response> => {
  const url = cloudinaryAPI + endpoint
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  }).then(apiResponse)
}

export type AuthenticationCredentials = {
  email: string,
  password: string
}

export type RegistrationDetails = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}

export type UserRegistration = {
  id: string
  role: string
  isEmailVerified: boolean
  name: string
  email: string
}

export type RegistrationResponse = {
  user: UserRegistration
  tokens: TokensData
}

export type AuthRefreshToken = {
  refreshToken: string
}

type AccessTokenData = {
  token: string
  expires: string
}

type TokensData = {
  access: AccessTokenData
  refresh: AccessTokenData
}

export type AuthenticatedUserData = {
  id: string
  role: string
  name: string
  email: string
  firstName: string
  lastName: string
  groupId: string
  teams: string[]
  isEmailVerified: boolean
}

type AuthenticationResult = {
  user: AuthenticatedUserData
  tokens: TokensData
}

export type TeamResult = TeamDataBaseResponse & TeamFormData

export type BaseApiResponse = {
  limit: number
  page: number
  totalPages: number
  totalResults: number
}

export type TeamApiResponse = {
  results: TeamResult[]
}

export type Player = {
  id: string
  team: string
  firstName: string
  lastName: string
  teamCaptain: boolean
  email: string
  phoneNumber: string
  uniformNumber: string
  imageSrc: string
  street: string
  city: string
  postCode: string
  country: string
  birthDate: Date
  position: string
  contactPersonFirstName: string
  contactPersonLastName: string
  contactPersonPhoneNumber: string
  contactPersonStreet: string
  contactPersonCity: string
  contactPersonPostCode: string
  contactPersonCountry: string
}

export type PlayersApiResponse = {
  results: Player[]
}

export type TeamDataResponse = BaseApiResponse & TeamApiResponse
export type PlayerDataResponse = BaseApiResponse & PlayersApiResponse

export type TeamFormData = {
  teamName: string
  creationYear: string
  teamGender: string
  ageGroup: string
  logo: string
  headCoach: string
  headCoachContact: string
  assistantCoach: string
  assistantCoachContact: string
  medicalPersonnel: string
  medicalPersonnelContact: string
  kitManager: string
  kitManagerContact: string
  mediaManager: string
  mediaManagerContact: string
  logisticsCoordinator: string
  logisticsCoordinatorContact: string
  stadiumName: string
  street: string
  postcode: string
  city: string
  country: string
}

export type PlayerFormData = {
  firstName: string
  lastName: string
  teamCaptain: boolean
  email: string
  phoneNumber: string
  uniformNumber: string
  imageSrc: string
  street: string
  city: string
  postCode: string
  country: string
  birthDate: Date
  position: string
  contactPersonFirstName: string
  contactPersonLastName: string
  contactPersonPhoneNumber: string
  contactPersonStreet: string
  contactPersonCity: string
  contactPersonPostCode: string
  contactPersonCountry: string
}

export type StaffData = {
  firstName: string
  lastName: string
  email: string
  role: string
  groupId: string
  password: string
  teams: string[]
}

export type Staff = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  groupId: string
  isEmailVerified: boolean
  teams: string[]
}

export type ReporterData = {
  firstName: string
  lastName: string
  email: string
  role: string
  groupId: string
  password: string
  teams: string[]
  eventId?: string
}

export type Reporter = Staff & {
  eventId: string
}

export type TeamDataBaseResponse = {
  id: string
  active: boolean
  players: string[]
}

export type Fixtures = {
  homeTeam: string
  awayTeam: string
  homeScore: string
  awayScore: string
  homeLogo: string
  awayLogo: string
}

export async function register(data: RegistrationDetails): Promise<RegistrationResponse> {
  const res = await apiRequest('/v1/auth/register', 'POST', data)
  return await res.json()
}

export async function createStaff(data: StaffData): Promise<Staff> {
  const res = await apiRequest('/v1/user', 'POST', data)
  return await res.json()
}

export async function getStaffs(teamId: string): Promise<Staff[]> {
  const res = await apiRequest(`/v1/user/staffs/${teamId}`, 'GET')
  return await res.json()
}

export async function createReporter(data: ReporterData): Promise<Reporter> {
  const res = await apiRequest('/v1/reporter', 'POST', data)
  return await res.json()
}

export async function getReporters(teamId: string): Promise<Reporter[]> {
  const res = await apiRequest(`/v1/reporter/team/${teamId}`, 'GET')
  return await res.json()
}

export async function assignReporter(
  data: { eventId: string }, reporterId: string): Promise<Reporter> {
  const res = await apiRequest(`/v1/reporter/id/assign/${reporterId}`, 'PATCH', data)
  return await res.json()
}

export async function retractReporter(
  data: { eventId: string }, reporterId: string): Promise<Reporter> {
  const res = await apiRequest(`/v1/reporter/id/retract/${reporterId}`, 'PATCH', data)
  return await res.json()
}

export async function loginAuthentication(data: AuthenticationCredentials):
  Promise<AuthenticationResult> {
  const res = await apiRequest('/v1/auth/login', 'POST', data)
  return await res.json()
}

export function logout(data: AuthRefreshToken) {
  return apiRequest('/v1/auth/logout', 'POST', data)
}

export function sendEmailVerification() {
  return apiRequest('/v1/auth/send-verification-email', 'POST')
}

export function verifyEmail(token: string) {
  return apiRequest(`/v1/auth/verify-email?token=${token}`, 'POST')
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUserData> {
  const res = await apiRequest('/v1/user/data', 'GET')
  return await res.json()
}

type UserDetailsResponse = {
  id: string
  firstName: string
  lastName: string
  email: string
  teams: string[]
  isEmailVerified: boolean
  role: string
}

export async function getUserDetails(id: string): Promise<UserDetailsResponse> {
  const res = await apiRequest(`/v1/user/id/${id}`, 'GET')
  return await res.json()
}

export async function createTeam(data: TeamFormData): Promise<Response> {
  const res = await apiRequest('/v1/team', 'POST', data)
  return await res.json()
}

export async function getTeams(): Promise<TeamDataResponse> {
  const res = await apiRequest('/v1/team', 'GET')
  return await res.json()
}

export async function addPlayer(data: PlayerFormData, teamId: string): Promise<Response> {
  const res = await apiRequest(`/v1/player?teamId=${teamId}`, 'POST', data)
  return await res.json()
}

export async function getPlayers(teamId: string): Promise<PlayerDataResponse> {
  const res = await apiRequest(`/v1/player?teamId=${teamId}`, 'GET')
  return await res.json()
}

export async function updatePlayer(data: PlayerFormData, playerId: string): Promise<Response> {
  const res = await apiRequest(`/v1/player/id/${playerId}`, 'PATCH', data)
  return await res.json()
}

type PlayerImage = {
  folder: string
  file: string
  cloud_name: string
  upload_preset: string
}

export async function uploadImageToCloudinary(data: PlayerImage): Promise<Response> {
  const res = await senRequestToCloudinary(`/v1_1/${cloudName}/image/upload`, data)
  return await res.json()
}

export type EventFormData = {
  type: string,
  startDate: Date
  eventLocation?: string
  location?: string
  opponent?: string
  info?: string
}

export type Event = {
  id: string
  team: string
  type: string
  startDate: Date
  endDate: Date
  eventLocation: string
  location: string
  opponent: string
  info: string
}

type EventsApiResponse = {
  results: Event[]
}

export type EventDataResponse = BaseApiResponse & EventsApiResponse

export async function addEvent(data: EventFormData, teamId: string): Promise<Event> {
  const res = await apiRequest(`/v1/event?teamId=${teamId}`, 'POST', data)
  return await res.json()
}

export async function getEvents(teamId: string): Promise<EventDataResponse> {
  const res = await apiRequest(`/v1/event?teamId=${teamId}`, 'GET')
  return await res.json()
}

export type SingleEventType = {
  type: string
  startDate: string
  endDate: string
  location: string
  eventLocation: string
  opponent: string
  info: string
  team: string
  id: string
}

export async function getSingleEvent(eventId: string): Promise<SingleEventType> {
  const res = await apiRequest(`/v1/event/id/${eventId}`, 'GET')
  return await res.json()
}

export async function updateEvent(data: EventFormData, eventId: string): Promise<Response> {
  const res = await apiRequest(`/v1/event/id/${eventId}`, 'PATCH', data)
  return await res.json()
}

export type UpdateType = {
  userId: string
  groupId: string
  message: string
  date?: Date
}

export async function sendLog(data: UpdateType): Promise<Response> {
  const res = await apiRequest('/v1/log', 'POST', data)
  return await res.json()
}

export type LogType = {
  userId: string
  message: string
  date: Date
}

export type LogApiResponse = {
  results: LogType
}

export type LogsResponse = BaseApiResponse & LogApiResponse

export async function getLogs(groupId: string): Promise<LogsResponse> {
  const res = await apiRequest(`/v1/log?groupId=${groupId}`, 'GET')
  return await res.json()
}

export type Action = {
  type?: string
  x: number
  y: number
  value?: string
  timestamp: number
}

type HeatmapEntry = {
  x: number
  y: number
  timestamp: number
}

export type PlayerActions = {
  shots: Action[]
  tackles: Action[]
  goals: Action[]
  pass: Action[]
  assists: Action[]
  interceptions: Action[]
  clearance: Action[]
  blocked_shots: Action[]
  aerial_duels: Action[]
  aerial_clearance: Action[]
  fouls: Action[]
  saves: Action[]
  mistakes: Action[]
  recoveries: Action[]
  blocks: Action[]
  yellow_cards: Action[]
  red_cards: Action[]
  offside: Action[]
  corner_kick: Action[]
  freekick: Action[]
  dribble: Action[]
  penalty: Action[]
}

export type PlayerPerformance = {
  eventId: string
  playerId: string
  jerseyNumber: number
  firstName: string
  lastName: string
  position: string
  minutePlayed: number
  heatmap: HeatmapEntry[]
  actions: PlayerActions
}

export async function getPerformanceData(eventId: string): Promise<PlayerPerformance[]> {
  const res = await apiRequest(`/v1/performance/${eventId}`, 'GET')
  return await res.json()
}
