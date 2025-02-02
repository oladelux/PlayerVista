import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { setupStore } from './store'
import AuthProvider from '@/AuthProvider.tsx'
import { AuthRequiredWrapper } from '@/AuthRequiredWrapper.tsx'
import { Layout } from '@/component/Layout/Layout.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'
import { routes } from '@/constants/routes.ts'
import { ChangePasswordView } from '@/views/ChangePasswordView/ChangePasswordView.tsx'
import { Dashboard } from '@/views/Dashboard/Dashboard.tsx'
import { EventsView } from '@/views/EventsView/EventsView.tsx'
import { ForgotPassword } from '@/views/ForgotPassword/ForgotPassword.tsx'
import { Home } from '@/views/Home/Home.tsx'
import { Login } from '@/views/Login/Login.tsx'
import { AddPlayer } from '@/views/PlayersView/AddPlayer/AddPlayer.tsx'
import { EditPlayer } from '@/views/PlayersView/EditPlayer/EditPlayer.tsx'
import PlayerStats from '@/views/PlayersView/PlayerStats/PlayerStats.tsx'
import { PlayersView } from '@/views/PlayersView/PlayersView.tsx'
import { SettingsView } from '@/views/SettingsView/SettingsView.tsx'
import { SignUp } from '@/views/SignUp/SignUp.tsx'
import { EventSummary } from '@/views/SingleEventView/EventSummary/EventSummary.tsx'
import { PlayerEventStats } from '@/views/SingleEventView/PlayerEventStats/PlayerEventStats.tsx'
import { SingleEventView } from '@/views/SingleEventView/SingleEventView.tsx'
import { StatisticsView } from '@/views/StatisticsView/StatisticsView.tsx'
import { ManageTeam } from '@/views/Teams/form/ManageTeam.tsx'
import { Teams } from '@/views/Teams/Teams.tsx'
import { CreateTeam, DashboardCreateTeam } from '@/views/TeamView/CreateTeam/CreateTeam.tsx'
import { TeamView } from '@/views/TeamView/TeamView.tsx'
import { AddStaff } from '@/views/UserManagementView/Staffs/AddStaff/AddStaff.tsx'
import { EditStaff } from '@/views/UserManagementView/Staffs/EditStaff/EditStaff.tsx'
import { Staffs } from '@/views/UserManagementView/Staffs/Staffs.tsx'
import './App.scss'

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Home />,
  },
  {
    path: routes.login,
    element: <Login />,
  },
  {
    path: routes.signUp,
    element: <SignUp />,
  },
  {
    path: routes.forgotPassword,
    element: <ForgotPassword />,
  },
  {
    path: routes.changePassword,
    element: <ChangePasswordView />,
  },
  {
    path: '*',
    element: <Navigate replace to={routes.login} />,
  },
  {
    path: '/',
    element: (
      <AuthRequiredWrapper>
        <Layout />
        <Toaster />
      </AuthRequiredWrapper>
    ),
    errorElement: 'error page',
    children: [
      { index: true, element: <TeamView /> },
      { path: routes.dashboard, element: <Dashboard /> },
      { path: routes.teams, element: <Teams /> },
      { path: routes.addTeam, element: <CreateTeam /> },
      { path: routes.dashboardCreateTeam, element: <DashboardCreateTeam /> },
      { path: routes.manageTeam, element: <ManageTeam /> },
      { path: routes.players, element: <PlayersView /> },
      { path: routes.singlePlayer, element: <EditPlayer /> },
      { path: routes.playerStats, element: <PlayerStats /> },
      { path: routes.events, element: <EventsView /> },
      { path: routes.singleEvent, element: <SingleEventView /> },
      { path: routes.statistics, element: <StatisticsView /> },
      { path: routes.playerEventStats, element: <PlayerEventStats /> },
      { path: routes.eventSummary, element: <EventSummary /> },
      { path: routes.staffs, element: <Staffs /> },
      { path: routes.manageStaff, element: <EditStaff /> },
      { path: routes.settings, element: <SettingsView /> },
      { path: routes.addPlayer, element: <AddPlayer /> },
      { path: routes.addStaff, element: <AddStaff /> },
      { path: '*', element: 'error page' },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={setupStore}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </LocalizationProvider>
    </Provider>
  </React.StrictMode>,
)
