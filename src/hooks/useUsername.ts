import { useState, useEffect } from 'react'

import { useUser } from '@/hooks/useUser.ts'

export const useUserName = (userId: string) => {
  const [username, setUsername] = useState<string>('')
  const user = useUser()

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await user.getUserName(userId)
      setUsername(name)
    }

    fetchUserName()
  }, [userId, user])

  return username
}
