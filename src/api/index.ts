import { PlayerPositionType } from '@/views/PlayersView/form/PlayerPosition.ts'

import { getCookie } from '../services/cookies'

const apiURI = import.meta.env.VITE_API_URI
const cloudinaryAPI = import.meta.env.VITE_CLOUDINARY_API
const cloudName = import.meta.env.VITE_CLOUD_NAME

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export class UnauthorizedError extends Error {
  constructor(
    url: string,
    status: number,
    public responseBody: Record<string, unknown>,
  ) {
    super(`Unauthorized request to endpoint ${url}, status ${status}, code ${responseBody.code}`)
  }
}

export class ApiError extends Error {
  constructor(
    url: string,
    status: number,
    public responseBody: string,
  ) {
    super(`bad request to endpoint ${url}, status ${status}, response body ${responseBody}`)
  }
}

/**
 * Error class for API requests resulting in a 4xx status code.
 */
export class ClientError extends Error {
  constructor(
    url: string,
    status: number,
    public responseBody: Record<string, never>,
  ) {
    super(`Erroneous request to endpoint ${url}, status ${status}, code ${responseBody}`)
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
    }).then(apiResponse)
  }

  const res = await fetch(requestURL, {
    method,
    headers: headers,
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
  email: string
  password: string
}

export type RegistrationDetails = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  oldPassword?: string
}

export type SignUpFormData = {
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
  email: string
  firstName: string
  lastName: string
  groupId: string
  teamId: string
  isEmailVerified: boolean
  password: string
  parentUserId: string
  createdAt: string
  updatedAt: string
}

type AuthenticationResult = {
  refreshToken: string
  token: string
  tokenExpires: number
  user: AuthenticatedUserData
}

export type TeamResult = TeamDataBaseResponse & TeamFormData

export type BaseApiResponse = {
  limit: number
  page: number
  totalPages: number
  totalResults: number
  hasNextPage: boolean
}

export type TeamApiResponse = {
  data: TeamResponse[]
}

export type Player = {
  id: string
  teamId: string
  firstName: string
  lastName: string
  teamCaptain: boolean
  email: string
  phoneNumber: string
  uniformNumber: number
  imageSrc: string
  street: string
  city: string
  postCode: string
  country: string
  birthDate: Date
  position: string
  preferredFoot: string
  height: number
  weight: number
  nationality: string
  contactPersonFirstName: string
  contactPersonLastName: string
  contactPersonPhoneNumber: string
  contactPersonStreet: string
  contactPersonCity: string
  contactPersonPostCode: string
  contactPersonCountry: string
}

export type PlayersApiResponse = {
  data: Player[]
}

export type TeamDataResponse = BaseApiResponse & TeamApiResponse
export type PlayerDataResponse = BaseApiResponse & PlayersApiResponse

export type EventFormData = {
  teamId: string
  userId: string
  type: string
  date: Date
  time: string
  matchType?: string
  location?: string
  opponent?: string
  info?: string
}

export type Event = {
  id: string
  team: string
  type: string
  date: Date
  time: string
  matchType?: string
  location?: string
  opponent?: string
  info?: string
  homeScore?: number
  awayScore?: number
}

type EventsApiResponse = {
  data: Event[]
}

type StaffApiResponse = {
  data: Staff[]
}

export type EventDataResponse = BaseApiResponse & EventsApiResponse
export type StaffDataResponse = BaseApiResponse & StaffApiResponse
export type RolesResponse = BaseApiResponse & { data: Roles[] }

export type RoleFormData = {
  name: string
  permissions: string[]
  groupId: string
  createdByUserId: string
}

export type TeamResponse = {
  id: string
  userId: string
  teamName: string
  creationYear: string
  teamGender: string
  logo: string
  ageGroup: string
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
  createdAt: string
  updatedAt: string
}

