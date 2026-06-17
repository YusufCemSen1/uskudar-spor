import React from 'react'

export default function Pagination({ page, total, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: page === 1 ? '#f5f5f5' : '#fff', cursor: page === 1 ? 'default' : 'pointer', color: page === 1 ? '#aaa' : 'var(--text)', fontWeight: 600, fontSize: 13 }}
      >← Önceki</button>
      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)}
          style={{ padding: '7px 13px', borderRadius: 8, border: '1.5px solid', borderColor: p === page ? 'var(--green)' : 'var(--border)', background: p === page ? 'var(--green)' : '#fff', color: p === page ? '#fff' : 'var(--text)', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all .2s' }}
        >{p}</button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: page === totalPages ? '#f5f5f5' : '#fff', cursor: page === totalPages ? 'default' : 'pointer', color: page === totalPages ? '#aaa' : 'var(--text)', fontWeight: 600, fontSize: 13 }}
      >Sonraki →</button>
    </div>
  )
}
