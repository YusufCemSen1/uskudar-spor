import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useSite } from '../context/SiteContext'

const BRANCH_STATIC = {
  futbol:     { icon: '⚽', name: 'Futbol',      color: '#00913A' },
  basketbol:  { icon: '🏀', name: 'Basketbol',   color: '#006B2B' },
  voleybol:      { icon: '🏐', name: 'Voleybol',       color: '#00B548' },
  masatenisi: { icon: '🏓', name: 'Masa Tenisi', color: '#004d20' },
}

const BRANCH_LABEL = {
  futbol: 'Futbol', basketbol: 'Basketbol', voleybol: 'Voleybol', masatenisi: 'Masa Tenisi',
}

export default function BranchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { news, players } = useStore()
  const { settings } = useSite()
  const [activeTeam, setActiveTeam] = useState(null)

  const stat = BRANCH_STATIC[id]
  if (!stat) return <div style={{ padding: 80, textAlign: 'center' }}>Branş bulunamadı. <Link to="/branslar">Geri dön</Link></div>

  const meta = { ...stat, ...(settings.branches?.[id] || {}) }
  const branchLabel = BRANCH_LABEL[id]
  const branchNews  = news.filter(n => n.published && n.category === branchLabel)
  const branchTeams = players.filter(t => t.branch === branchLabel)
  const displayTeams = activeTeam ? branchTeams.filter(t => t.id === activeTeam) : branchTeams

  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${meta.color}ee, ${meta.color}99, #0a1a0a)`, minHeight: 260, display: 'flex', alignItems: 'flex-end', padding: '0 0 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
        <div style={{ position: 'absolute', right: 80, top: 40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />
        <div style={{ fontSize: 100, position: 'absolute', right: 60, top: '50%', transform: 'translateY(-50%)', opacity: .18 }}>{meta.icon}</div>
        <div className="page-wrap" style={{ width: '100%', paddingTop: 100 }}>
          <button onClick={() => navigate('/branslar')} style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', marginBottom: 16, fontWeight: 700 }}>← Branşlar</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 52 }}>{meta.icon}</span>
            <div>
              <h1 style={{ color: '#fff', margin: 0, fontSize: 'clamp(28px,5vw,48px)', fontFamily: 'var(--font-display)' }}>{meta.name}</h1>
              <p style={{ color: 'rgba(255,255,255,.75)', margin: '6px 0 0', fontSize: 14 }}>{meta.desc}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-wrap">
        {/* İstatistik şerit */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16, marginBottom: 40, marginTop: -24 }}>
          {[
            { label: 'Takım', value: branchTeams.length || (meta.teams?.length ?? '—') },
            { label: 'Sporcu', value: branchTeams.reduce((s, t) => s + t.players.length, 0) || '—' },
            { label: 'Başarı', value: meta.achievements?.length ?? 0 },
            { label: 'Haber', value: branchNews.length },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', boxShadow: '0 4px 20px rgba(0,0,0,.07)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: meta.color, fontFamily: 'var(--font-display)' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
          <div>
            {/* KADROLAR */}
            <section style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24 }}>👥 Kadrolar</h2>
                {branchTeams.length > 1 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => setActiveTeam(null)}
                      style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${!activeTeam ? meta.color : 'var(--border)'}`, background: !activeTeam ? meta.color : '#fff', color: !activeTeam ? '#fff' : 'var(--text)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      Tümü
                    </button>
                    {branchTeams.map(t => (
                      <button key={t.id} onClick={() => setActiveTeam(t.id)}
                        style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${activeTeam === t.id ? meta.color : 'var(--border)'}`, background: activeTeam === t.id ? meta.color : '#fff', color: activeTeam === t.id ? '#fff' : 'var(--text)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                        {t.team}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {displayTeams.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f9f9f9', borderRadius: 12, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
                  <p>Henüz kadro eklenmemiş. Admin panelinden ekleyebilirsiniz.</p>
                </div>
              )}

              {displayTeams.map(team => (
                <div key={team.id} style={{ marginBottom: 32 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: meta.color, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14, borderLeft: `3px solid ${meta.color}`, paddingLeft: 10 }}>{team.team}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 14 }}>
                    {team.players.map(pl => (
                      <Link key={pl.id} to={`/biyografi/oyuncu/${pl.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,.06)', textAlign: 'center', transition: 'transform .2s, box-shadow .2s' }}
                          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${meta.color}33` }}
                          onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.06)' }}>
                          <div style={{ height: 110, background: `linear-gradient(135deg, ${meta.color}22, ${meta.color}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                            {pl.image
                              ? <img src={pl.image} alt={pl.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div style={{ fontSize: 44, opacity: .6 }}>👤</div>
                            }
                            <div style={{ position: 'absolute', top: 6, right: 6, background: meta.color, color: '#fff', borderRadius: 6, padding: '2px 7px', fontSize: 11, fontWeight: 900 }}>#{pl.number}</div>
                          </div>
                          <div style={{ padding: '10px 8px' }}>
                            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 2 }}>{pl.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{pl.position}</div>
                            {pl.age && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{pl.age} yaş</div>}
                            <div style={{ fontSize: 10, color: meta.color, fontWeight: 700 }}>Özgeçmiş →</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* HABERLER */}
            <section>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 20 }}>📰 {meta.name} Haberleri</h2>
              {branchNews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f9f9f9', borderRadius: 12, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📰</div>
                  <p>Bu branşa ait haber bulunamadı.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 16 }}>
                  {branchNews.map(n => (
                    <Link key={n.id} to="/haberler" style={{ textDecoration: 'none' }}>
                      <div style={{ display: 'flex', gap: 16, background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,.05)', transition: 'box-shadow .2s' }}
                        onMouseOver={e => e.currentTarget.style.boxShadow = `0 8px 24px ${meta.color}22`}
                        onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.05)'}>
                        <div style={{ width: 100, flexShrink: 0, background: `linear-gradient(135deg,${meta.color},${meta.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {(n.images?.[0] || n.image)
                            ? <img src={n.images?.[0] || n.image} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontSize: 32 }}>{n.icon || meta.icon}</span>
                          }
                        </div>
                        <div style={{ padding: '14px 16px', flex: 1 }}>
                          <div style={{ fontSize: 11, color: meta.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{n.date}</div>
                          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', marginBottom: 6 }}>{n.title}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.content?.slice(0, 100)}{n.content?.length > 100 ? '…' : ''}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sağ panel */}
          <div style={{ position: 'sticky', top: 20 }}>
            {meta.achievements?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid var(--border)', marginBottom: 20 }}>
                <h3 style={{ margin: '0 0 16px', fontWeight: 900, fontSize: 16 }}>🏅 Başarılarımız</h3>
                {meta.achievements.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: meta.color, fontWeight: 900, fontSize: 16, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, lineHeight: 1.5 }}>{a}</span>
                  </div>
                ))}
              </div>
            )}

            {meta.schedule && (
              <div style={{ background: `linear-gradient(135deg,${meta.color}15,${meta.color}08)`, borderRadius: 14, padding: 24, border: `1px solid ${meta.color}33`, marginBottom: 20 }}>
                <h3 style={{ margin: '0 0 12px', fontWeight: 900, fontSize: 16 }}>⏰ Antrenman Saatleri</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{meta.schedule}</p>
              </div>
            )}

            {meta.teams?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid var(--border)', marginBottom: 20 }}>
                <h3 style={{ margin: '0 0 14px', fontWeight: 900, fontSize: 16 }}>🏆 Takımlarımız</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {meta.teams.map(t => (
                    <span key={t} style={{ background: `${meta.color}15`, color: meta.color, fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 20, border: `1px solid ${meta.color}33` }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            <button className="btn btn-primary btn-full btn-ripple" style={{ borderRadius: 12 }} onClick={() => navigate('/uyelik')}>Kayıt Ol →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