export type TeamFormData = {
  userId: string
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
  teamId: string
  userId: string
  firstName: string
  lastName: string
  teamCaptain: boolean
  email: string
  phoneNumber: string
  uniformNumber: number
  imageSrc: string
  street?: string
  city?: string
  postCode?: string
  country?: string
  birthDate: string
  height: number
  weight: number
  nationality: string
  preferredFoot: string
  position: PlayerPositionType
  contactPersonFirstName?: string
  contactPersonLastName?: string
  contactPersonPhoneNumber?: string
  contactPersonStreet?: string
  contactPersonCity?: string
  contactPersonPostCode?: string
  contactPersonCountry?: string
}

export type StaffData = {
  firstName: string
  lastName: string
  email: string
  role: string
  groupId: string
  teamId: string
  password: string
  parentUserId: string
}

export type Staff = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  groupId: string
  teamId: string
  isEmailVerified: boolean
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

export type UpdateUserData = {
  firstName: string
  lastName: string
  email: string
  role: string
  groupId: string
  teamId: string
}

export async function register(data: SignUpFormData): Promise<Response> {
  return await apiRequest('/auth/email/register', 'POST', data)
}

export async function updateUser(
  data: Partial<RegistrationDetails>,
): Promise<AuthenticatedUserData> {
  const res = await apiRequest('/auth/me', 'PATCH', data)
  return await res.json()
}

export async function createStaff(data: StaffData): Promise<Response> {
  return await apiRequest('/auth/staff/register', 'POST', data)
}

export async function getStaffs(groupId: string): Promise<StaffDataResponse> {
  const res = await apiRequest(`/users/staffs/${groupId}`, 'GET')
  return await res.json()
}

export async function updateStaff(
  id: string,
  data: Partial<StaffData>,
): Promise<StaffDataResponse> {
  const res = await apiRequest(`/users/${id}`, 'PATCH', data)
  return await res.json()
}

export async function deleteStaff(id: string): Promise<Response> {
  return await apiRequest(`/users/${id}`, 'DELETE')
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
  data: { eventId: string },
  reporterId: string,
): Promise<Reporter> {
  const res = await apiRequest(`/v1/reporter/id/assign/${reporterId}`, 'PATCH', data)
  return await res.json()
}

export async function retractReporter(
  data: { eventId: string },
  reporterId: string,
): Promise<Reporter> {
  const res = await apiRequest(`/v1/reporter/id/retract/${reporterId}`, 'PATCH', data)
  return await res.json()
}

export async function loginAuthentication(
  data: AuthenticationCredentials,
): Promise<AuthenticationResult> {
  const res = await apiRequest('/auth/email/login', 'POST', data)
  return await res.json()
}

export async function confirmEmail(data: { hash: string }): Promise<Response> {
  return await apiRequest('/auth/email/confirm', 'POST', data)
}

export async function forgotPassword(data: { email: string }): Promise<Response> {
  return await apiRequest('/auth/forgot/password', 'POST', data)
}

export function logout() {
  return apiRequest('/auth/logout', 'POST')
}

export function sendEmailVerification() {
  return apiRequest('/v1/auth/send-verification-email', 'POST')
}

