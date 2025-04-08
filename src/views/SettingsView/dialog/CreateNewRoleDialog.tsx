import { useState } from 'react'

import { AuthenticatedUserData } from '@/api'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { UseUpdates } from '@/hooks/useUpdates.ts'
import CreateNewRoleForm from '@/views/SettingsView/form/CreateNewRoleForm.tsx'

type CreateNewRoleDialogProps = {
  user: AuthenticatedUserData
  logger: UseUpdates
}

export default function CreateNewRoleDialog({ user, logger }: CreateNewRoleDialogProps) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='my-5' asChild>
        <Button className='bg-dark-purple px-6 py-2 text-white hover:bg-dark-purple'>
          Create Role
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
        </DialogHeader>
        <CreateNewRoleForm user={user} logger={logger} setDialogOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
