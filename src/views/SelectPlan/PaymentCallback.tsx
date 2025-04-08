import { useCallback, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { confirmTransaction, SubscriptionStatus } from '@/api'
import { routes } from '@/constants/routes.ts'
import { getEventsByTeamThunk } from '@/store/slices/EventsSlice.ts'
import { getPlayersByTeamIdThunk } from '@/store/slices/PlayersSlice.ts'
import {
  getRolesByGroupIdThunk,
  setActiveTeamId,
  setUserId,
  setUserRole,
} from '@/store/slices/SettingsSlice.ts'
import { getStaffsThunk } from '@/store/slices/StaffSlice.ts'
import { getTeamThunk } from '@/store/slices/TeamSlice.ts'
import { useAppDispatch } from '@/store/types.ts'
import { setCurrentTeam } from '@/utils/localStorage.ts'

let didInit = false
export default function PaymentCallback() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const confirmTransactionCallback = useCallback(
    async (reference: string) => {
      setLoading(true)
      const userData = JSON.parse(sessionStorage.getItem('userData') || '{}')
      try {
        const response = await confirmTransaction({
          reference,
          userId: userData.id,
        })
        if (response.status === SubscriptionStatus.ACTIVE) {
          if (userData.role === 'admin') {
            navigate(routes.teams)
          } else {
            setCurrentTeam(userData.teamId)
            dispatch(setActiveTeamId({ teamId: userData.teamId }))
            dispatch(setUserRole({ role: userData.role }))
            dispatch(setUserId({ id: userData.id }))
            dispatch(getTeamThunk({ id: userData.teamId }))
            dispatch(getRolesByGroupIdThunk({ groupId: userData.groupId }))
            dispatch(getPlayersByTeamIdThunk({ teamId: userData.teamId }))
            dispatch(getEventsByTeamThunk({ teamId: userData.teamId }))
            dispatch(getStaffsThunk({ groupId: userData.groupId }))
            // dispatch(getReportersThunk({ teamId: userData.teamId }))
            navigate(`/team/${userData.teamId}`)
          }
        } else {
          setError('Payment confirmation failed')
        }
      } catch (e) {
        console.error('Error confirming transaction:', e)
        setError('An unexpected error occurred.')
      } finally {
        setLoading(false)
      }
    },
    [navigate, dispatch],
  )

  useEffect(() => {
    if (!didInit) {
      didInit = true
      const urlParams = new URLSearchParams(window.location.search)
      const reference = urlParams.get('reference')

      if (reference) {
        confirmTransactionCallback(reference)
      }
    }
  }, [confirmTransactionCallback])

  return (
    <div>
      {loading && <p>Processing your payment...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && <p>Redirecting...</p>}
    </div>
  )
}
