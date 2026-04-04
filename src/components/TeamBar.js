'use client'
import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'

export default function TeamBar() {
  const [teams, setTeams] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setTeams(storage.getTeams())
  }, [])

  if (!teams.length) return null

  return (
    <>
      {/* Toggle button */}
     

      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          background: '#0F1640',
          border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: '12px',
          padding: '20px',
          zIndex: 199,
          width: '280px',
          maxHeight: '400px',
          overflowY: 'auto',
          boxShadow: '0 0 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            color: '#00D4FF',
            fontSize: '12px',
            letterSpacing: '3px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>TEAM BALANCES</div>

          {teams.map(team => (
            <div key={team.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div>
                <div style={{
                  width: '8px', height: '8px',
                  borderRadius: '50%',
                  background: team.color,
                  display: 'inline-block',
                  marginRight: '8px'
                }} />
                <span style={{ fontSize: '13px', fontWeight: '600' }}>
                  {team.name}
                </span>
              </div>
              <div style={{
                color: team.coins < 3000 ? '#FF6B6B' : '#00D4FF',
                fontWeight: '700',
                fontSize: '14px'
              }}>
                ₹{team.coins?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}