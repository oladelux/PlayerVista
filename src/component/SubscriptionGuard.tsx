import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { getSubscription, SubscriptionStatus } from '@/api'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { routes } from '@/constants/routes.ts'
import { useUser } from '@/hooks/useUser.ts'
import { appService } from '@/singletons'

let didInit = false

interface SubscriptionGuardProps {
  children?: React.ReactNode
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const [loading, setLoading] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const userId = appService.getUserId()
  const { initializeApp } = useUser()

  useEffect(() => {
    if (!didInit) {
      didInit = true
      initializeApp()
        .then(async data => {
          if (data) {
            appService.setUserId(data.id)
            appService.setUserData(data)
          }
        })
    }
  })

  useEffect(() => {
    const checkSubscription = async (userId: string) => {
      try {
        const { status } = await getSubscription(userId)
        setIsActive(status === SubscriptionStatus.ACTIVE)
      } catch {
        setIsActive(false)
      } finally {
        setLoading(false)
      }
    }
    if(userId) checkSubscription(userId)
  }, [userId])

  if (loading) return <LoadingPage />
  if (!isActive) return <Navigate to={routes.selectPlan} replace />
  if (!userId) return <Navigate to={routes.login} replace />

  return (
    <>
      {children}
      <Outlet />
    </>
  )
}
