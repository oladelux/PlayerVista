import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import ProfileForm from '@/views/SettingsView/ProfileForm.tsx'
import { AuthenticatedUserData } from '@/api'
import ChangePasswordForm from '@/views/SettingsView/ChangePasswordForm.tsx'
import RolesView from '@/views/SettingsView/RolesView.tsx'
import { useSelector } from 'react-redux'
import { settingsSelector } from '@/store/slices/SettingsSlice.ts'
import CreateNewRoleDialog from '@/views/SettingsView/dialog/CreateNewRoleDialog.tsx'
import { UseUpdates } from '@/hooks/useUpdates.ts'
import { usePermission } from '@/hooks/usePermission.ts'

type SettingsViewProps = {
  user: AuthenticatedUserData
  logger: UseUpdates
}
export const SettingsView = ({ user, logger }: SettingsViewProps ) => {
  const { roles } = useSelector(settingsSelector)
  const { userRole } = useSelector(settingsSelector)
  const { canCreateRole, canManageRole } = usePermission(userRole)

  return (
    <DashboardLayout>
      <div className='bg-white py-10 px-[50px]'>
        <Tabs defaultValue='profile'>
          <TabsList className='bg-transparent contents md:grid md:grid-cols-5 gap-3 p-0 mb-5 border-b border-border-line'>
            <TabsTrigger value='profile' className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:border-b data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5'>Profile</TabsTrigger>
            {canCreateRole && canManageRole &&
              <TabsTrigger
                value='roles'
                className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:border-b data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5'
              >
              Roles
              </TabsTrigger>}
          </TabsList>
          <TabsContent value='profile'>
            <ProfileForm user={user} canManageRole={canManageRole} />
            <ChangePasswordForm user={user} />
          </TabsContent>
          <TabsContent value='roles'>
            <RolesView roles={roles} />
            <CreateNewRoleDialog user={user} logger={logger} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
