import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useState } from 'react'
import CreateNewRoleForm from '@/views/SettingsView/form/CreateNewRoleForm.tsx'
import { AuthenticatedUserData } from '@/api'
import { UseUpdates } from '@/hooks/useUpdates.ts'

type CreateNewRoleDialogProps = {
  user: AuthenticatedUserData
  logger: UseUpdates
}

export default function CreateNewRoleDialog({ user, logger }: CreateNewRoleDialogProps) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='my-5' asChild>
        <Button className='bg-dark-purple text-white px-6 py-2 hover:bg-dark-purple'>Create Role</Button>
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
