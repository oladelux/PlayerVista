import { Navigate, Outlet } from 'react-router-dom'

import './Layout.scss'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { routes } from '@/constants/routes.ts'
import { usePaymentSubscription } from '@/hooks/usePaymentSubscription.ts'

import React from 'react'


export function Layout() {
  const { loading, isActive } = usePaymentSubscription()

  if (loading) return <LoadingPage />
  if (!isActive) return <Navigate to={routes.selectPlan} replace />

  return (
    <div className='Layout'>
      <Outlet />
    </div>
  )
}
