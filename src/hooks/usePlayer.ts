import { useEffect, useState } from 'react'

import { Player } from '@/api'
import { appService, playerService } from '@/singletons'

export const usePlayer = (playerId?: string, teamId?: string) => {
  const [allUserPlayers, setAllUserPlayers] = useState<Player[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const userData = appService.getUserData()
  const userId = userData?.id

  useEffect(() => {
    console.log('Player: checking thus shit')
    const playerSubscription = playerService.player$.subscribe(state => {
      setPlayers(state.players)
      setAllUserPlayers(state.allUserPlayers)
      setPlayer(state.player)
      setLoading(state.loading)
      setError(state.error)
    })
    playerService.getPlayers(teamId)
    playerService.getPlayer(playerId)
    playerService.getAllPlayers(userId)

    return () => {
      playerSubscription.unsubscribe()
    }
  }, [playerId, teamId, userId])

  return {
    player,
    players,
    allUserPlayers,
    loading,
    error,
  }
}
