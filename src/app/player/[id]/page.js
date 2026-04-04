'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { storage } from '@/lib/storage'
import { TEAMS } from '@/lib/teams'
import StatBox from '@/components/StatBox'
import Navbar from '@/components/Navbar'

export default function PlayerPage() {
  const { id } = useParams()
  const router = useRouter()
  const [player, setPlayer] = useState(null)
  const [teams, setTeams] = useState([])
  const [status, setStatus] = useState('unsold')
  const [selectedTeam, setSelectedTeam] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!storage.getAuth()) { router.push('/'); return }
    const players = storage.getPlayers()
    const found = players.find(p => String(p.id) === String(id))
    if (!found) { router.push('/home'); return }
    setPlayer(found)
    setStatus(found.sold ? 'sold' : found.unsoldFlag ? 'unsold' : 'unsold')
    setSelectedTeam(found.soldTo || '')  
          setSelectedTeam(found.soldTo || '')
    setBidAmount(found.soldPrice ? String(found.soldPrice) : '')
    setTeams(storage.getTeams())
  }, [id])

  const handleConfirm = () => {
    setError('')
    if (status === 'sold') {
      if (!selectedTeam) { setError('Please select a team'); return }
      const bid = parseInt(bidAmount)
      if (!bid || bid < 200) { setError('Bid must be at least ₹200'); return }

      const allTeams = storage.getTeams()
      const team = allTeams.find(t => t.name === selectedTeam)
      if (!team) { setError('Team not found'); return }
      if (team.coins < bid) {
        setError(`${selectedTeam} only has ₹${team.coins.toLocaleString()} left!`)
        return
      }
      if (team.players && team.players.length >= 8) {
        setError(`${selectedTeam} already has 8 players!`)
        return
      }
      
      // Check MVP limit
      const rank = parseInt(player.mvpRank)
      const isPlayerMvp = !isNaN(rank) && rank <= 20
      if (isPlayerMvp) {
        const teamPlayers = storage.getPlayers().filter(p => p.sold && p.soldTo === selectedTeam)
        const mvpCount = teamPlayers.filter(p => {
          const r = parseInt(p.mvpRank)
          return !isNaN(r) && r <= 20
        }).length
        if (mvpCount >= 2) {
          setError(`${selectedTeam} already has 2 MVP players! Maximum limit reached.`)
          return
        }
      }

      // Update team
      const updatedTeams = allTeams.map(t => {
        if (t.name === selectedTeam) {
          return {
            ...t,
            coins: t.coins - bid,
            players: [...(t.players || []), player.name]
          }
        }
        // Refund previous team if player was previously sold
        if (player.sold && t.name === player.soldTo) {
          return {
            ...t,
            coins: t.coins + player.soldPrice,
            players: (t.players || []).filter(n => n !== player.name)
          }
        }
        return t
      })
      storage.setTeams(updatedTeams)

      // Update player
      const allPlayers = storage.getPlayers()
      const updated = allPlayers.map(p =>
        String(p.id) === String(id)
          ? { ...p, sold: true, soldTo: selectedTeam, soldPrice: bid }
          : p
      )
      storage.setPlayers(updated)
      setPlayer(prev => ({ ...prev, sold: true, soldTo: selectedTeam, soldPrice: bid }))
      setTeams(storage.getTeams())

    } else {
        // Mark as unsold — refund if was sold
        if (player.sold) {
          const allTeams = storage.getTeams()
          const updatedTeams = allTeams.map(t => {
            if (t.name === player.soldTo) {
              return {
                ...t,
                coins: t.coins + player.soldPrice,
                players: (t.players || []).filter(n => n !== player.name)
              }
            }
            return t
          })
          storage.setTeams(updatedTeams)
        }
  
        let allPlayers = storage.getPlayers()
        allPlayers = allPlayers.map(p =>
          String(p.id) === String(id)
            ? { ...p, sold: false, soldTo: null, soldPrice: null, unsoldFlag: true }
            : p
        )
        storage.setPlayers(allPlayers)
        setPlayer(prev => ({ ...prev, sold: false, soldTo: null, soldPrice: null, unsoldFlag: true }))
  
        // Check if active pool is now empty for this category
        const rank = parseInt(player.mvpRank)
        const isThisMvp = !isNaN(rank) && rank <= 20
  
        const activePool = allPlayers.filter(p => {
          const r = parseInt(p.mvpRank)
          const isMvp = !isNaN(r) && r <= 20
          return isMvp === isThisMvp && !p.sold && !p.unsoldFlag
        })
  
        if (activePool.length === 0) {
          const released = allPlayers.map(p => {
            const r = parseInt(p.mvpRank)
            const isMvp = !isNaN(r) && r <= 20
            if (isMvp === isThisMvp && p.unsoldFlag) {
              return { ...p, unsoldFlag: false }
            }
            return p
          })
          storage.setPlayers(released)
          alert(`All ${isThisMvp ? 'MVP' : 'regular'} players auctioned! Unsold players are back in the pool.`)
        }
      }

    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!player) return (
    <div style={{ background: '#0A0E2A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#00D4FF', fontSize: '24px' }}>LOADING...</div>
    </div>
  )

  const nameParts = player.name.trim().split(' ')
  const firstName = nameParts.slice(0, -1).join(' ') || player.name
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E2A' }}>
      <Navbar title="PLAYER PROFILE" />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '32px',
        alignItems: 'start'
      }}>

        {/* LEFT PANEL */}
        <div style={{
          background: '#0F1640',
          borderRadius: '16px',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '520px',
          border: '1px solid rgba(0,212,255,0.15)'
        }}>
          {/* Decorative shape */}
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-30px',
            width: '220px',
            height: '200px',
            background: 'rgba(204,34,0,0.12)',
            transform: 'rotate(-25deg)',
            borderRadius: '16px'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-80px',
            left: '40px',
            width: '160px',
            height: '200px',
            background: 'rgba(204,34,0,0.08)',
            transform: 'rotate(-15deg)',
            borderRadius: '16px'
          }} />

          {/* Player Profile badge */}
          <div style={{
            display: 'inline-block',
            background: '#CC2200',
            padding: '6px 16px',
            borderRadius: '4px',
            marginBottom: '32px'
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: '700',
              fontStyle: 'italic',
              letterSpacing: '1px'
            }}>PLAYER Profile</span>
          </div>

          {/* Name */}
          <div style={{
            fontSize: '44px',
            fontWeight: '700',
            color: '#fff',
            letterSpacing: '2px',
            lineHeight: '1.1',
            marginBottom: '4px'
          }}>{firstName.toUpperCase()}</div>
          {lastName && (
            <div style={{
              fontSize: '72px',
              fontWeight: '700',
              color: '#fff',
              letterSpacing: '2px',
              lineHeight: '1',
              marginBottom: '20px'
            }}>{lastName.toUpperCase()}</div>
          )}

          {/* Cyan line */}
          <div style={{
            width: '120px', height: '3px',
            background: '#00D4FF',
            marginBottom: '16px'
          }} />

          <div style={{
            color: '#00D4FF',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '3px',
            marginBottom: '32px'
          }}>CLUBLIFE PREMIER LEAGUE</div>
   <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{
                width: '100%',
                background: '#0A0E2A',
                border: '1px solid rgba(0,212,255,0.4)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '16px',
                outline: 'none',
                fontFamily: 'inherit',
                cursor: 'pointer'
              }}
              >
              <option value="unsold">UNSOLD</option>
              <option value="sold">SOLD</option>
              </select>

              {status === 'sold' && (
              <>
                <select
                  value={selectedTeam}
                  onChange={e => setSelectedTeam(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0A0E2A',
                    border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: '#fff',
                    fontSize: '15px',
                    marginBottom: '12px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">-- SELECT TEAM --</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.name}>
                      {t.name} (₹{t.coins?.toLocaleString()} left)
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Enter bid amount (min ₹200)"
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  min={200}
                  style={{
                    width: '100%',
                    background: '#0A0E2A',
                    border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: '#fff',
                    fontSize: '15px',
                    marginBottom: '12px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </>
             )}

             {error && (
              <div style={{
                background: 'rgba(204,34,0,0.15)',
                border: '1px solid rgba(204,34,0,0.5)',
                borderRadius: '8px',
                padding: '10px 16px',
                color: '#FF6B6B',
                fontSize: '14px',
                marginBottom: '12px'
              }}>{error}</div>
             )}

             {saved && (
              <div style={{
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.4)',
                borderRadius: '8px',
                padding: '10px 16px',
                color: '#00D4FF',
                fontSize: '14px',
                marginBottom: '12px',
                textAlign: 'center',
                fontWeight: '700'
              }}>✅ SAVED SUCCESSFULLY!</div>
             )}

             <button
              onClick={handleConfirm}
              style={{
                width: '100%',
                background: '#CC2200',
                border: 'none',
                borderRadius: '8px',
                padding: '14px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '700',
                letterSpacing: '2px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 0 20px rgba(204,34,0,0.4)',
                marginBottom: '12px'
              }}
             >CONFIRM</button>

             <button
              onClick={() => router.push('/home')}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid rgba(0,212,255,0.4)',
                borderRadius: '8px',
                padding: '12px',
                color: '#00D4FF',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '2px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
             >← PLAYER INDEX</button>
          {player.sold && (
            <div style={{
              background: 'rgba(204,34,0,0.2)',
              border: '1px solid rgba(204,34,0,0.5)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px'
            }}>
              <div style={{ color: '#FF6B6B', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>SOLD TO</div>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '18px' }}>{player.soldTo}</div>
              <div style={{ color: '#FFA500', fontWeight: '700', fontSize: '22px' }}>
                ₹{player.soldPrice?.toLocaleString()}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '40px',
            color: '#8899CC',
            fontSize: '12px',
            fontStyle: 'italic'
          }}>CPL Season 4 • Auction</div>
        </div>

        {/* RIGHT PANEL */}
        <div>
          {/* CPL badge top right */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '20px'
          }}>
            </div>

          <StatBox label="MVP RANK" value={player.mvpRank} />
          <StatBox label="RUNS" value={player.runs} />
          <StatBox label="WICKETS" value={player.wickets} />
          <StatBox label="BASE PRICE" value={`₹${player.basePrice || 200}`} />

         
        </div>
      </div>
    </div>
  )
}