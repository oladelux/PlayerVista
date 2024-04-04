export const setCurrentTeam =(teamId: string) => localStorage.setItem('currentTeam', teamId)
export const getCurrentTeam = () => localStorage.getItem('currentTeam') || ''
export const clearLocalStorage = () => localStorage.clear()
