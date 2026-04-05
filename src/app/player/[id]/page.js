'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { storage } from '@/lib/storage'
import { TEAMS } from '@/lib/teams'
import StatBox from '@/components/StatBox'
import Navbar from '@/components/Navbar'
import { PLAYER_IMAGES } from '@/lib/playerImages'


function SoldCelebration({ player, team, price, onDone }) {
    useEffect(() => {
      const timer = setTimeout(onDone, 5200)
      return () => clearTimeout(timer)
    }, [])
  
    const colors = ['#00D4FF', '#FFD700', '#FF6B6B', '#00FF88', '#FF8C00', '#CC2200', '#fff', '#FF69B4', '#7B68EE']

// Top falling confetti (120 pieces)
const topConfetti = Array.from({ length: 120 }, (_, i) => ({
  id: `top-${i}`,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 1.5}s`,
  duration: `${2 + Math.random() * 1.5}s`,
  color: colors[i % colors.length],
  size: `${7 + Math.random() * 11}px`,
  shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'rect',
  rotate: `${Math.random() * 360}deg`,
  drift: `${(Math.random() - 0.5) * 250}px`,
}))

// Left cannon burst (60 pieces)
const leftConfetti = Array.from({ length: 120 }, (_, i) => ({
  id: `left-${i}`,
  color: colors[i % colors.length],
  size: `${8 + Math.random() * 10}px`,
  shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'rect',
  delay: `${Math.random() * 0.4}s`,
  angle: 20 + Math.random() * 70, // shoots up-right
  power: 180 + Math.random() * 280,
}))

// Right cannon burst (60 pieces)
const rightConfetti = Array.from({ length: 120 }, (_, i) => ({
  id: `right-${i}`,
  color: colors[i % colors.length],
  size: `${8 + Math.random() * 10}px`,
  shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'rect',
  delay: `${Math.random() * 0.4}s`,
  angle: 110 + Math.random() * 70, // shoots up-left
  power: 180 + Math.random() * 280,
}))
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(8, 12, 40, 0.97)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        animation: 'fadeInCelebration 0.3s ease'
      }}>
        <style>{`
  @keyframes fadeInCelebration { from { opacity: 0 } to { opacity: 1 } }
  @keyframes confettiFall {
    0% { transform: translateY(-60px) rotate(0deg) translateX(0); opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg) translateX(var(--drift)); opacity: 0.1; }
  }
  @keyframes cannonLeft {
    0%   { transform: translate(0, 0) rotate(0deg); opacity: 1; }
    15%  { opacity: 1; }
    100% { transform: translate(var(--cx), var(--cy)) rotate(540deg); opacity: 0; }
  }
  @keyframes cannonRight {
    0%   { transform: translate(0, 0) rotate(0deg); opacity: 1; }
    15%  { opacity: 1; }
    100% { transform: translate(var(--cx), var(--cy)) rotate(-540deg); opacity: 0; }
  }
  @keyframes popIn {
    0% { transform: scale(0.4); opacity: 0; }
    60% { transform: scale(1.08); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @keyframes badgePulse {
    0%, 100% { box-shadow: 0 0 30px rgba(204,34,0,0.5); }
    50% { box-shadow: 0 0 60px rgba(204,34,0,0.9), 0 0 100px rgba(204,34,0,0.3); }
  }
`}</style>
  
        {/* Confetti */}
       {/* Top falling confetti */}
{topConfetti.map(p => (
  <div key={p.id} style={{
    position: 'absolute',
    top: '-20px',
    left: p.left,
    width: p.shape === 'rect' ? `${parseInt(p.size) * 2}px` : p.size,
    height: p.size,
    background: p.color,
    borderRadius: p.shape === 'circle' ? '50%' : '2px',
    '--drift': p.drift,
    animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
    transform: `rotate(${p.rotate})`,
    opacity: 0,
  }} />
))}

{/* Left cannon */}
{leftConfetti.map(p => {
  const rad = (p.angle * Math.PI) / 180
  const cx = `${Math.cos(rad) * p.power}px`
  const cy = `${-Math.sin(rad) * p.power}px`
  return (
    <div key={p.id} style={{
      position: 'absolute',
      bottom: '0px',
      left: '0px',
      width: p.shape === 'rect' ? `${parseInt(p.size) * 2}px` : p.size,
      height: p.size,
      background: p.color,
      borderRadius: p.shape === 'circle' ? '50%' : '2px',
      '--cx': cx,
      '--cy': cy,
      animation: `cannonLeft ${0.9 + Math.random() * 0.6}s ${p.delay} cubic-bezier(0.2,0.8,0.4,1) forwards`,
      opacity: 0,
    }} />
  )
})}

{/* Right cannon */}
{rightConfetti.map(p => {
  const rad = (p.angle * Math.PI) / 180
  const cx = `${Math.cos(rad) * p.power}px`
  const cy = `${-Math.sin(rad) * p.power}px`
  return (
    <div key={p.id} style={{
      position: 'absolute',
      bottom: '0px',
      right: '0px',
      width: p.shape === 'rect' ? `${parseInt(p.size) * 2}px` : p.size,
      height: p.size,
      background: p.color,
      borderRadius: p.shape === 'circle' ? '50%' : '2px',
      '--cx': cx,
      '--cy': cy,
      animation: `cannonRight ${0.9 + Math.random() * 0.6}s ${p.delay} cubic-bezier(0.2,0.8,0.4,1) forwards`,
      opacity: 0,
    }} />
  )
})}
  
        {/* Main card */}
        <div style={{
          animation: 'popIn 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: '500px',
          width: '100%',
        }}>
          {/* SOLD badge */}
          <div style={{
            display: 'inline-block',
            background: '#CC2200',
            padding: '10px 40px',
            borderRadius: '6px',
            marginBottom: '28px',
            animation: 'badgePulse 1.2s ease-in-out infinite',
          }}>
            <span style={{
              fontSize: '28px', fontWeight: '900',
              letterSpacing: '8px', color: '#fff',
              fontStyle: 'italic',
            }}>SOLD!</span>
          </div>
  
          {/* Player name */}
          <div style={{
            fontSize: '56px', fontWeight: '900',
            color: '#fff', letterSpacing: '3px',
            lineHeight: 1.05, marginBottom: '12px',
            textShadow: '0 0 40px rgba(0,212,255,0.4)',
            animation: 'shimmer 2s ease-in-out infinite',
          }}>
            {player.name.toUpperCase()}
          </div>
  
          {/* Divider */}
          <div style={{
            width: '80px', height: '3px',
            background: 'linear-gradient(90deg, transparent, #00D4FF, transparent)',
            margin: '0 auto 20px',
          }} />
  
          {/* "TO" label */}
          <div style={{
            color: '#8899CC', fontSize: '13px',
            letterSpacing: '5px', marginBottom: '8px',
            fontWeight: '700',
          }}>SOLD TO</div>
  
          {/* Team name */}
          <div style={{
            fontSize: '32px', fontWeight: '800',
            color: '#00D4FF', letterSpacing: '2px',
            marginBottom: '20px',
            textShadow: '0 0 20px rgba(0,212,255,0.6)',
          }}>
            {team.toUpperCase()}
          </div>
  
          {/* Price */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,215,0,0.12)',
            border: '1px solid rgba(255,215,0,0.4)',
            borderRadius: '12px',
            padding: '14px 40px',
          }}>
            <span style={{
              fontSize: '42px', fontWeight: '900',
              color: '#FFD700',
              textShadow: '0 0 20px rgba(255,215,0,0.5)',
              letterSpacing: '2px',
            }}>₹{Number(price).toLocaleString()}</span>
          </div>
  
          {/* CPL label */}
          <div style={{
            color: '#8899CC', fontSize: '11px',
            letterSpacing: '4px', marginTop: '28px',
          }}>CPL SEASON 4 · AUCTION</div>
        </div>
      </div>
    )
  }

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
  const [showBidBar, setShowBidBar] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationData, setCelebrationData] = useState(null)


  useEffect(() => {
    if (!storage.getAuth()) { router.push('/'); return }
    const players = storage.getPlayers()
    const found = players.find(p => String(p.id) === String(id))
    if (!found) { router.push('/home'); return }
    setPlayer(found)
    setStatus(found.sold ? 'sold' : found.unsoldFlag ? 'unsold' : 'sold')  
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

      // Figure out this player's category
      const rank = parseInt(player.mvpRank)
      const isPlayerMvp = !isNaN(rank) && rank <= 20

      // Get team's current roster breakdown
      const allPlayersNow2 = storage.getPlayers()
      const teamRoster = allPlayersNow2.filter(p => p.sold && p.soldTo === selectedTeam)
      const currentMvpCount = teamRoster.filter(p => {
        const r = parseInt(p.mvpRank)
        return !isNaN(r) && r <= 20
      }).length
      const currentNormalCount = teamRoster.length - currentMvpCount

      if (isPlayerMvp) {
        // Trying to buy an MVP player
        if (currentMvpCount >= 2) {
          setError(`${selectedTeam} already has 2 MVP players! Maximum limit reached.`)
          return
        }
      } else {
        // Trying to buy a normal player
        if (currentNormalCount >= 6) {
          setError(`${selectedTeam} already has 6 normal players! They must now buy MVP players only.`)
          return
        }
      }

      // Update team
// Update team
const allPlayersNow = storage.getPlayers()
const updatedTeams = allTeams.map(t => {
  if (t.name === selectedTeam) {
    return {
      ...t,
      coins: t.coins - bid,
      players: [...allPlayersNow.filter(p => p.sold && p.soldTo === t.name).map(p => p.name), player.name]
    }
  }
  // Refund previous team if player was previously sold
  if (player.sold && t.name === player.soldTo) {
    return {
      ...t,
      coins: t.coins + player.soldPrice,
      players: allPlayersNow.filter(p => p.sold && p.soldTo === t.name && String(p.id) !== String(id)).map(p => p.name)
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
      setCelebrationData({ name: player.name, team: selectedTeam, price: bid })
      setShowCelebration(true)
      return

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

      }
      router.push('/home')
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
        {showCelebration && celebrationData && (
        <SoldCelebration
          player={{ name: celebrationData.name }}
          team={celebrationData.team}
          price={celebrationData.price}
          onDone={() => {
            setShowCelebration(false)
            router.push('/home')
          }}
        />
      )}
      <Navbar title="PLAYER PROFILE" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

{/* Team Bid Bar */}
<div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setShowBidBar(prev => !prev)}
            style={{
              background: showBidBar ? '#0F1640' : 'transparent',
              border: '1px solid rgba(0,212,255,0.3)',
              borderRadius: '10px',
              padding: '10px 20px',
              color: '#00D4FF',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              marginBottom: showBidBar ? '12px' : '0',
              transition: 'all 0.2s'
            }}
          >
            {showBidBar ? '▲ HIDE BID INFO' : '▼ VIEW MAX BIDS PER TEAM'}
          </button>

          {showBidBar && (
            <div style={{
              background: '#0F1640',
              border: '1px solid rgba(0,212,255,0.15)',
              borderRadius: '16px',
              padding: '20px 24px',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '10px'
              }}>
                {teams.map(t => {
                  const allPlayers = storage.getPlayers()
                  const roster = allPlayers.filter(p => p.sold && p.soldTo === t.name)
                  const playersCount = roster.length
                  const slotsLeft = 8 - playersCount
                  const maxBid = t.coins - (slotsLeft - 1) * 200
                  const canBid = maxBid >= 200 && slotsLeft > 0

                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        if (!canBid) return
                        setStatus('sold')
                        setSelectedTeam(t.name)
                        setBidAmount(String(maxBid))
                        setShowBidBar(false)
                      }}
                      style={{
                        padding: '12px 14px',
                        background: canBid ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${canBid ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: '10px',
                        cursor: canBid ? 'pointer' : 'not-allowed',
                        opacity: canBid ? 1 : 0.4,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { if (canBid) e.currentTarget.style.background = 'rgba(0,212,255,0.14)' }}
                      onMouseLeave={e => { if (canBid) e.currentTarget.style.background = 'rgba(0,212,255,0.06)' }}
                    >
                      <div style={{ color: '#fff', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{t.name}</div>
                      <div style={{ color: '#8899CC', fontSize: '10px', marginBottom: '6px' }}>
                        {playersCount}/8 · ₹{t.coins?.toLocaleString()}
                      </div>
                      {canBid ? (
                        <div style={{ color: '#00D4FF', fontWeight: '700', fontSize: '15px' }}>
                          ₹{maxBid.toLocaleString()}
                        </div>
                      ) : (
                        <div style={{ color: '#FF6B6B', fontSize: '11px', fontWeight: '700' }}>
                          {slotsLeft === 0 ? 'FULL' : 'INSUFFICIENT'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div style={{ color: '#8899CC', fontSize: '10px', marginTop: '10px' }}>
                Click a team to auto-fill bid
              </div>
            </div>
          )}
        </div>

<div style={{
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
                  onChange={e => {
                    const val = e.target.value
                    setBidAmount(val)
                    // Live validation
                    if (selectedTeam && val) {
                      const bid = parseInt(val)
                      const allTeams = storage.getTeams()
                      const team = allTeams.find(t => t.name === selectedTeam)
                      if (team) {
                        const allPlayers = storage.getPlayers()
                        const roster = allPlayers.filter(p => p.sold && p.soldTo === selectedTeam)
                        const slotsLeft = 8 - roster.length
                        const maxBid = team.coins - (slotsLeft - 1) * 200
                        if (bid > maxBid) {
                          setError(`Max bid for ${selectedTeam} is ₹${maxBid.toLocaleString()}`)
                        } else if (bid > team.coins) {
                          setError(`${selectedTeam} only has ₹${team.coins.toLocaleString()} left!`)
                        } else {
                          setError('')
                        }
                      }
                    }
                  }}
                  min={200}
                  style={{
                    width: '100%',
                    background: '#0A0E2A',
                    border: `1px solid ${error ? 'rgba(204,34,0,0.6)' : 'rgba(0,212,255,0.3)'}`,
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
{/* Player Photo */}
{PLAYER_IMAGES[player.id] && (
  <div style={{
    marginBottom: '24px',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(0,212,255,0.2)',
    background: '#0F1640',
    aspectRatio: '1/1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <img
      src={PLAYER_IMAGES[player.id]}
      alt={player.name}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center top',
        display: 'block',
      }}
      onError={e => { e.currentTarget.style.display = 'none' }}
    />
  </div>
)}
{!PLAYER_IMAGES[player.id] && (
  <div style={{
    marginBottom: '24px',
    borderRadius: '16px',
    border: '1px solid rgba(0,212,255,0.1)',
    background: '#0F1640',
    aspectRatio: '1/1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  }}>
    <div style={{ fontSize: '48px' }}>🏏</div>
    <div style={{ color: '#8899CC', fontSize: '12px', letterSpacing: '2px' }}>NO PHOTO</div>
  </div>
)}
          <StatBox label="MVP RANK" value={player.mvpRank} />
          <StatBox label="RUNS" value={player.runs} />
          <StatBox label="WICKETS" value={player.wickets} />
          <StatBox label="BASE PRICE" value={`₹${player.basePrice || 200}`} />

         
        </div>
      </div>
    </div>
    </div>

  )
}