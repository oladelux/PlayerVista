import { BrowserRouter, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { AppRoutes } from './AppRoutes'
import Layout from './component/Layout/Layout'
import { Toaster } from '@/components/ui/toaster.tsx'

import './App.scss'
import React from 'react'

import { routes } from '@/constants/routes.ts'
import { Dashboard } from '@/views/Dashboard/Dashboard.tsx'
import { TeamView } from '@/views/TeamView/TeamView.tsx'

const router = createBrowserRouter([
  {
    path: routes.teams,
    element: (
      <Layout>
        <Toaster />
      </Layout>
    ),
    children: [
      { index: true, element: <TeamView /> },
      /*{ path: routes.dashboard, element: <Dashboard /> },*/
    ],
  },
])

export const App = () => {
  return (
    <Layout>
      <AppRoutes />
      <RouterProvider router={router} />
      <Toaster />
    </Layout>
  )
}
