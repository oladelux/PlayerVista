import { useState } from 'react'

import { TrashIcon } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'

export function ConfirmStaffDeletion({ onDeleted }: { onDeleted: () => void }) {
  const [open, setOpen] = useState(false)
  const handleDelete = () => {
    onDeleted()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='table-link cursor-pointer border-l border-l-border-line px-2 text-red-500'>
          <TrashIcon width={16} />
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Confirm Staff Deletion?</DialogTitle>
        </DialogHeader>
        <div className='text-center'>
          <div className='my-5 flex justify-center'>
            <Button type='button' className='mr-5 bg-at-red hover:bg-at-red' onClick={handleDelete}>
              Delete
            </Button>
            <DialogClose asChild>
              <Button type='button'>close</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
