'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'
import { TEAMS, DEFAULT_COINS } from '@/lib/teams'
import { CPL_PLAYERS } from '@/lib/players'
import Navbar from '@/components/Navbar'
import TeamBar from '@/components/TeamBar'

export default function HomePage() {
  const [players, setPlayers] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('PLAYER')
  const [auctionState, setAuctionState] = useState('idle')
  const [currentPlayer, setCurrentPlayer] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [countdown, setCountdown] = useState(2)
  const intervalRef = useRef(null)
const playersRef = useRef([])
const audioCtxRef = useRef(null)
const router = useRouter()

useEffect(() => {
    if (!storage.getAuth()) { router.push('/'); return }
    const saved = storage.getPlayers()
    if (saved && saved.length > 0) {
      setPlayers(saved)
      playersRef.current = saved
    } else {
      storage.setPlayers(CPL_PLAYERS)
      setPlayers(CPL_PLAYERS)
      playersRef.current = CPL_PLAYERS
    }
    const savedTeams = storage.getTeams()
    if (!savedTeams.length) {
      const initTeams = TEAMS.map(t => ({ ...t, coins: DEFAULT_COINS, players: [] }))
      storage.setTeams(initTeams)
    }

    // Refresh players whenever the page regains focus
    const onFocus = () => {
      const refreshed = storage.getPlayers()
      setPlayers(refreshed)
      playersRef.current = refreshed
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

const getAudioCtx = () => {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtxRef.current.state === 'suspended') {
    audioCtxRef.current.resume()
  }
  return audioCtxRef.current
}

const playTick = (progress = 0) => {
  try {
    const ctx = getAudioCtx()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    if (progress < 0.4) {
      // Fast phase — sharp short clicks
      osc.type = 'square'
      osc.frequency.setValueAtTime(180 + Math.random() * 60, now)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
      osc.start(now)
      osc.stop(now + 0.03)
    } else if (progress < 0.75) {
      // Slowing phase — deeper clunk
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(120 + Math.random() * 40, now)
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
      osc.start(now)
      osc.stop(now + 0.12)
    } else {
      // Almost stopped — heavy thud with reverb feel
      osc.type = 'sine'
      osc.frequency.setValueAtTime(90, now)
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.2)
      gain.gain.setValueAtTime(0.35, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      osc.start(now)
      osc.stop(now + 0.28)

      // Extra click layer on top
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.type = 'square'
      osc2.frequency.setValueAtTime(400, now)
      gain2.gain.setValueAtTime(0.08, now)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
      osc2.start(now)
      osc2.stop(now + 0.04)
    }
  } catch (e) {}
}

const playReveal = () => {
  try {
    const ctx = getAudioCtx()
    const now = ctx.currentTime

    // Drum roll buildup — rapid hits
    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(100, now + i * 0.04)
      gain.gain.setValueAtTime(0.15 + i * 0.02, now + i * 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.06)
      osc.start(now + i * 0.04)
      osc.stop(now + i * 0.04 + 0.07)
    }

    // Rising fanfare — staggered notes
    const fanfare = [261, 330, 392, 494, 587, 698, 880]
    fanfare.forEach((freq, i) => {
      const delay = 0.32 + i * 0.07
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + delay)
      gain.gain.setValueAtTime(0, now + delay)
      gain.gain.linearRampToValueAtTime(0.28, now + delay + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5)
      osc.start(now + delay)
      osc.stop(now + delay + 0.55)

      // Harmony layer
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(freq * 1.5, now + delay)
      gain2.gain.setValueAtTime(0, now + delay)
      gain2.gain.linearRampToValueAtTime(0.1, now + delay + 0.03)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.4)
      osc2.start(now + delay)
      osc2.stop(now + delay + 0.45)
    })

    // Big final GONG at the end of fanfare
    const gongDelay = 0.32 + fanfare.length * 0.07 + 0.1
    const gong = ctx.createOscillator()
    const gongGain = ctx.createGain()
    gong.connect(gongGain)
    gongGain.connect(ctx.destination)
    gong.type = 'sine'
    gong.frequency.setValueAtTime(160, now + gongDelay)
    gong.frequency.exponentialRampToValueAtTime(60, now + gongDelay + 2)
    gongGain.gain.setValueAtTime(0.7, now + gongDelay)
    gongGain.gain.exponentialRampToValueAtTime(0.001, now + gongDelay + 2.5)
    gong.start(now + gongDelay)
    gong.stop(now + gongDelay + 2.6)

    // Gong shimmer (high overtone)
    const shimmer = ctx.createOscillator()
    const shimmerGain = ctx.createGain()
    shimmer.connect(shimmerGain)
    shimmerGain.connect(ctx.destination)
    shimmer.type = 'sine'
    shimmer.frequency.setValueAtTime(640, now + gongDelay)
    shimmer.frequency.exponentialRampToValueAtTime(200, now + gongDelay + 1.5)
    shimmerGain.gain.setValueAtTime(0.2, now + gongDelay)
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + gongDelay + 1.8)
    shimmer.start(now + gongDelay)
    shimmer.stop(now + gongDelay + 2)

} catch (e) {}
}

