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
    body: JSON.stringify(data)
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

type UserRegistration = {
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

export type TeamPlayer = {
  id: string
  name: string
  age: string
  position: string
  jerseyNumber: string
  status: boolean
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

export async function loginAuthentication(data: AuthenticationCredentials):
  Promise<AuthenticationResult> {
  const res = await apiRequest('/v1/auth/login', 'POST', data)
  return await res.json()
}

export function logout(data: AuthRefreshToken) {
  return apiRequest('/v1/auth/logout', 'POST', data)
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUserData> {
  const res = await apiRequest('/v1/user/data', 'GET')
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
