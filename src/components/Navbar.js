'use client'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'

export default function Navbar({ title }) {
  const router = useRouter()

  const handleLogout = () => {
    storage.logout()
    router.push('/')
  }

  return (
    <nav style={{
      background: '#0F1640',
      borderBottom: '1px solid rgba(0,212,255,0.2)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          background: '#CC2200',
          padding: '4px 12px',
          borderRadius: '4px'
        }}>
          <span style={{
            fontWeight: '700',
            fontSize: '18px',
            letterSpacing: '3px'
          }}>CPL</span>
        </div>
        <div>
          <div style={{ color: '#00D4FF', fontSize: '10px', letterSpacing: '2px' }}>SEASON 4</div>
          <div style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '1px' }}>
            {title || 'AUCTION'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => router.push('/home')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(0,212,255,0.4)',
            borderRadius: '6px',
            padding: '8px 16px',
            color: '#00D4FF',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '1px',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          PLAYERS
        </button>
        <button
          onClick={() => router.push('/admin')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,165,0,0.4)',
            borderRadius: '6px',
            padding: '8px 16px',
            color: '#FFA500',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '1px',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          ADMIN
        </button>
        <button
  onClick={() => router.push('/teams')}
  style={{
    background: 'transparent',
    border: '1px solid rgba(0,212,255,0.4)',
    borderRadius: '6px',
    padding: '8px 16px',
    color: '#00D4FF',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1px',
    cursor: 'pointer',
    fontFamily: 'inherit'
  }}
>
  TEAMS
</button>
        <button
          onClick={handleLogout}
          style={{
            background: '#CC2200',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '1px',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          LOGOUT
        </button>
      </div>
    </nav>
  )
}