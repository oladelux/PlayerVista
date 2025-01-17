import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getSubscription, SubscriptionStatus } from '@/api'
import { routes } from '@/constants/routes.ts'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { useSelector } from 'react-redux'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'

export default function SubscriptionGuard() {
  const [loading, setLoading] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const { userId } = useSelector(settingsSelector)

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { status } = await getSubscription(userId)
        setIsActive(status === SubscriptionStatus.ACTIVE)
      } catch {
        setIsActive(false)
      } finally {
        setLoading(false)
      }
    }
    if(userId) checkSubscription()
  }, [userId])

  if (loading) return <LoadingPage />
  if (!isActive) return <Navigate to={routes.selectPlan} replace />

  return <Outlet />
}
