import { FC } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { DashboardLayout } from './component/DashboardLayout/DashboardLayout.tsx'
import { routes } from './constants/routes'
import { useAppController } from './hooks/useAppController'
import { getCookie } from './services/cookies'
import { ChangePasswordView } from './views/ChangePasswordView/ChangePasswordView'
import { Dashboard } from './views/Dashboard/Dashboard'
import { EmailVerification } from './views/EmailVerification/EmailVerification.tsx'
import { EventsView } from './views/EventsView/EventsView'
import { ForgotPassword } from './views/ForgotPassword/ForgotPassword'
import { Home } from './views/Home/Home'
import { Login } from './views/Login/Login'
import { MyAccount } from './views/MyAccount/MyAccount'
import { AddPlayer } from './views/PlayersView/AddPlayer/AddPlayer'
import { EditPlayer } from './views/PlayersView/EditPlayer/EditPlayer.tsx'
import { PlayersView } from './views/PlayersView/PlayersView'
import { AddReporter } from './views/ReportersView/AddReporter/AddReporter.tsx'
import { ReportersView } from './views/ReportersView/ReportersView.tsx'
import { SignUp } from './views/SignUp/SignUp'
import { EventSummary } from './views/SingleEventView/EventSummary/EventSummary.tsx'
import { SingleEventView } from './views/SingleEventView/SingleEventView.tsx'
import { StatisticsView } from './views/StatisticsView/StatisticsView.tsx'
import {
  CreateTeam,
  DashboardCreateTeam,
} from './views/TeamView/CreateTeam/CreateTeam'
import { TeamView } from './views/TeamView/TeamView'
import { TrainingData } from './views/TrainingData/TrainingData'
import { AddStaff } from './views/UserManagementView/Staffs/AddStaff/AddStaff.tsx'
import { Staffs } from './views/UserManagementView/Staffs/Staffs'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import SubscriptionGuard from '@/component/SubscriptionGuard.tsx'
import PlayerStats from '@/views/PlayersView/PlayerStats/PlayerStats.tsx'
import PaymentCallback from '@/views/SelectPlan/PaymentCallback.tsx'
import SelectPlan from '@/views/SelectPlan/SelectPlan.tsx'
import { SettingsView } from '@/views/SettingsView/SettingsView.tsx'
import { PlayerEventStats } from '@/views/SingleEventView/PlayerEventStats/PlayerEventStats.tsx'
import { ManageTeam } from '@/views/Teams/form/ManageTeam.tsx'
import { Teams } from '@/views/Teams/Teams.tsx'
import { EditStaff } from '@/views/UserManagementView/Staffs/EditStaff/EditStaff.tsx'

export const AppRoutes: FC = () => {
  const controller = useAppController()

  const { user, players, events, logger, teams, staffs } = controller
  const accessToken = getCookie('access-token')

  if (user.data === undefined && accessToken) {
    return <LoadingPage message='Playervista is Loading' />
  }

  if (!user.data) {
    return (
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route
          path={routes.login}
          element={<Login />}
        />
        <Route
          path={routes.signUp}
          element={<SignUp />}
        />
        <Route path={routes.forgotPassword} element={<ForgotPassword />} />
        <Route
          path={routes.changePassword}
          element={<ChangePasswordView />}
        />
        <Route path='*' element={<Navigate replace to={routes.login} />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route
        path={routes.paymentCallback} element={<PaymentCallback />}
      />
      <Route path={routes.selectPlan} element={<SelectPlan teams={controller.teams} />} />
      <Route path={routes.home} element={<Home />} />
      <Route element={<SubscriptionGuard />}>
        <Route
          path={routes.team}
          element={
            <TeamView />}
        />
        <Route
          path={routes.addTeam}
          element={
            <CreateTeam />
          }
        />
        <Route
          path={routes.dashboardCreateTeam}
          element={
            <DashboardLayout>
              <DashboardCreateTeam />
            </DashboardLayout>
          }
        />
        <Route
          path={routes.dashboard}
          element={
            <Dashboard />
          }
        />
        <Route
          path={routes.teams}
          element={<Teams />}
        />
        <Route
          path={routes.players}
          element={<PlayersView />}
        />
        <Route
          path={routes.addPlayer}
          element={<AddPlayer />}
        />
        <Route
          path={routes.statistics}
          element={<StatisticsView />}
        />
        <Route
          path={routes.settings}
          element={<SettingsView />}
        />
        <Route path={routes.singlePlayer} element={<EditPlayer />} />
        <Route
          path={routes.staffs}
          element={<Staffs />}
        />
        <Route
          path={routes.addStaff}
          element={<AddStaff />}
        />
        <Route path={routes.manageStaff} element={<EditStaff />} />
        <Route
          path={routes.addReporter}
          element={<AddReporter user={user.data} logger={logger} />}
        />
        <Route
          path={routes.reporters}
          element={
            <ReportersView
              user={user.data}
              reporters={[]}
              teams={teams}
            />
          }
        />
        <Route path={routes.trainingData} element={<TrainingData />} />
        <Route
          path={routes.events}
          element={<EventsView />}
        />
        <Route
          path={routes.singleEvent}
          element={<SingleEventView />}
        />
        <Route
          path={routes.eventSummary}
          element={
            <EventSummary />
          }
        />
        <Route
          path={routes.playerStats}
          element={<PlayerStats />}
        />
        <Route
          path={routes.playerEventStats}
          element={
            <PlayerEventStats />
          }
        />
        <Route path={routes.manageTeam} element={<ManageTeam />} />
        <Route path={routes.account} element={<MyAccount />} />
      </Route>
      <Route path={routes.logout} element={<MyAccount />} />
      <Route
        path={routes.emailVerification}
        element={
          <EmailVerification teams={teams} user={user.data} userHook={user} />
        }
      />
      <Route
        path={routes.login}
        element={<Login />}
      />
      <Route path={routes.forgotPassword} element={<ForgotPassword />} />
    </Routes>
  )
}
