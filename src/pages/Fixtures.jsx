import React, { useState } from 'react'
import { useStore } from '../context/StoreContext'

const BRANCH_COLOR = { Futbol:'#00913A', Basketbol:'#006B2B', Voleybol:'#00B548', 'Masa Tenisi':'#004d20' }
const BRANCH_ICON  = { Futbol:'⚽', Basketbol:'🏀', Voleybol:'🏐', 'Masa Tenisi':'🏓' }
const ALL_BRANCHES = ['Tümü', 'Futbol', 'Basketbol', 'Voleybol', 'Masa Tenisi']
const ALL_STATUS   = ['Tümü', 'Yaklaşan', 'Oynandı', 'İptal']
const STATUS_MAP   = { upcoming: 'Yaklaşan', played: 'Oynandı', cancelled: 'İptal' }
const STATUS_COLOR = { upcoming: '#00913A', played: '#555', cancelled: '#c0392b' }

export default function Fixtures() {
  const { fixtures } = useStore()
  const [branch, setBranch] = useState('Tümü')
  const [status, setStatus] = useState('Tümü')

  const filtered = fixtures
    .filter(f => branch === 'Tümü' || f.branch === branch)
    .filter(f => status === 'Tümü' || STATUS_MAP[f.status] === status)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const upcoming = filtered.filter(f => f.status === 'upcoming')
  const played   = filtered.filter(f => f.status !== 'upcoming')

  return (
    <div>
      <div className="page-header" style={{ minHeight: 240 }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.7)', letterSpacing: 3, marginBottom: 8 }} className="anim-trackIn">MAÇLAR</div>
          <h1 className="anim-trackIn delay-1">📅 Fikstür</h1>
          <p className="anim-trackIn delay-2">Yaklaşan ve geçmiş maç programı</p>
        </div>
      </div>

      <div className="page-wrap">
        {/* Filtreler */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ALL_BRANCHES.map(b => (
              <button key={b} onClick={() => setBranch(b)}
                style={{ padding: '7px 16px', borderRadius: 20, border: `1px solid ${branch === b ? 'var(--green)' : 'var(--border)'}`, background: branch === b ? 'var(--green)' : '#fff', color: branch === b ? '#fff' : 'var(--text)', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .2s' }}>
                {b !== 'Tümü' && BRANCH_ICON[b]} {b}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {ALL_STATUS.map(s => (
              <button key={s} onClick={() => setStatus(s)}
                style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${status === s ? '#333' : 'var(--border)'}`, background: status === s ? '#333' : '#fff', color: status === s ? '#fff' : 'var(--text)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: 16, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <p>Seçilen filtreye uygun maç bulunamadı.</p>
          </div>
        )}

        {/* Yaklaşan maçlar */}
        {upcoming.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ background: 'var(--green)', color: '#fff', fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>YAKLAŞAN</span>
            </h2>
            <div style={{ display: 'grid', gap: 14 }}>
              {upcoming.map(f => <FixtureCard key={f.id} f={f} />)}
            </div>
          </section>
        )}

        {/* Oynanan maçlar */}
        {played.length > 0 && (
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ background: '#555', color: '#fff', fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>GEÇMİŞ MAÇLAR</span>
            </h2>
            <div style={{ display: 'grid', gap: 14 }}>
              {played.map(f => <FixtureCard key={f.id} f={f} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function FixtureCard({ f }) {
  const color = BRANCH_COLOR[f.branch] || '#00913A'
  const icon  = BRANCH_ICON[f.branch] || '🏅'
  const isHome = f.homeTeam?.includes('Üsküdar')
  const isPlayed = f.status === 'played'

  const dateStr = f.date ? new Date(f.date + 'T00:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,.05)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '4px 1fr', transition: 'box-shadow .2s' }}
      onMouseOver={e => e.currentTarget.style.boxShadow = `0 6px 24px ${color}22`}
      onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.05)'}>
      {/* Sol renk çizgisi */}
      <div style={{ background: color }} />
      <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        {/* Branş + Tarih */}
        <div style={{ minWidth: 100, flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: color, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{icon} {f.branch}</div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{dateStr}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{f.time && `⏰ ${f.time}`}</div>
        </div>

        {/* Takımlar */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right', flex: 1, minWidth: 100 }}>
            <div style={{ fontWeight: isHome ? 900 : 700, fontSize: 15, color: isHome ? color : 'var(--text)' }}>{f.homeTeam}</div>
            {isHome && <div style={{ fontSize: 10, color: color, fontWeight: 700, marginTop: 2 }}>EV SAHİBİ</div>}
          </div>

          {isPlayed && f.result ? (
            <div style={{ background: '#1a1a1a', color: '#fff', borderRadius: 8, padding: '6px 16px', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>
              {f.result}
            </div>
          ) : (
            <div style={{ background: `${color}18`, color, borderRadius: 8, padding: '6px 16px', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>
              VS
            </div>
          )}

          <div style={{ textAlign: 'left', flex: 1, minWidth: 100 }}>
            <div style={{ fontWeight: !isHome ? 900 : 700, fontSize: 15, color: !isHome ? color : 'var(--text)' }}>{f.awayTeam}</div>
            {!isHome && <div style={{ fontSize: 10, color: color, fontWeight: 700, marginTop: 2 }}>EV SAHİBİ</div>}
          </div>
        </div>

        {/* Sağ: yer + müsabaka */}
        <div style={{ minWidth: 140, flexShrink: 0, textAlign: 'right' }}>
          {f.competition && <div style={{ fontSize: 11, background: `${color}18`, color, padding: '3px 10px', borderRadius: 20, fontWeight: 700, display: 'inline-block', marginBottom: 6 }}>{f.competition}</div>}
          {f.location && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {f.location}</div>}
          <div style={{ marginTop: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[f.status] || '#555', background: `${STATUS_COLOR[f.status]}18`, padding: '2px 10px', borderRadius: 20 }}>
              {STATUS_MAP[f.status] || f.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
