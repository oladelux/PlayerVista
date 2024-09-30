import {BrowserRouter} from 'react-router-dom'

import Layout from './component/Layout/Layout'
import { AppRoutes } from './AppRoutes'

import './App.scss'

export const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  )
}
