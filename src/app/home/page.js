'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'
import { TEAMS, DEFAULT_COINS } from '@/lib/teams'
import { CPL_PLAYERS } from '@/lib/players'
import PlayerCard from '@/components/PlayerCard'
import Navbar from '@/components/Navbar'
import TeamBar from '@/components/TeamBar'

export default function HomePage() {
  const [players, setPlayers] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!storage.getAuth()) { router.push('/'); return }

    const saved = storage.getPlayers()
    if (saved && saved.length > 0) {
      setPlayers(saved)
    } else {
      storage.setPlayers(CPL_PLAYERS)
      setPlayers(CPL_PLAYERS)
    }

    const savedTeams = storage.getTeams()
    if (!savedTeams.length) {
      const initTeams = TEAMS.map(t => ({ ...t, coins: DEFAULT_COINS, players: [] }))
      storage.setTeams(initTeams)
    }
  }, [])

  const filtered = players.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    if (filter === 'SOLD') return p.sold && matchSearch
    if (filter === 'UNSOLD') return !p.sold && matchSearch
    return matchSearch
  })

  const soldCount = players.filter(p => p.sold).length
  const unsoldCount = players.filter(p => !p.sold).length

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E2A' }}>
      <Navbar title="PLAYER INDEX" />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{
              color: '#00D4FF',
              fontSize: '12px',
              letterSpacing: '4px',
              marginBottom: '8px'
            }}>CLUBLIFE PREMIER LEAGUE</div>
            <h1 style={{
              fontSize: '40px',
              fontWeight: '700',
              letterSpacing: '2px',
              lineHeight: '1'
            }}>PLAYER AUCTION</h1>
            <div style={{
              display: 'flex',
              gap: '24px',
              marginTop: '12px',
              fontSize: '14px',
              color: '#8899CC'
            }}>
              <span>TOTAL: <strong style={{ color: '#fff' }}>{players.length}</strong></span>
              <span>SOLD: <strong style={{ color: '#CC2200' }}>{soldCount}</strong></span>
              <span>UNSOLD: <strong style={{ color: '#00D4FF' }}>{unsoldCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="🔍 Search player..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              background: '#0F1640',
              border: '1px solid rgba(0,212,255,0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '15px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          {['ALL', 'UNSOLD', 'SOLD'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f
                  ? (f === 'SOLD' ? '#CC2200' : '#00D4FF')
                  : 'transparent',
                border: `1px solid ${f === 'SOLD' ? '#CC2200' : '#00D4FF'}`,
                borderRadius: '8px',
                padding: '12px 20px',
                color: filter === f ? '#fff' : (f === 'SOLD' ? '#CC2200' : '#00D4FF'),
                fontSize: '13px',
                fontWeight: '700',
                letterSpacing: '2px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >{f}</button>
          ))}
        </div>

        {/* Players Grid */}
        {players.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#8899CC'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>🏏</div>
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              NO PLAYERS LOADED
            </div>
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
  >
    <div style={{ color: '#8899CC', fontSize: '11px', marginBottom: '8px' }}>
      #{String(i + 1).padStart(2, '0')}
    </div>
    <div style={{ fontWeight: '700', fontSize: '15px', letterSpacing: '1px' }}>
      {player.name}
    </div>
    {player.sold && (
      <div style={{ color: '#CC2200', fontSize: '11px', marginTop: '8px', fontWeight: '700' }}>
        SOLD · ₹{player.soldPrice}
      </div>
    )}
  </div>
))}
          </div>
        )}

        {filtered.length === 0 && players.length > 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#8899CC' }}>
            No players found for "{search}"
          </div>
        )}
      </div>

      <TeamBar />
    </div>
  )
}