export function verifyEmail(token: string) {
  return apiRequest(`/v1/auth/verify-email?token=${token}`, 'POST')
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUserData> {
  const res = await apiRequest('/auth/me', 'GET')
  return await res.json()
}

export type UserDetailsResponse = {
  id: string
  firstName: string
  lastName: string
  email: string
  groupId: string
  isEmailVerified: boolean
  role: string
}

export type Roles = {
  id: string
  groupId: string
  createdByUserId: string
  permissions: PermissionsType
  name: string
}

export type PermissionsType = [
  'create_roles',
  'manage_roles',
  'create_team',
  'manage_teams',
  'create_players',
  'manage_players',
  'create_staffs',
  'manage_staffs',
  'create_event',
  'manage_events',
]

export async function getUserDetails(id: string): Promise<UserDetailsResponse> {
  const res = await apiRequest(`/users/${id}`, 'GET')
  return await res.json()
}

export async function getRolesAndPermissions(groupId: string): Promise<RolesResponse> {
  const res = await apiRequest(`/roles/group/${groupId}`, 'GET')
  return await res.json()
}

export async function updateRolePermissions(
  roleId: string,
  updatedPermissions: string[],
): Promise<Response> {
  const res = await apiRequest(`/roles/${roleId}/permissions`, 'PATCH', { updatedPermissions })
  return await res.json()
}

export async function createRole(data: RoleFormData): Promise<Response> {
  const res = await apiRequest('/roles', 'POST', data)
  return await res.json()
}

export async function createTeam(data: TeamFormData): Promise<Response> {
  const res = await apiRequest('/teams', 'POST', data)
  return await res.json()
}

export async function getTeamsByUser(userId: string): Promise<TeamDataResponse> {
  const res = await apiRequest(`/teams/user/${userId}`, 'GET')
  return await res.json()
}

export async function getTeam(id: string): Promise<TeamResponse> {
  const res = await apiRequest(`/teams/${id}`, 'GET')
  return await res.json()
}

export async function updateTeam(data: Partial<TeamFormData>, teamId: string): Promise<Response> {
  const res = await apiRequest(`/teams/${teamId}`, 'PATCH', data)
  return await res.json()
}

export async function addPlayer(data: PlayerFormData): Promise<Response> {
  const res = await apiRequest('/players', 'POST', data)
  return await res.json()
}

export async function getPlayersByTeamId(
  teamId: string,
  page: number = 1,
  limit: number = 10,
): Promise<PlayerDataResponse> {
  const res = await apiRequest(`/players/team/${teamId}?page=${page}&limit=${limit}`, 'GET')
  return await res.json()
}

export async function getPlayersByUserId(userId: string): Promise<PlayerDataResponse> {
  const res = await apiRequest(`/players/user/${userId}`, 'GET')
  return await res.json()
}

export async function getPlayerById(id: string): Promise<Player> {
  const res = await apiRequest(`/players/${id}`, 'GET')
  return await res.json()
}

export async function updatePlayer(
  data: Partial<PlayerFormData>,
  playerId: string,
): Promise<Response> {
  const res = await apiRequest(`/players/${playerId}`, 'PATCH', data)
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

export async function addEvent(data: EventFormData): Promise<Event> {
  const res = await apiRequest('/events', 'POST', data)
  return await res.json()
}

export async function getEventsByTeamId(teamId: string): Promise<EventDataResponse> {
  const res = await apiRequest(`/events/team/${teamId}`, 'GET')
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
  userId: string
  teamId: string
}

export async function getSingleEvent(eventId: string): Promise<SingleEventType> {
  const res = await apiRequest(`/events/${eventId}`, 'GET')
  return await res.json()
}

export async function updateEvent(data: EventFormData, eventId: string): Promise<Response> {
  const res = await apiRequest(`/events/${eventId}`, 'PATCH', data)
  return await res.json()
}

export type UpdateType = {
  userId: string
  groupId: string
  message: string
}

export async function sendLog(data: UpdateType): Promise<Response> {
  const res = await apiRequest('/activities', 'POST', data)
  return await res.json()
}

export type LogType = {
  userId: string
  message: string
  username: string
  createdAt: Date
}

export type LogApiResponse = {
  data: LogType[]
}

export type LogsResponse = BaseApiResponse & LogApiResponse

export async function getLogs(groupId: string): Promise<LogsResponse> {
  const res = await apiRequest(`/activities/group/${groupId}?page=1&limit=5`, 'GET')
  return await res.json()
}

export enum PlayerActionPeriod {
  FirstHalf = 'first_half',
  SecondHalf = 'second_half',
}

export type Action = {
  period: PlayerActionPeriod
  successful: boolean
}

export type HeatmapEntry = {
  x: number
  y: number
  timestamp: number
}

export type PlayerActions = {
  shots: Action[]
  touches: Action[]
  tackles: Action[]
  goals: Action[]
  passes: Action[]
  assists: Action[]
  interceptions: Action[]
  clearances: Action[]
  blockedShots: Action[]
  aerialDuels: Action[]
  aerialClearance: Action[]
  fouls: Action[]
  saves: Action[]
  mistakes: Action[]
  recoveries: Action[]
  blocks: Action[]
  yellowCard: Action[]
  redCard: Action[]
  offside: Action[]
  cornerKick: Action[]
  freekick: Action[]
  dribbles: Action[]
  penalty: Action[]
  crosses: Action[]
  goalConceded: Action[]
  penaltySaves: Action[]
  freekickSaves: Action[]
  OneVOneSaves: Action[]
}

export type PlayerPerformance = {
  id: string
  eventId: string
  playerId: string
  minutePlayed: number
  heatmap: HeatmapEntry[]
  actions: PlayerActions
  createdAt: Date
  updatedAt: Date
}

export async function getPerformanceByEvent(eventId: string): Promise<PlayerPerformance[]> {
  const res = await apiRequest(`/performance/event/${eventId}`, 'GET')
  return await res.json()
}

export async function getPerformanceByEventAndPlayer(
  eventId: string,
  playerId: string,
): Promise<PlayerPerformance> {
  const res = await apiRequest(`/performance/event/${eventId}/player/${playerId}`, 'GET')
  return await res.json()
}

type PlayerPerformanceApiResponse = {
  data: PlayerPerformance[]
}

export type PlayerPerformanceResponse = BaseApiResponse & PlayerPerformanceApiResponse

export async function getPerformancesForPlayer(
  playerId: string,
): Promise<PlayerPerformanceResponse> {
  const res = await apiRequest(`/performance/player/${playerId}`, 'GET')
  return await res.json()
}

export async function generatePDF(data: { html: string }): Promise<Response> {
  return await apiRequest('/pdf-rendering/generate', 'POST', data)
}

type SubscribeData = {
  subscriptionPlan: SubscriptionPlan
  planPeriod: SubscriptionFrequencyType
}

export enum SubscriptionPlan {
  STARTER = 'starter',
  PRO = 'pro',
}

export enum SubscriptionFrequencyType {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

/*export const planCodes: Record<SubscriptionPlan, string> = {
  [SubscriptionPlan.STARTER_MONTHLY]: 'PLN_zpu4ypdq1mfln04',
  [SubscriptionPlan.STARTER_ANNUAL]: 'PLN_w0izup1tjq0vrni',
  [SubscriptionPlan.PRO_MONTHLY]: 'PLN_tp7tsmies8bu8dn',
  [SubscriptionPlan.PRO_ANNUAL]: 'PLN_ktuhzv85e8l0qdb',
}*/

type SubscriptionResponse = {
  redirectUrl: string
  redirect: boolean
}
export async function selectSubscription(data: SubscribeData): Promise<SubscriptionResponse> {
  const res = await apiRequest('/auth/choose-subscription', 'POST', data)
  return await res.json()
}

type SubscriptionVerification = {
  reference: string
  userId: string
}

export enum SubscriptionPlanType {
  STARTER = 'starter',
  PRO = 'pro',
}

export enum SubscriptionType {
  TRIAL = 'trial',
  PAID = 'paid',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
}

export interface TeamSubscription {
  id: string
  parentTeamId: string
  userId: string
  subscriptionPlan: SubscriptionPlanType
  subscriptionType: SubscriptionType
  status: SubscriptionStatus
  paystackCustomerId: string
  subscriptionId: string
  trialStart: Date | null
  trialEnd: Date | null
  subscriptionEnd: Date | null
  createdAt: Date
  updatedAt: Date
}

export async function confirmTransaction(
  data: SubscriptionVerification,
): Promise<TeamSubscription> {
  const res = await apiRequest('/checkout/verify', 'POST', data)
  return await res.json()
}

export interface Subscription {
  id: string
  userId: string
  subscriptionPlan: SubscriptionPlanType
  subscriptionType: SubscriptionType
  status: SubscriptionStatus
  paystackCustomerId: string
  subscriptionId: string
  subscriptionEnd: Date
  trialStart: Date | null
  trialEnd: Date | null
}
export async function getSubscription(): Promise<Subscription> {
  const res = await apiRequest('/subscription/user/me', 'GET')
  return await res.json()
}
