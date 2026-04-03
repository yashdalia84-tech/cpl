export default function StatBox({ label, value }) {
    return (
      <div style={{
        background: '#0F1640',
        borderLeft: '4px solid #00D4FF',
        borderRadius: '0 8px 8px 0',
        padding: '20px 28px',
        marginBottom: '16px'
      }}>
        <div style={{
          color: '#8899CC',
          fontSize: '13px',
          letterSpacing: '3px',
          fontWeight: '600',
          marginBottom: '12px'
        }}>{label}</div>
        <div style={{
          color: '#FFFFFF',
          fontSize: '52px',
          fontWeight: '700',
          lineHeight: '1',
          letterSpacing: '2px'
        }}>{value || 'NA'}</div>
      </div>
    )
  }