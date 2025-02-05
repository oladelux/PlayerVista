import { useEffect, useState } from 'react'

import { getSubscription, SubscriptionStatus } from '@/api'

export function usePaymentSubscription() {
  const [loading, setLoading] = useState<boolean>(true)
  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true

    async function checkSubscription() {
      try {
        setLoading(true)
        const { status } = await getSubscription()
        console.log(status)
        if (isMounted) {
          setIsActive(status === SubscriptionStatus.ACTIVE)
        }
      } catch {
        if (isMounted) {
          setIsActive(false)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkSubscription()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    loading,
    isActive,
  }
}
