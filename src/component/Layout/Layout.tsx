import { Navigate, Outlet, useLocation } from 'react-router-dom'

import './Layout.scss'
import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import { routes } from '@/constants/routes.ts'
import { usePaymentSubscription } from '@/hooks/usePaymentSubscription.ts'


export function Layout() {
  const { loading, isActive } = usePaymentSubscription()
  const { pathname } = useLocation()
  const excludePaths = ['/']
  const shouldNotRenderDashboardLayout = excludePaths.includes(pathname)

  if (loading) return <LoadingPage message='check seb' />
  if (!isActive) return <Navigate to={routes.selectPlan} replace />

  if(shouldNotRenderDashboardLayout) {
    return (
      <div className='Layout'>
        <Outlet />
      </div>
    )
  }

  return (
    <div className='Layout'>
      <DashboardLayout />
    </div>
  )
}
