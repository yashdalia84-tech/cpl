export const storage = {
    // Players
    getPlayers: () => {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem('cpl_players')
      return data ? JSON.parse(data) : []
    },
    setPlayers: (players) => {
      localStorage.setItem('cpl_players', JSON.stringify(players))
    },
  
    // Teams
    getTeams: () => {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem('cpl_teams')
      return data ? JSON.parse(data) : []
    },
    setTeams: (teams) => {
      localStorage.setItem('cpl_teams', JSON.stringify(teams))
    },
  
    // Auth
    getAuth: () => {
      if (typeof window === 'undefined') return false
      return localStorage.getItem('cpl_auth') === 'true'
    },
    setAuth: (val) => {
      localStorage.setItem('cpl_auth', val ? 'true' : 'false')
    },
    logout: () => {
      localStorage.removeItem('cpl_auth')
    },
  
    // Clear all
    clearAll: () => {
      localStorage.removeItem('cpl_players')
      localStorage.removeItem('cpl_teams')
      localStorage.removeItem('cpl_auth')
    }
  }