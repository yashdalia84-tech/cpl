'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = () => {
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (username === 'admin' && password === 'admin2001') {
        storage.setAuth(true)
        router.push('/home')
      } else {
        setError('Invalid credentials. Try again.')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0E2A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative shapes */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px',
        background: 'rgba(0,212,255,0.05)',
        transform: 'rotate(45deg)',
        borderRadius: '40px'
      }} />
      <div style={{
        position: 'absolute', bottom: '-150px', left: '-100px',
        width: '500px', height: '300px',
        background: 'rgba(204,34,0,0.07)',
        transform: 'rotate(-30deg)',
        borderRadius: '40px'
      }} />
      <div style={{
        position: 'absolute', top: '20%', left: '5%',
        width: '200px', height: '200px',
        background: 'rgba(0,212,255,0.03)',
        transform: 'rotate(20deg)',
        borderRadius: '20px'
      }} />

      {/* Login Card */}
      <div className="fade-in" style={{
        background: '#0F1640',
        border: '1px solid rgba(0,212,255,0.3)',
        borderRadius: '16px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 0 40px rgba(0,212,255,0.15)'
      }}>
        {/* CPL Badge */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-block',
            background: '#CC2200',
            padding: '6px 20px',
            borderRadius: '4px',
            marginBottom: '12px'
          }}>
            <span style={{
              fontSize: '28px',
              fontWeight: '700',
              letterSpacing: '4px',
              color: '#fff'
            }}>CPL</span>
          </div>
          <div style={{
            color: '#00D4FF',
            fontSize: '13px',
            letterSpacing: '3px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>SEASON 4</div>
          <div style={{
            color: '#fff',
            fontSize: '20px',
            fontWeight: '700',
            letterSpacing: '2px'
          }}>AUCTION PORTAL</div>
          <div style={{
            width: '60px', height: '3px',
            background: '#00D4FF',
            margin: '12px auto 0'
          }} />
        </div>

        {/* Fields */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            color: '#8899CC',
            fontSize: '12px',
            letterSpacing: '2px',
            marginBottom: '8px',
            fontWeight: '600'
          }}>USERNAME</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter username"
            style={{
              width: '100%',
              background: '#0A0E2A',
              border: '1px solid rgba(0,212,255,0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '16px',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#00D4FF'}
            onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.3)'}
          />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={{
            display: 'block',
            color: '#8899CC',
            fontSize: '12px',
            letterSpacing: '2px',
            marginBottom: '8px',
            fontWeight: '600'
          }}>PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter password"
            style={{
              width: '100%',
              background: '#0A0E2A',
              border: '1px solid rgba(0,212,255,0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '16px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            onFocus={e => e.target.style.borderColor = '#00D4FF'}
            onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.3)'}
          />
        </div>

        {error && (
          <div style={{
            background: 'rgba(204,34,0,0.15)',
            border: '1px solid rgba(204,34,0,0.5)',
            borderRadius: '8px',
            padding: '10px 16px',
            color: '#FF6B6B',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>{error}</div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#333' : '#CC2200',
            border: 'none',
            borderRadius: '8px',
            padding: '14px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '3px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
            boxShadow: loading ? 'none' : '0 0 20px rgba(204,34,0,0.4)'
          }}
        >
          {loading ? 'LOGGING IN...' : 'LOGIN →'}
        </button>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#8899CC',
          fontSize: '12px',
          letterSpacing: '1px'
        }}>
          CLUBLIFE PREMIER LEAGUE • SEASON 4
        </div>
      </div>
    </div>
  )
}