import { useOutletContext } from 'react-router-dom'

import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { usePermission } from '@/hooks/usePermission.ts'
import { useUpdates } from '@/hooks/useUpdates.ts'
import { appService } from '@/singletons'
import ChangePasswordForm from '@/views/SettingsView/ChangePasswordForm.tsx'
import CreateNewRoleDialog from '@/views/SettingsView/dialog/CreateNewRoleDialog.tsx'
import ProfileForm from '@/views/SettingsView/ProfileForm.tsx'
import RolesView from '@/views/SettingsView/RolesView.tsx'

export function SettingsView() {
  const userData = appService.getUserData()
  const logger = useUpdates()
  const { roles } = useOutletContext<DashboardLayoutOutletContext>()
  const { canCreateRole, canManageRole } = usePermission()

  if(!userData) {
    return null
  }

  return (
    <div className='bg-white px-[50px] py-10'>
      <Tabs defaultValue='profile'>
        <TabsList className='mb-5 contents gap-3 border-b border-border-line bg-transparent p-0 md:grid md:grid-cols-5'>
          <TabsTrigger value='profile' className='px-3.5 py-2.5 text-text-grey-3 data-[state=active]:border-b data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'>Profile</TabsTrigger>
          {canCreateRole && canManageRole &&
              <TabsTrigger
                value='roles'
                className='px-3.5 py-2.5 text-text-grey-3 data-[state=active]:border-b data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'
              >
              Roles
              </TabsTrigger>}
        </TabsList>
        <TabsContent value='profile'>
          <ProfileForm user={userData} canManageRole={canManageRole} roles={roles} />
          <ChangePasswordForm user={userData} />
        </TabsContent>
        <TabsContent value='roles'>
          <RolesView roles={roles} />
          <CreateNewRoleDialog user={userData} logger={logger} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