const startAuction = () => {
    const allPlayers = playersRef.current

    let unsold = allPlayers.filter(p => {
      const rank = parseInt(p.mvpRank)
      return !p.sold && !p.unsoldFlag && (isNaN(rank) || rank > 20)
    })

    // If active pool is empty, check if unsold round players exist
    if (unsold.length === 0) {
      const unsoldRound = allPlayers.filter(p => {
        const rank = parseInt(p.mvpRank)
        return !p.sold && p.unsoldFlag && (isNaN(rank) || rank > 20)
      })
      if (unsoldRound.length === 0) {
        alert('All players have been auctioned!')
        return
      }
      // Release unsold players back into pool
      const released = allPlayers.map(p => {
        const rank = parseInt(p.mvpRank)
        if (!p.sold && p.unsoldFlag && (isNaN(rank) || rank > 20)) {
          return { ...p, unsoldFlag: false }
        }
        return p
      })
      storage.setPlayers(released)
      setPlayers(released)
      playersRef.current = released
      unsold = released.filter(p => {
        const rank = parseInt(p.mvpRank)
        return !p.sold && !p.unsoldFlag && (isNaN(rank) || rank > 20)
      })
    }

    const finalPlayer = unsold[Math.floor(Math.random() * unsold.length)]
    setAuctionState('spinning')
    setCurrentPlayer(null)

    const speeds = [
      ...Array(15).fill(50),
      ...Array(10).fill(80),
      ...Array(8).fill(130),
      ...Array(6).fill(200),
      ...Array(4).fill(320),
      ...Array(3).fill(500),
    ]

    let step = 0

    const runStep = () => {
        if (step < speeds.length) {
          const stepsLeft = speeds.length - step
          const rnd = stepsLeft <= 3
            ? finalPlayer
            : unsold[Math.floor(Math.random() * unsold.length)]
          setDisplayName(rnd.name)
      
          // pitch goes higher and slower as it slows down
          const progress = step / speeds.length
          playTick(progress)
      
          step++
          intervalRef.current = setTimeout(runStep, speeds[step - 1])
        } else {
          setDisplayName(finalPlayer.name)
          setCurrentPlayer(finalPlayer)
          setAuctionState('reveal')
      
          // 🎺 Play reveal fanfare
          playReveal()
      
          let cd = 3
          setCountdown(cd)
          const cdInterval = setInterval(() => {
            cd--
            setCountdown(cd)
            if (cd <= 0) {
              clearInterval(cdInterval)
              router.push(`/player/${finalPlayer.id}`)
            }
          }, 1000)
        }
      }

    runStep()
  }

  const resetAuction = () => {
    clearTimeout(intervalRef.current)
    setAuctionState('idle')
    setCurrentPlayer(null)
    setDisplayName('')
  }

  useEffect(() => {
    return () => clearTimeout(intervalRef.current)
  }, [])

  const filtered = players.filter(p => {
    const rank = parseInt(p.mvpRank)
    const isMvp = !isNaN(rank) && rank <= 20
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    if (filter === 'SOLD') return p.sold && matchSearch
    if (filter === 'UNSOLD') return p.unsoldFlag && matchSearch
    // ALL tab — exclude MVPs, sold, and unsold-flagged
    if (isMvp) return false
    return !p.unsoldFlag && !p.sold && matchSearch
  })
  const soldCount = players.filter(p => p.sold).length
  const unsoldCount = players.filter(p => !p.sold).length

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E2A' }}>
      <Navbar title="AUCTION" />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ color: '#00D4FF', fontSize: '12px', letterSpacing: '4px', marginBottom: '8px' }}>
            CLUBLIFE PREMIER LEAGUE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '2px', lineHeight: '1' }}>
              AUCTION CENTRE
            </h1>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#8899CC' }}>
              <span>TOTAL: <strong style={{ color: '#fff' }}>{players.length}</strong></span>
              <span>SOLD: <strong style={{ color: '#CC2200' }}>{soldCount}</strong></span>
              <span>UNSOLD: <strong style={{ color: '#00D4FF' }}>{unsoldCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '28px',
          background: '#0F1640',
          padding: '4px',
          borderRadius: '10px',
          width: 'fit-content',
          border: '1px solid rgba(0,212,255,0.15)'
        }}>
          {['PLAYER', 'MVP'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#CC2200' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 28px',
                color: activeTab === tab ? '#fff' : '#8899CC',
                fontSize: '13px',
                fontWeight: '700',
                letterSpacing: '2px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                boxShadow: activeTab === tab ? '0 0 16px rgba(204,34,0,0.4)' : 'none'
              }}
            >
              {tab} AUCTION
            </button>
          ))}
        </div>

        {/* PLAYER AUCTION TAB */}
        {activeTab === 'PLAYER' && (
          <>
            {/* Big Auction Box */}
            <div style={{
              background: '#0F1640',
              border: `2px solid ${auctionState === 'reveal' ? '#00D4FF' : auctionState === 'spinning' ? 'rgba(204,34,0,0.6)' : 'rgba(0,212,255,0.2)'}`,
              borderRadius: '20px',
              padding: '56px 32px',
              marginBottom: '32px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '380px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 0.5s',
              boxShadow: auctionState === 'reveal'
                ? '0 0 60px rgba(0,212,255,0.2)'
                : auctionState === 'spinning'
                ? '0 0 60px rgba(204,34,0,0.15)'
                : 'none'
            }}>

              {/* Corner decorations */}
              {['top:16px;left:16px;border-top:2px solid;border-left:2px solid',
                'top:16px;right:16px;border-top:2px solid;border-right:2px solid',
                'bottom:16px;left:16px;border-bottom:2px solid;border-left:2px solid',
                'bottom:16px;right:16px;border-bottom:2px solid;border-right:2px solid'
              ].map((s, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  ...Object.fromEntries(s.split(';').map(p => {
                    const [k, v] = p.split(':')
                    return [k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v]
                  })),
                  width: '32px',
                  height: '32px',
                  borderColor: 'rgba(0,212,255,0.4)'
                }} />
              ))}

              {/* IDLE STATE */}
              {auctionState === 'idle' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '64px' }}>🏏</div>
                  <div style={{
                    color: '#fff',
                    fontSize: '26px',
                    fontWeight: '700',
                    letterSpacing: '4px'
                  }}>PLAYER AUCTION</div>
                  <div style={{ color: '#8899CC', fontSize: '15px', letterSpacing: '1px' }}>
                  <strong style={{ color: '#00D4FF' }}>
                    {players.filter(p => {
                      const rank = parseInt(p.mvpRank)
                      return !p.sold && !p.unsoldFlag && (isNaN(rank) || rank > 20)
                    }).length}
                  </strong> players available
                  </div>
                  <button
                    onClick={startAuction}
                    style={{
                      marginTop: '12px',
                      background: '#CC2200',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '18px 56px',
                      color: '#fff',
                      fontSize: '20px',
                      fontWeight: '700',
                      letterSpacing: '4px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      boxShadow: '0 0 40px rgba(204,34,0,0.6)',
                      zIndex: 10,
                      position: 'relative'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FF2200'}
                    onMouseLeave={e => e.currentTarget.style.background = '#CC2200'}
                  >
                    ⚡ START AUCTION
                  </button>
                </div>
              )}

              {/* SPINNING STATE */}
              {auctionState === 'spinning' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    color: '#CC2200',
                    fontSize: '12px',
                    letterSpacing: '5px',
                    fontWeight: '700',
                    animation: 'blink 0.8s infinite'
                  }}>● SELECTING PLAYER</div>

                  <div style={{
                    background: '#0A0E2A',
                    border: '2px solid #CC2200',
                    borderRadius: '16px',
                    padding: '28px 64px',
                    minWidth: '400px',
                    boxShadow: '0 0 40px rgba(204,34,0,0.4)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0, left: '-100%',
                      width: '60%', height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(204,34,0,0.15), transparent)',
                      animation: 'shimmer 0.6s linear infinite'
                    }} />
                    <div style={{
                      color: '#FF3300',
                      fontSize: '34px',
                      fontWeight: '900',
                      letterSpacing: '2px',
                      textShadow: '0 0 20px rgba(204,34,0,0.9)',
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {displayName || '...'}
                    </div>
                  </div>

                  <style>{`
                    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
                    @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }
                    @keyframes popIn {
                      0%{transform:scale(0.5);opacity:0}
                      60%{transform:scale(1.08)}
                      100%{transform:scale(1);opacity:1}
                    }
                    @keyframes glowPulse {
                      0%,100%{box-shadow:0 0 40px rgba(0,212,255,0.3)}
                      50%{box-shadow:0 0 80px rgba(0,212,255,0.7)}
                    }
                  `}</style>
                </div>
              )}

              {/* REVEAL STATE */}
              {auctionState === 'reveal' && currentPlayer && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    color: '#00D4FF',
                    fontSize: '13px',
                    letterSpacing: '5px',
                    fontWeight: '700'
                  }}>🎯 NEXT UP FOR AUCTION</div>

                  <div style={{
                    background: '#0A0E2A',
                    border: '2px solid #00D4FF',
                    borderRadius: '20px',
                    padding: '36px 72px',
                    boxShadow: '0 0 60px rgba(0,212,255,0.4)',
                    animation: 'popIn 0.5s ease, glowPulse 1.5s ease infinite'
                  }}>
                    <div style={{
                      color: '#8899CC',
                      fontSize: '11px',
                      letterSpacing: '4px',
                      marginBottom: '12px'
                    }}>PLAYER SELECTED</div>
                    <div style={{
                      color: '#fff',
                      fontSize: '44px',
                      fontWeight: '900',
                      letterSpacing: '3px',
                      textShadow: '0 0 30px rgba(0,212,255,0.6)',
                      lineHeight: '1'
                    }}>{currentPlayer.name.toUpperCase()}</div>
                    <div style={{
                      width: '80px', height: '3px',
                      background: '#00D4FF',
                      margin: '16px auto 0',
                      boxShadow: '0 0 10px rgba(0,212,255,0.8)'
                    }} />
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#8899CC',
                    fontSize: '14px',
                    letterSpacing: '2px'
                  }}>
                    <span>Opening profile in</span>
                    <span style={{
                      color: '#00D4FF',
                      fontSize: '28px',
                      fontWeight: '900',
                      minWidth: '32px'
                    }}>{countdown}</span>
                    <span>seconds</span>
                  </div>

                  <button
                    onClick={() => router.push(`/player/${currentPlayer.id}`)}
                    style={{
                      background: '#00D4FF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 32px',
                      color: '#0A0E2A',
                      fontSize: '14px',
                      fontWeight: '700',
                      letterSpacing: '2px',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >GO NOW →</button>

                  <button
                    onClick={resetAuction}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      padding: '8px 24px',
                      color: '#8899CC',
                      fontSize: '12px',
                      letterSpacing: '2px',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >PICK ANOTHER</button>
                </div>
              )}
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔍 Search player..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  flex: 1, minWidth: '200px',
                  background: '#0F1640',
                  border: '1px solid rgba(0,212,255,0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#fff', fontSize: '15px',
                  outline: 'none', fontFamily: 'inherit'
                }}
              />
              {['ALL', 'UNSOLD', 'SOLD'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? (f === 'SOLD' ? '#CC2200' : '#00D4FF') : 'transparent',
                  border: `1px solid ${f === 'SOLD' ? '#CC2200' : '#00D4FF'}`,
                  borderRadius: '8px', padding: '12px 20px',
                  color: filter === f ? '#fff' : (f === 'SOLD' ? '#CC2200' : '#00D4FF'),
                  fontSize: '13px', fontWeight: '700', letterSpacing: '2px',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
                }}>{f}</button>
              ))}
            </div>

            {/* Players Grid */}
            {players.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#8899CC' }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>🏏</div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>NO PLAYERS LOADED</div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px'
              }}>
                {filtered.map((player, i) => (
                  <div
                    key={player.id}
                    onClick={() => router.push(`/player/${player.id}`)}
                    style={{
                      background: player.sold ? '#1a0a0a' : '#0F1640',
                      border: `1px solid ${player.sold ? '#CC2200' : 'rgba(0,212,255,0.2)'}`,
                      borderRadius: '12px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)'
                      e.currentTarget.style.boxShadow = player.sold
                        ? '0 8px 20px rgba(204,34,0,0.25)'
                        : '0 8px 20px rgba(0,212,255,0.2)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ color: '#8899CC', fontSize: '11px', marginBottom: '8px' }}>
                      #{String(i + 1).padStart(2, '0')}
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '15px', letterSpacing: '1px' }}>
                      {player.name}
                    </div>
                    {player.sold && (
                      <div style={{ color: '#CC2200', fontSize: '11px', marginTop: '8px', fontWeight: '700' }}>
                        SOLD · ₹{player.soldPrice?.toLocaleString()}
                      </div>
                    )}
                    {!player.sold && (
                      <div style={{ color: '#00D4FF', fontSize: '11px', marginTop: '8px' }}>
                        BASE ₹200
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MVP AUCTION TAB */}
        {/* MVP AUCTION TAB */}
{activeTab === 'MVP' && (
  <>
    {/* Big Auction Box */}
    <div style={{
      background: '#0F1640',
      border: `2px solid ${auctionState === 'reveal' ? '#FFD700' : auctionState === 'spinning' ? 'rgba(255,165,0,0.6)' : 'rgba(255,215,0,0.2)'}`,
      borderRadius: '20px',
      padding: '56px 32px',
      marginBottom: '32px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '380px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'border-color 0.5s',
      boxShadow: auctionState === 'reveal'
        ? '0 0 60px rgba(255,215,0,0.25)'
        : auctionState === 'spinning'
        ? '0 0 60px rgba(255,165,0,0.15)'
        : 'none'
    }}>

      {/* Corner decorations */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', width: '32px', height: '32px', borderTop: '2px solid rgba(255,215,0,0.4)', borderLeft: '2px solid rgba(255,215,0,0.4)' }} />
      <div style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderTop: '2px solid rgba(255,215,0,0.4)', borderRight: '2px solid rgba(255,215,0,0.4)' }} />
      <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '32px', height: '32px', borderBottom: '2px solid rgba(255,215,0,0.4)', borderLeft: '2px solid rgba(255,215,0,0.4)' }} />
      <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '32px', height: '32px', borderBottom: '2px solid rgba(255,215,0,0.4)', borderRight: '2px solid rgba(255,215,0,0.4)' }} />

      {(() => {
        const mvpPlayers = players
          .filter(p => {
            const rank = parseInt(p.mvpRank)
            return !isNaN(rank) && rank <= 20
          })
          .sort((a, b) => parseInt(a.mvpRank) - parseInt(b.mvpRank))

          const unsoldMvp = mvpPlayers.filter(p => !p.sold && !p.unsoldFlag)

        if (auctionState === 'idle') return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '64px' }}>🏆</div>
            <div style={{
              color: '#FFD700',
              fontSize: '26px',
              fontWeight: '700',
              letterSpacing: '4px'
            }}>MVP AUCTION</div>
            <div style={{ color: '#8899CC', fontSize: '15px' }}>
              <strong style={{ color: '#FFD700' }}>{unsoldMvp.length}</strong> MVP players available
            </div>
            <button
              onClick={() => {
                let availableMvp = unsoldMvp
                if (availableMvp.length === 0) {
                  const unsoldFlaggedMvp = players.filter(p => {
                    const rank = parseInt(p.mvpRank)
                    return !isNaN(rank) && rank <= 20 && !p.sold && p.unsoldFlag
                  })
                  if (unsoldFlaggedMvp.length === 0) { alert('All MVP players have been auctioned!'); return }
                  // Release unsold MVP players back into pool
                  const released = players.map(p => {
                    const rank = parseInt(p.mvpRank)
                    if (!isNaN(rank) && rank <= 20 && !p.sold && p.unsoldFlag) {
                      return { ...p, unsoldFlag: false }
                    }
                    return p
                  })
                  storage.setPlayers(released)
                  setPlayers(released)
                  playersRef.current = released
                  availableMvp = released.filter(p => {
                    const rank = parseInt(p.mvpRank)
                    return !isNaN(rank) && rank <= 20 && !p.sold && !p.unsoldFlag
                  })
                }
                const finalPlayer = availableMvp[Math.floor(Math.random() * availableMvp.length)]
                setAuctionState('spinning')
                setCurrentPlayer(null)

                const speeds = [
                  ...Array(15).fill(50),
                  ...Array(10).fill(80),
                  ...Array(8).fill(130),
                  ...Array(6).fill(200),
                  ...Array(4).fill(320),
                  ...Array(3).fill(500),
                ]
                let step = 0

                const runMvpStep = () => {
                    if (step < speeds.length) {
                      const stepsLeft = speeds.length - step
                      const rnd = stepsLeft <= 3
                        ? finalPlayer
                        : availableMvp[Math.floor(Math.random() * availableMvp.length)]
                                              setDisplayName(rnd.name)
                    const progress = step / speeds.length
                    const freq = progress < 0.5 ? 400 + Math.random() * 200 : progress < 0.8 ? 600 + Math.random() * 300 : 900 + Math.random() * 400
                    playTick(progress)         
                               step++
                    intervalRef.current = setTimeout(runMvpStep, speeds[step - 1])
                  } else {
                    setDisplayName(finalPlayer.name)
                    setCurrentPlayer(finalPlayer)
                    setAuctionState('reveal')
                    playReveal()
                    let cd = 3
                    setCountdown(cd)
                    const cdInterval = setInterval(() => {
                      cd--
                      setCountdown(cd)
                      if (cd <= 0) { clearInterval(cdInterval); router.push(`/player/${finalPlayer.id}`) }
                    }, 1000)
                  }
                }
                runMvpStep()
              }}
              style={{
                marginTop: '12px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: 'none',
                borderRadius: '12px',
                padding: '18px 56px',
                color: '#0A0E2A',
                fontSize: '20px',
                fontWeight: '700',
                letterSpacing: '4px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 0 40px rgba(255,215,0,0.5)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 60px rgba(255,215,0,0.8)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(255,215,0,0.5)'}
            >
              ⚡ START MVP AUCTION
            </button>
          </div>
        )

        if (auctionState === 'spinning') return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ color: '#FFD700', fontSize: '12px', letterSpacing: '5px', fontWeight: '700', animation: 'blink 0.8s infinite' }}>
              ● SELECTING MVP
            </div>
            <div style={{
              background: '#0A0E2A',
              border: '2px solid #FFD700',
              borderRadius: '16px',
              padding: '28px 64px',
              minWidth: '400px',
              boxShadow: '0 0 40px rgba(255,215,0,0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: '-100%',
                width: '60%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.15), transparent)',
                animation: 'shimmer 0.6s linear infinite'
              }} />
              <div style={{
                color: '#FFD700',
                fontSize: '34px',
                fontWeight: '900',
                letterSpacing: '2px',
                textShadow: '0 0 20px rgba(255,215,0,0.9)',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>{displayName || '...'}</div>
            </div>
          </div>
        )

        if (auctionState === 'reveal' && currentPlayer) return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ color: '#FFD700', fontSize: '13px', letterSpacing: '5px', fontWeight: '700' }}>
              🏆 MVP SELECTED
            </div>
            <div style={{
              background: '#0A0E2A',
              border: '2px solid #FFD700',
              borderRadius: '20px',
              padding: '36px 72px',
              boxShadow: '0 0 60px rgba(255,215,0,0.5)',
              animation: 'popIn 0.5s ease'
            }}>
              <div style={{ color: '#8899CC', fontSize: '11px', letterSpacing: '4px', marginBottom: '8px' }}>MVP RANK</div>
              <div style={{
                color: '#FFD700',
                fontSize: '28px',
                fontWeight: '900',
                marginBottom: '12px'
              }}>#{currentPlayer.mvpRank}</div>
              <div style={{
                color: '#fff',
                fontSize: '44px',
                fontWeight: '900',
                letterSpacing: '3px',
                textShadow: '0 0 30px rgba(255,215,0,0.6)',
                lineHeight: '1'
              }}>{currentPlayer.name.toUpperCase()}</div>
              <div style={{
                width: '80px', height: '3px',
                background: '#FFD700',
                margin: '16px auto 0',
                boxShadow: '0 0 10px rgba(255,215,0,0.8)'
              }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#8899CC', fontSize: '14px' }}>
              <span>Opening profile in</span>
              <span style={{ color: '#FFD700', fontSize: '28px', fontWeight: '900' }}>{countdown}</span>
              <span>seconds</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => router.push(`/player/${currentPlayer.id}`)}
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  border: 'none', borderRadius: '8px',
                  padding: '12px 32px', color: '#0A0E2A',
                  fontSize: '14px', fontWeight: '700',
                  letterSpacing: '2px', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >GO NOW →</button>
              <button
                onClick={resetAuction}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px', padding: '8px 24px',
                  color: '#8899CC', fontSize: '12px',
                  letterSpacing: '2px', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >PICK ANOTHER</button>
            </div>
          </div>
        )

        return null
      })()}
    </div>

    {/* MVP Players List */}
    <div style={{ marginBottom: '16px' }}>
      <div style={{ color: '#FFD700', fontSize: '13px', letterSpacing: '3px', fontWeight: '700', marginBottom: '16px' }}>
        🏆 TOP 20 MVP PLAYERS
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {players
          .filter(p => {
            const rank = parseInt(p.mvpRank)
            return !isNaN(rank) && rank <= 20
          })
          .sort((a, b) => parseInt(a.mvpRank) - parseInt(b.mvpRank))
          .map((player) => (
            <div
              key={player.id}
              onClick={() => router.push(`/player/${player.id}`)}
              style={{
                background: player.sold ? '#1a1200' : '#0F1640',
                border: `1px solid ${player.sold ? '#FFD700' : 'rgba(255,215,0,0.2)'}`,
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,215,0,0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* MVP Rank badge */}
              <div style={{
                position: 'absolute', top: '12px', right: '12px',
                background: 'rgba(255,215,0,0.15)',
                border: '1px solid rgba(255,215,0,0.4)',
                borderRadius: '6px',
                padding: '3px 8px',
                color: '#FFD700',
                fontSize: '11px',
                fontWeight: '700'
              }}>#{player.mvpRank}</div>

              <div style={{ color: '#8899CC', fontSize: '11px', marginBottom: '8px' }}>
                MVP RANK {player.mvpRank}
              </div>
              <div style={{ fontWeight: '700', fontSize: '15px', letterSpacing: '1px', paddingRight: '40px' }}>
                {player.name}
              </div>
              <div style={{
                width: '30px', height: '2px',
                background: '#FFD700',
                margin: '8px 0'
              }} />
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#8899CC' }}>
                <span>RUNS: <strong style={{ color: '#fff' }}>{player.runs || 'NA'}</strong></span>
                <span>WKT: <strong style={{ color: '#fff' }}>{player.wickets || 'NA'}</strong></span>
              </div>
              {player.sold && (
                <div style={{ color: '#FFD700', fontSize: '11px', marginTop: '8px', fontWeight: '700' }}>
                  SOLD · ₹{player.soldPrice?.toLocaleString()}
                </div>
              )}
              {!player.sold && (
                <div style={{ color: 'rgba(255,215,0,0.5)', fontSize: '11px', marginTop: '8px' }}>
                  BASE ₹200
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  </>
)}

      </div>
      <TeamBar />
    </div>
  )
}