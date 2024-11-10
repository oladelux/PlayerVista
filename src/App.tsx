import { BrowserRouter } from 'react-router-dom'

import Layout from './component/Layout/Layout'
import { AppRoutes } from './AppRoutes'
import { Toaster } from '@/components/ui/toaster.tsx'

import './App.scss'
import React from 'react'

export const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
        <Toaster />
      </Layout>
    </BrowserRouter>
  )
}
