import { useEffect, useState } from 'react'

import { getSubscription, SubscriptionStatus } from '@/api'

let didInit = false
export const usePaymentSubscription = () => {
  const [loading, setLoading] = useState(true)
  const [isActive, setIsActive] = useState(false)

  async function checkSubscription() {
    try {
      const { status } = await getSubscription()
      setIsActive(status === SubscriptionStatus.ACTIVE)
    } catch {
      setIsActive(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!didInit) {
      didInit = true
      checkSubscription()
    }
  })

  return {
    loading,
    isActive,
  }
}
