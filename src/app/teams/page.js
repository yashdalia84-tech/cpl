'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'
import { TEAMS, DEFAULT_COINS, PLAYERS_PER_TEAM } from '@/lib/teams'
import Navbar from '@/components/Navbar'
import TeamBar from '@/components/TeamBar'

export default function TeamsPage() {
    const router = useRouter()
    const [teams, setTeams] = useState([])
    const [players, setPlayers] = useState([])

    useEffect(() => {
        if (!storage.getAuth()) { router.push('/'); return }
        const savedTeams = storage.getTeams()
        const savedPlayers = storage.getPlayers()
        setTeams(savedTeams.length ? savedTeams : TEAMS.map(t => ({ ...t, coins: DEFAULT_COINS, players: [] })))
        setPlayers(savedPlayers || [])
    }, [])

    const enriched = teams.map(team => {
        const soldPlayers = players.filter(p => p.sold && p.soldTo === team.name)
        const spent = soldPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0)
        const remaining = (team.coins ?? DEFAULT_COINS)
        return { ...team, soldPlayers, spent, remaining }
    })

    const totalSold = players.filter(p => p.sold).length

    return (
        <div style={{ minHeight: '100vh', background: '#0A0E2A' }}>
            <Navbar title="TEAM SQUADS" />

            <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '28px 20px 100px' }}>

                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: '28px',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <div>
                        <div style={{
                            color: '#8899CC',
                            fontSize: '11px',
                            letterSpacing: '4px',
                            marginBottom: '6px'
                        }}>CLUBLIFE PREMIER LEAGUE • SEASON 4</div>
                        <div style={{
                            color: '#fff',
                            fontSize: '32px',
                            fontWeight: '900',
                            letterSpacing: '3px'
                        }}>TEAM SQUADS</div>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
                        <span style={{ color: '#8899CC' }}>TEAMS <strong style={{ color: '#fff' }}>{teams.length}</strong></span>
                        <span style={{ color: '#8899CC' }}>SOLD <strong style={{ color: '#CC2200' }}>{totalSold}</strong></span>
                        <span style={{ color: '#8899CC' }}>AVAILABLE <strong style={{ color: '#00D4FF' }}>{players.length - totalSold}</strong></span>
                    </div>
                </div>

                {/* 10-column grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))',
                    gap: '10px',
                    alignItems: 'start',
                    overflowX: 'auto'
                }}>
                    {enriched.map(team => (
                        <TeamColumn key={team.id} team={team} router={router} />
                    ))}
                </div>
            </div>

            <TeamBar />
        </div>
    )
}

function TeamColumn({ team, router }) {
    const filled = team.soldPlayers.length
    const total = PLAYERS_PER_TEAM
    const pct = Math.round((filled / total) * 100)
    const isFull = filled >= total

    return (
        <div style={{
            background: '#0F1640',
            border: `1px solid ${team.color}33`,
            borderTop: `3px solid ${team.color}`,
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '120px'
        }}>

            {/* Team Header */}
            <div style={{
                padding: '14px 10px 12px',
                background: `${team.color}10`,
                borderBottom: `1px solid ${team.color}22`,
                textAlign: 'center'
            }}>
                {/* Circle badge */}
                {/* Team Logo */}
                {/* Team Logo */}
                <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src={`/images/${team.name}.png`}
                        alt={team.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}
                        onError={e => {
                            e.target.style.display = 'none'
                            e.target.parentNode.innerHTML = `<span style="font-size:14px;font-weight:900;color:${team.color}">${team.shortName}</span>`
                        }}
                    />
                </div>

                {/* Team name */}
                <div style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '20px',
                    letterSpacing: '1px',
                    lineHeight: '1.3',
                    marginBottom: '10px'
                }}>{team.name.toUpperCase()}</div>

                {/* Progress bar */}
                <div style={{
                    height: '8px', background: 'rgba(255,255,255,0.08)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '8px'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: isFull ? '#00FF88' : team.color,
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                        boxShadow: `0 0 6px ${team.color}`
                    }} />
                </div>

                {/* Slots & coins */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    letterSpacing: '0.5px'
                }}>
                    <span style={{ color: isFull ? '#00FF88' : team.color, fontWeight: '700' }}>
                        {filled}/{total}
                    </span>
                    <span style={{ color: '#8899CC' }}>
                        ₹{(team.remaining).toFixed(0)}
                    </span>
                </div>
            </div>

            {/* Player slots */}
            <div style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: '5px' }}>

                {/* Sold players */}
                {team.soldPlayers.map((p, i) => (
                   <div
                   key={p.id}
                   style={{
                     background: `${team.color}12`,
                     border: `1px solid ${team.color}35`,
                     borderRadius: '6px',
                     padding: '12px 14px',
                     transition: 'all 0.15s',
                     position: 'relative'
                   }}
                   onMouseEnter={e => {
                     e.currentTarget.style.background = `${team.color}25`
                     e.currentTarget.style.borderColor = team.color
                     e.currentTarget.querySelector('.remove-btn').style.opacity = '1'
                   }}
                   onMouseLeave={e => {
                     e.currentTarget.style.background = `${team.color}12`
                     e.currentTarget.style.borderColor = `${team.color}35`
                     e.currentTarget.querySelector('.remove-btn').style.opacity = '0'
                   }}
                 >
                   {/* Remove button */}
                   <button
                     className="remove-btn"
                     onClick={(e) => {
                       e.stopPropagation()
                       if (!confirm(`Remove ${p.name} from ${team.name}?`)) return
                 
                       // Refund coins to team
                       const allTeams = storage.getTeams()
                       const updatedTeams = allTeams.map(t => {
                         if (t.name === team.name) {
                           return {
                             ...t,
                             coins: t.coins + p.soldPrice,
                             players: (t.players || []).filter(n => n !== p.name)
                           }
                         }
                         return t
                       })
                       storage.setTeams(updatedTeams)
                 
                       // Mark player as unsold
                       const allPlayers = storage.getPlayers()
                       const updatedPlayers = allPlayers.map(pl =>
                         pl.id === p.id
                           ? { ...pl, sold: false, soldTo: null, soldPrice: null }
                           : pl
                       )
                       storage.setPlayers(updatedPlayers)
                 
                       // Refresh page state
                       setTeams(storage.getTeams())
                       setPlayers(storage.getPlayers())
                     }}
                     style={{
                       position: 'absolute',
                       top: '6px',
                       right: '6px',
                       background: 'rgba(204,34,0,0.8)',
                       border: 'none',
                       borderRadius: '4px',
                       width: '18px',
                       height: '18px',
                       color: '#fff',
                       fontSize: '11px',
                       fontWeight: '700',
                       cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       opacity: '0',
                       transition: 'opacity 0.2s',
                       zIndex: 10,
                       lineHeight: '1',
                       padding: '0'
                     }}
                   >✕</button>
                 
                   {/* Click to view */}
                   <div
                     onClick={() => router.push(`/player/${p.id}`)}
                     style={{ cursor: 'pointer' }}
                   >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                            {(() => {
                                const rank = parseInt(p.mvpRank)
                                const isMvp = !isNaN(rank) && rank <= 20
                                return isMvp ? (
                                    <span style={{
                                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                        color: '#0A0E2A',
                                        fontSize: '8px',
                                        fontWeight: '900',
                                        padding: '1px 5px',
                                        borderRadius: '4px',
                                        letterSpacing: '0.5px',
                                        flexShrink: 0
                                    }}>MVP#{rank}</span>
                                ) : null
                            })()}
                            <div style={{
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: '1.3',
                            }}>{p.name}</div>
                        </div>
                        <div style={{
                            color: team.color,
                            fontSize: '15px',
                            fontWeight: '700'
                        }}>₹{p.soldPrice?.toLocaleString()}</div>
                        </div>
                      </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: PLAYERS_PER_TEAM - filled }).map((_, i) => (
                    <div key={`empty-${i}`} style={{
                        border: '1px dashed rgba(255,255,255,0.07)',
                        borderRadius: '6px',
                        padding: '16px 8px', display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '13px' }}>
                            OPEN SLOT
                        </span>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{
                marginTop: 'auto',
                padding: '8px 10px',
                borderTop: `1px solid ${team.color}20`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span style={{ color: '#8899CC', fontSize: '15px', letterSpacing: '1px' }}>SPENT</span>
                <span style={{ color: '#FFA500', fontSize: '18px', fontWeight: '700' }}>
                    ₹{team.spent.toLocaleString()}
                </span>
            </div>
        </div>
    )
}