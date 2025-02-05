import { useEffect, useState } from 'react'

import { Roles } from '@/api'
import { roleService } from '@/singletons'

export const useRole = (groupId?: string) => {
  const [roles, setRoles] = useState<Roles[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    const roleSubscription = roleService.role$.subscribe(state => {
      setRoles(state.roles)
      setLoading(state.loading)
      setError(state.error)
    })
    if (groupId) {
      roleService.getRolesByGroupId(groupId)
    }

    return () => {
      roleSubscription.unsubscribe()
    }
  }, [groupId])

  return {
    roles,
    error,
    loading,
  }
}
