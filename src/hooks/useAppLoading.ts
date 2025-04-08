import { useState } from 'react'

export type AppLoading = ReturnType<typeof useAppLoading>

export function useAppLoading() {
  const [initialized, setInitialized] = useState(false)

  return {
    /**
     * Mark initial loading as done
     */
    done() {
      setInitialized(true)
    },
    /**
     * Flag if the app is still in the initial loading state
     */
    isLoading: !initialized,
  }
}
