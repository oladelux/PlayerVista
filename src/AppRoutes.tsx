import { FC } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { routes } from './constants/routes'
import { useAppController } from './hooks/useAppController'
import { getCookie } from './services/cookies'

import { Home } from './views/Home/Home'
import { Login } from './views/Login/Login'
import { Dashboard } from './views/Dashboard/Dashboard'
import { PlayersView } from './views/PlayersView/PlayersView'
import { SinglePlayerView } from './views/SinglePlayerView/SinglePlayerView'
import { TrainingData } from './views/TrainingData/TrainingData'
import { EventsView } from './views/EventsView/EventsView'
import { MyAccount } from './views/MyAccount/MyAccount'
import { AddPlayer } from './views/PlayersView/AddPlayer/AddPlayer'
import { SignUp } from './views/SignUp/SignUp'
import { ForgotPassword } from './views/ForgotPassword/ForgotPassword'
import { ChangePasswordView } from './views/ChangePasswordView/ChangePasswordView'
import { TeamView } from './views/TeamView/TeamView'
import {
  CreateTeam,
  DashboardCreateTeam,
} from './views/TeamView/CreateTeam/CreateTeam'
import { Staffs } from './views/UserManagementView/Staffs/Staffs'
import { DashboardLayout } from './component/DashboardLayout/DashboardLayout.tsx'
import { SingleEventView } from './views/SingleEventView/SingleEventView.tsx'
import { EventSummary } from './views/SingleEventView/EventSummary/EventSummary.tsx'
import { AddStaff } from './views/UserManagementView/Staffs/AddStaff/AddStaff.tsx'
import { EmailVerification } from './views/EmailVerification/EmailVerification.tsx'
import { ReportersView } from './views/ReportersView/ReportersView.tsx'
import { AddReporter } from './views/ReportersView/AddReporter/AddReporter.tsx'
import { StatisticsView } from './views/StatisticsView/StatisticsView.tsx'
import { PlayerEventStats } from '@/views/SingleEventView/PlayerEventStats/PlayerEventStats.tsx'
import { SettingsView } from '@/views/SettingsView/SettingsView.tsx'
import PlayerStats from '@/views/PlayersView/PlayerStats/PlayerStats.tsx'
import SelectPlan from '@/views/SelectPlan/SelectPlan.tsx'
import PaymentCallback from '@/views/SelectPlan/PaymentCallback.tsx'
import { Teams } from '@/views/Teams/Teams.tsx'
import { ManageTeam } from '@/views/Teams/form/ManageTeam.tsx'
import { EditStaff } from '@/views/UserManagementView/Staffs/EditStaff/EditStaff.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import SubscriptionGuard from '@/component/SubscriptionGuard.tsx'

export const AppRoutes: FC = () => {
  const controller = useAppController()

  const { user, players, events, logger, logs, teams, staffs } = controller
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
          element={<Login controller={controller} />}
        />
        <Route
          path={routes.signUp}
          element={<SignUp controller={controller} />}
        />
        <Route path={routes.forgotPassword} element={<ForgotPassword controller={controller} />} />
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
            <TeamView teams={controller.teams} user={user.data} />}
        />
        <Route
          path={routes.createTeam}
          element={
            <CreateTeam user={user.data} logger={logger} teams={teams} />
          }
        />
        <Route
          path={routes.dashboardCreateTeam}
          element={
            <DashboardLayout>
              <DashboardCreateTeam
                user={user.data}
                logger={logger}
                teams={teams}
              />
            </DashboardLayout>
          }
        />
        <Route
          path={routes.dashboard}
          element={
            <Dashboard
              teams={controller.teams}
              applicationLogs={logs}
              user={user.data}
              authentication={controller.authentication}
            />
          }
        />
        <Route
          path={routes.teams}
          element={<Teams teams={controller.teams}
            team={controller.singleTeam} players={controller.allPlayers} />}
        />
        <Route
          path={routes.players}
          element={<PlayersView players={players} />}
        />
        <Route
          path={routes.addPlayer}
          element={<AddPlayer user={user.data} logger={logger} />}
        />
        <Route
          path={routes.statistics}
          element={<StatisticsView teamEvent={events.getTeamEvent} />}
        />
        <Route
          path={routes.settings}
          element={<SettingsView user={user.data} logger={logger} />}
        />
        <Route path={routes.singlePlayer} element={<SinglePlayerView />} />
        <Route
          path={routes.staffs}
          element={<Staffs staffs={staffs} user={user.data} logger={logger} />}
        />
        <Route
          path={routes.addStaff}
          element={<AddStaff user={user.data} logger={logger} />}
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
          element={<EventsView user={user.data} logger={logger} />}
        />
        <Route
          path={routes.singleEvent}
          element={<SingleEventView events={events} teams={teams} />}
        />
        <Route
          path={routes.eventSummary}
          element={
            <EventSummary players={players} events={events} teams={teams} />
          }
        />
        <Route
          path={routes.playerStats}
          element={<PlayerStats />}
        />
        <Route
          path={routes.playerEventStats}
          element={
            <PlayerEventStats events={events} teams={teams} />
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
        element={<Login controller={controller} />}
      />
      <Route path={routes.forgotPassword} element={<ForgotPassword controller={controller} />} />
    </Routes>
  )
}
