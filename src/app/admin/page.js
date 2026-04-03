'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'
import { DEFAULT_COINS } from '@/lib/teams'
import Navbar from '@/components/Navbar'

export default function AdminPage() {
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!storage.getAuth()) { router.push('/'); return }
    setTeams(storage.getTeams())
    setPlayers(storage.getPlayers())
  }, [])

  const updateCoins = (id, val) => {
    setTeams(prev => prev.map(t =>
      t.id === id ? { ...t, coins: parseInt(val) || 0 } : t
    ))
  }

  const handleSave = () => {
    storage.setTeams(teams)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = () => {
    if (!confirm('Reset ALL auction data? This cannot be undone.')) return
    const resetTeams = teams.map(t => ({
      ...t,
      coins: DEFAULT_COINS,
      players: []
    }))
    const resetPlayers = players.map(p => ({
      ...p,
      sold: false,
      soldTo: null,
      soldPrice: null
    }))
    storage.setTeams(resetTeams)
    storage.setPlayers(resetPlayers)
    setTeams(resetTeams)
    setPlayers(resetPlayers)
    alert('✅ Auction reset complete!')
  }

  const soldCount = players.filter(p => p.sold).length
  const totalSpent = teams.reduce((acc, t) => acc + (DEFAULT_COINS - (t.coins || 0)), 0)

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E2A' }}>
      <Navbar title="ADMIN PANEL" />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ color: '#FFA500', fontSize: '12px', letterSpacing: '4px', marginBottom: '8px' }}>
            ADMIN CONTROL CENTER
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '2px' }}>
            AUCTION MANAGER
          </h1>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'TOTAL PLAYERS', value: players.length, color: '#00D4FF' },
            { label: 'SOLD', value: soldCount, color: '#CC2200' },
            { label: 'UNSOLD', value: players.length - soldCount, color: '#FFA500' },
            { label: 'TOTAL SPENT', value: `₹${totalSpent.toLocaleString()}`, color: '#00FF88' }
          ].map(s => (
            <div key={s.label} style={{
              background: '#0F1640',
              border: `1px solid ${s.color}33`,
              borderLeft: `4px solid ${s.color}`,
              borderRadius: '8px',
              padding: '20px'
            }}>
              <div style={{ color: '#8899CC', fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }}>
                {s.label}
              </div>
              <div style={{ color: s.color, fontSize: '32px', fontWeight: '700' }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Team Coin Manager */}
        <div style={{
          background: '#0F1640',
          borderRadius: '12px',
          padding: '28px',
          marginBottom: '24px',
          border: '1px solid rgba(0,212,255,0.2)'
        }}>
          <div style={{
            color: '#00D4FF',
            fontSize: '13px',
            letterSpacing: '3px',
            fontWeight: '700',
            marginBottom: '20px'
          }}>TEAM COIN MANAGER</div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '12px'
          }}>
            {teams.map(team => (
              <div key={team.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#0A0E2A',
                borderRadius: '8px',
                padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{
                  width: '10px', height: '10px',
                  borderRadius: '50%',
                  background: team.color,
                  flexShrink: 0
                }} />
                <div style={{ flex: 1, fontSize: '14px', fontWeight: '600' }}>
                  {team.name}
                  <div style={{ color: '#8899CC', fontSize: '11px', marginTop: '2px' }}>
                    {(team.players || []).length}/8 players
                  </div>
                </div>
                <input
                  type="number"
                  value={team.coins || 0}
                  onChange={e => updateCoins(team.id, e.target.value)}
                  style={{
                    width: '100px',
                    background: '#0F1640',
                    border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    color: '#00D4FF',
                    fontWeight: '700',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    textAlign: 'right'
                  }}
                />
              </div>
            ))}
          </div>

          {saved && (
            <div style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.4)',
              borderRadius: '8px',
              padding: '12px',
              color: '#00D4FF',
              textAlign: 'center',
              fontWeight: '700',
              marginTop: '16px'
            }}>✅ TEAM COINS SAVED!</div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={handleSave}
              style={{
                background: '#00D4FF',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 28px',
                color: '#0A0E2A',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '2px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >SAVE SETTINGS</button>

            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: '1px solid #CC2200',
                borderRadius: '8px',
                padding: '12px 28px',
                color: '#CC2200',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '2px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >⚠ RESET AUCTION</button>
          </div>
        </div>

        {/* Team Rosters */}
        <div style={{
          background: '#0F1640',
          borderRadius: '12px',
          padding: '28px',
          border: '1px solid rgba(0,212,255,0.2)'
        }}>
          <div style={{
            color: '#00D4FF',
            fontSize: '13px',
            letterSpacing: '3px',
            fontWeight: '700',
            marginBottom: '20px'
          }}>TEAM ROSTERS</div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {teams.map(team => (
              <div key={team.id} style={{
                background: '#0A0E2A',
                borderRadius: '8px',
                padding: '16px',
                borderLeft: `3px solid ${team.color}`
              }}>
                <div style={{
                  fontWeight: '700',
                  fontSize: '15px',
                  marginBottom: '4px',
                  color: team.color
                }}>{team.name}</div>
                <div style={{
                  color: '#8899CC',
                  fontSize: '12px',
                  marginBottom: '12px'
                }}>
                  {(team.players || []).length}/8 players •
                  ₹{(team.coins || 0).toLocaleString()} remaining
                </div>
                {(team.players || []).length === 0 ? (
                  <div style={{ color: '#8899CC', fontSize: '13px', fontStyle: 'italic' }}>
                    No players yet
                  </div>
                ) : (
                  (team.players || []).map((name, i) => (
                    <div key={i} style={{
                      padding: '6px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      fontSize: '13px',
                      color: '#fff'
                    }}>
                      {i + 1}. {name}
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}