'use client'
import { useRouter } from 'next/navigation'

export default function PlayerCard({ player, index }) {
  const router = useRouter()
  const nameParts = player.name.trim().split(' ')
  const lastName = nameParts[nameParts.length - 1]

  return (
    <div
      onClick={() => router.push(`/player/${player.id}`)}
      style={{
        background: '#0F1640',
        border: player.sold
          ? '1px solid rgba(204,34,0,0.5)'
          : '1px solid rgba(0,212,255,0.2)',
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = player.sold
          ? '0 8px 24px rgba(204,34,0,0.3)'
          : '0 8px 24px rgba(0,212,255,0.25)'
        e.currentTarget.style.borderColor = player.sold ? '#CC2200' : '#00D4FF'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = player.sold
          ? 'rgba(204,34,0,0.5)'
          : 'rgba(0,212,255,0.2)'
      }}
    >
      {/* Sold ribbon */}
      {player.sold && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '-24px',
          background: '#CC2200',
          color: '#fff',
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '2px',
          padding: '4px 32px',
          transform: 'rotate(45deg)',
        }}>SOLD</div>
      )}

      {/* Player number */}
      <div style={{
        color: 'rgba(0,212,255,0.4)',
        fontSize: '12px',
        letterSpacing: '2px',
        marginBottom: '8px'
      }}>#{String(index + 1).padStart(2, '0')}</div>

      {/* Name */}
      <div style={{
        fontSize: '20px',
        fontWeight: '700',
        color: '#fff',
        letterSpacing: '1px',
        marginBottom: '4px',
        lineHeight: '1.2'
      }}>{player.name.toUpperCase()}</div>

      {/* Divider */}
      <div style={{
        width: '40px', height: '2px',
        background: '#00D4FF',
        margin: '10px 0'
      }} />

      {/* Stats row */}
      <div style={{
        display: 'flex',
        gap: '16px',
        fontSize: '12px',
        color: '#8899CC'
      }}>
        <span>RUNS: <strong style={{ color: '#fff' }}>{player.runs || 'NA'}</strong></span>
        <span>WKT: <strong style={{ color: '#fff' }}>{player.wickets || 'NA'}</strong></span>
      </div>

      {/* Sold info */}
      {player.sold && (
        <div style={{
          marginTop: '12px',
          background: 'rgba(204,34,0,0.15)',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '12px',
          color: '#FF6B6B'
        }}>
          <div>{player.soldTo}</div>
          <div style={{ color: '#FFA500', fontWeight: '700' }}>
            ₹{player.soldPrice?.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}