import { StrictMode } from 'react'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import * as ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import AuthProvider from '@/AuthProvider.tsx'
import { AuthRequiredWrapper } from '@/AuthRequiredWrapper.tsx'
import { Layout } from '@/component/Layout/Layout.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'
import { routes } from '@/constants/routes.ts'
import { ChangePasswordView } from '@/views/ChangePasswordView/ChangePasswordView.tsx'
import { Dashboard } from '@/views/Dashboard/Dashboard.tsx'
import { EventsView } from '@/views/EventsView/EventsView.tsx'
import { ForgotPassword } from '@/views/ForgotPassword/ForgotPassword.tsx'
import { Login } from '@/views/Login/Login.tsx'
import { ManageTeam } from '@/views/ManageTeams/form/ManageTeam.tsx'
import { ManageTeams } from '@/views/ManageTeams/ManageTeams.tsx'
import { AddPlayer } from '@/views/PlayersView/AddPlayer/AddPlayer.tsx'
import { EditPlayer } from '@/views/PlayersView/EditPlayer/EditPlayer.tsx'
import { PlayersView } from '@/views/PlayersView/PlayersView.tsx'
import SelectPlan from '@/views/SelectPlan/SelectPlan.tsx'
import { SettingsView } from '@/views/SettingsView/SettingsView.tsx'
import { SignUp } from '@/views/SignUp/SignUp.tsx'
import { CreateTeam } from '@/views/TeamView/CreateTeam/CreateTeam.tsx'
import { DashboardCreateTeam } from '@/views/TeamView/CreateTeam/DashboardCreateTeam.tsx'
import { TeamView } from '@/views/TeamView/TeamView.tsx'
import { AddStaff } from '@/views/UserManagementView/Staffs/AddStaff/AddStaff.tsx'
import { EditStaff } from '@/views/UserManagementView/Staffs/EditStaff/EditStaff.tsx'
import { Staffs } from '@/views/UserManagementView/Staffs/Staffs.tsx'

import './App.scss'
import { setupStore } from './store'
import { ActivityView } from './views/ActivityView/ActivityView'
import { NotFound } from './views/NotFound'
import { PlayerStats } from './views/PlayersView/PlayerStats/PlayerStats'
import { TeamStats } from './views/TeamStats/TeamStats'

const router = createBrowserRouter([
  {
    path: routes.login,
    element: <Login />,
  },
  {
    path: routes.signUp,
    element: <SignUp />,
  },
  {
    path: routes.selectPlan,
    element: <SelectPlan />,
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
    errorElement: <NotFound />,
    children: [
      { index: true, element: <TeamView /> },
      { path: routes.dashboard, element: <Dashboard /> },
      { path: routes.manageTeams, element: <ManageTeams /> },
      { path: routes.addTeam, element: <CreateTeam /> },
      { path: routes.dashboardCreateTeam, element: <DashboardCreateTeam /> },
      { path: routes.manageTeam, element: <ManageTeam /> },
      { path: routes.players, element: <PlayersView /> },
      { path: routes.managePlayer, element: <EditPlayer /> },
      { path: routes.playerStats, element: <PlayerStats /> },
      { path: routes.teamStats, element: <TeamStats /> },
      { path: routes.events, element: <EventsView /> },
      { path: routes.staffs, element: <Staffs /> },
      { path: routes.manageStaff, element: <EditStaff /> },
      { path: routes.settings, element: <SettingsView /> },
      { path: routes.addPlayer, element: <AddPlayer /> },
      { path: routes.addStaff, element: <AddStaff /> },
      { path: routes.activity, element: <ActivityView /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={setupStore}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </LocalizationProvider>
    </Provider>
  </StrictMode>,
)
