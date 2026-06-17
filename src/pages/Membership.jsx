import React, { useState, useRef } from 'react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

const STEPS = [
  { num: '01', icon: '📝', title: 'Online Başvuru', desc: 'Aşağıdaki formu doldurun ve gerekli belgeleri sisteme yükleyin.' },
  { num: '02', icon: '🔍', title: 'İnceleme', desc: 'Başvurunuz Yönetim Kurulu tarafından 5-10 iş günü içinde değerlendirilir.' },
  { num: '03', icon: '📩', title: 'Bildirim', desc: 'Onay veya ret kararı e-posta ve telefon ile bildirilir.' },
  { num: '04', icon: '💳', title: 'Aidat Ödemesi', desc: 'Onay sonrası 30 gün içinde giriş ve ilk ay aidatınızı ödeyin, üyeliğiniz aktif olur.' },
]

const FAQS = [
  { q: 'Başvuru ne kadar sürede sonuçlanır?', a: 'Başvurular Yönetim Kurulu toplantısında değerlendirilir. Ortalama 5-10 iş günü içinde sonuç bildirilir.' },
  { q: 'Belgeleri fiziksel olarak teslim etmem gerekiyor mu?', a: 'Ön başvuruyu online yapabilirsiniz. Onay sonrasında orijinal belgeler kulüp merkezine teslim edilmelidir.' },
  { q: 'Üyeliği dondurabilir miyim?', a: 'Evet, haklı gerekçeler (sağlık, yurt dışı vb.) ile üyeliğinizi en fazla 6 ay dondurabilirsiniz.' },
  { q: 'Farklı branşa geçiş yapabilir miyim?', a: 'Standart üyelikte yılda bir kez branş değişikliği yapabilirsiniz. Aile paketinde tüm branşlara erişim serbesttir.' },
  { q: 'Üyelik iptali nasıl yapılır?', a: 'Yazılı dilekçe ile kulüp merkezine başvurarak üyeliğinizi iptal ettirebilirsiniz. İptal işlemi 30 gün içinde tamamlanır.' },
]

function ImageUploadField({ label, value, onChange }) {
  const ref = useRef()
  const handleFile = e => {
    const file = e.target.files[0]; if (!file) return
    if (file.size > 3*1024*1024) { alert('Dosya 3MB\'dan küçük olmalı'); return }
    const reader = new FileReader()
    reader.onload = ev => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }
  return (
    <div>
      <label className="form-label">{label}</label>
      <div onClick={() => ref.current.click()}
        style={{ border: '2px dashed var(--border)', borderRadius: 8, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, background: '#fafafa', transition: 'border-color .2s' }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--green)'}
        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
        {value
          ? <><div style={{ width: 48, height: 48, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}><img src={value} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div><div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>✓ Yüklendi</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Değiştirmek için tıkla</div></div></>
          : <><div style={{ fontSize: 24 }}>📎</div><div><div style={{ fontSize: 13, fontWeight: 600 }}>Dosya seç</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>PNG, JPG, PDF · Maks 3MB</div></div></>
        }
      </div>
      <input ref={ref} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}

export default function Membership() {
  const { addMember, members } = useStore()
  const { currentUser } = useAuth()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState(currentUser ? 'myinfo' : 'apply')
    const [openFaq, setOpenFaq] = useState(null)
  const [queryTC, setQueryTC] = useState('')
  const [queryResult, setQueryResult] = useState(null)
  const [step, setStep] = useState(1)

  const emptyForm = { name:'', tc:'', phone:'', email: currentUser?.email||'', birthdate:'', gender:'', address:'', city:'', branch:'Futbol', note:'', photoFile:null, idFile:null, healthFile:null, agreed:false }
  const [form, setForm] = useState(emptyForm)
  const f = k => e => setForm(p => ({...p, [k]: e.target.value}))

  const handleQuery = () => {
    if (queryTC.length !== 11) { toast('Geçerli bir TC kimlik numarası girin.', 'error'); return }
    // Demo sorgu
    setQueryResult({ found: queryTC === '12345678901', name: 'Ahmet Yılmaz', status: 'active', branch: 'Futbol', since: '2026-03-01', nextPayment: '2026-07-01' })
  }

  const handleSubmit = () => {
    if (!form.name || !form.tc || !form.phone || !form.email) { toast('Zorunlu alanları doldurun.', 'error'); return }
    if (form.tc.length !== 11) { toast('TC kimlik numarası 11 haneli olmalı.', 'error'); return }
    if (!form.agreed) { toast('Üyelik koşullarını kabul etmelisiniz.', 'error'); return }
    addMember({ name: form.name, email: form.email, phone: form.phone, branch: form.branch.find(p=>p.id===form.plan)?.name || 'Standart', status: 'pending' })
    toast('Başvurunuz alındı! En kısa sürede size dönüş yapacağız. ✓')
    setForm(emptyForm)
    setStep(1)
    setActiveTab('plans')
  }

  const myMembership = currentUser ? members.find(m => m.email === currentUser.email) : null

  const TABS = [
    ...(currentUser ? [{ key:'myinfo', label:'👤 Üyeliğim' }] : []),
    { key:'apply', label:'📝 Online Başvuru' },
    { key:'query', label:'🔍 Üyelik Sorgula' },
    { key:'faq',   label:'❓ Sık Sorulan Sorular' },
  ]

  const STATUS_LABEL = { active: '🟢 Aktif', pending: '🟡 Onay Bekliyor', inactive: '🔴 Pasif' }
  const STATUS_COLOR = { active: '#00913A', pending: '#f59e0b', inactive: '#e53935' }

  return (
    <div style={{ background: 'var(--gray-bg)', minHeight: '100vh' }}>
      <div className="page-header" style={{ padding: '48px 20px' }}>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:3, marginBottom:8 }} className="anim-trackIn">KULÜBE KATIL</div>
          <h1 className="anim-trackIn delay-1" style={{ fontSize: 32 }}>🎽 Üyelik İşlemleri</h1>
          <p className="anim-trackIn delay-2" style={{ marginTop: 8, fontSize: 15 }}>Üsküdar Anadolu Spor Kulübü ailesine katılın</p>
        </div>
      </div>

      {/* Başvuru süreci */}
      <div style={{ background: 'var(--green-dark)', padding: '32px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 20, textTransform: 'uppercase' }}>Başvuru Süreci</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
            {STEPS.map((s, i) => (
              <div key={s.num} className="anim-trackIn hover-lift" style={{ padding: '0 20px 0 0', position: 'relative', animationDelay: `${i*.1}s` }}>
                {i < 3 && <div style={{ position: 'absolute', top: 22, right: 0, width: '100%', height: 2, background: 'rgba(255,255,255,.15)' }} />}
                <div className="anim-jerseyPop" style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.1)', border: '2px solid rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12, animationDelay: `${i*.1+.2}s` }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 800, marginBottom: 4 }}>ADIM {s.num}</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 14, marginBottom: 5 }}>{s.title}</div>
                <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 12, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        {/* Sekmeler */}
        <div className="anim-trackIn" style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ flex: '1 1 120px', padding: '12px 8px', background: activeTab===t.key?'var(--green)':'#fff', color: activeTab===t.key?'#fff':'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ÜYELİĞİM */}
        {activeTab === 'myinfo' && (
          <div className="anim-trackIn">
            {myMembership ? (
              <div style={{ background:'#fff', borderRadius:16, border:'1px solid var(--border)', padding:32, boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:28, paddingBottom:24, borderBottom:'1px solid var(--border)' }}>
                  <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:26, color:'#fff', flexShrink:0 }}>
                    {currentUser.name?.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight:900, fontSize:22 }}>{myMembership.name}</div>
                    <div style={{ fontSize:14, color:'var(--text-muted)', marginTop:4 }}>{myMembership.email}</div>
                    <div style={{ marginTop:8 }}>
                      <span style={{ fontSize:13, fontWeight:800, color: STATUS_COLOR[myMembership.status] || '#555', background:`${STATUS_COLOR[myMembership.status]}18`, padding:'4px 12px', borderRadius:20 }}>
                        {STATUS_LABEL[myMembership.status] || myMembership.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16 }}>
                  {[
                    { icon:'🏅', label:'Branş', value: myMembership.branch },
                    { icon:'💳', label:'Plan', value: myMembership.plan || 'Standart' },
                    { icon:'📅', label:'Üyelik Tarihi', value: myMembership.date ? new Date(myMembership.date).toLocaleDateString('tr-TR') : '-' },
                    { icon:'📞', label:'Telefon', value: myMembership.phone || '-' },
                  ].map(item => (
                    <div key={item.label} style={{ background:'var(--green-pale)', borderRadius:12, padding:'16px 20px' }}>
                      <div style={{ fontSize:20, marginBottom:8 }}>{item.icon}</div>
                      <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', marginBottom:4, textTransform:'uppercase', letterSpacing:1 }}>{item.label}</div>
                      <div style={{ fontWeight:800, fontSize:15, color:'var(--green-dark)' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                {myMembership.status === 'pending' && (
                  <div style={{ marginTop:24, background:'#fffbeb', border:'1px solid #f59e0b', borderRadius:10, padding:'14px 18px', fontSize:13, color:'#92400e' }}>
                    🕐 Başvurunuz inceleme aşamasında. Yönetim Kurulu kararı 5-10 iş günü içinde e-posta ile bildirilecektir.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'48px 20px', background:'#fff', borderRadius:16, border:'1px solid var(--border)' }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🎽</div>
                <h3 style={{ fontWeight:900, marginBottom:8 }}>Henüz üyelik kaydınız yok</h3>
                <p style={{ color:'var(--text-muted)', marginBottom:20 }}>Üye olmak için başvuru formunu doldurun.</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('apply')}>Başvur →</button>
              </div>
            )}
          </div>
        )}

        {/* BAŞVURU FORMU */}
        {activeTab === 'apply' && (
          <div className="anim-ballIn">

            {/* Adım göstergesi */}
            <div className="anim-trackIn delay-1" style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28, background: '#fff', borderRadius: 10, padding: '16px 12px', border: '1px solid var(--border)', boxShadow:'0 4px 16px rgba(0,0,0,.05)', overflowX:'auto' }}>
              {[['1','Kişisel Bilgiler'],['2','İletişim & Adres'],['3','Belgeler'],['4','Onay']].map(([n,l],i)=>(
                <div key={n} style={{ display:'flex', alignItems:'center', flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, minWidth:0 }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:step>=Number(n)?'var(--green)':'#e0e0e0', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12, transition:'background .3s', flexShrink:0 }}>{step>Number(n)?'✓':n}</div>
                    <span style={{ fontSize:11, fontWeight:step===Number(n)?700:400, color:step>=Number(n)?'var(--green-dark)':'var(--text-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{l}</span>
                  </div>
                  {i<3 && <div style={{ flex:1, minWidth:8, height:2, background:step>Number(n)?'var(--green)':'#e0e0e0', margin:'0 6px', borderRadius:1 }} />}
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 10, padding: 28, border: '1px solid var(--border)' }}>

              {/* Adım 1 */}
              {step === 1 && (
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--green-dark)', marginBottom: 20 }}>Kişisel Bilgiler</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Ad Soyad *</label>
                      <input className="form-input" value={form.name} onChange={f('name')} placeholder="Adınız Soyadınız" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">TC Kimlik No *</label>
                      <input className="form-input" value={form.tc} onChange={e=>setForm(p=>({...p,tc:e.target.value.replace(/\D/g,'').slice(0,11)}))} placeholder="11 haneli TC kimlik" maxLength={11} style={{ fontFamily:'monospace', letterSpacing:2 }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Doğum Tarihi</label>
                      <input className="form-input" type="date" value={form.birthdate} onChange={f('birthdate')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cinsiyet</label>
                      <select className="form-select" value={form.gender} onChange={f('gender')}>
                        <option value="">Seçin</option>
                        <option value="erkek">Erkek</option>
                        <option value="kadin">Kadın</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Branş</label>
                      <select className="form-select" value={form.branch} onChange={f('branch')}>
                        {['Futbol','Basketbol','Voleybol','Masa Tenisi'].map(b=><option key={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-ripple hover-lift" style={{ minWidth:160, marginTop:10 }} onClick={()=>{
                    if(!form.name||!form.tc){toast('Ad ve TC zorunlu.','error');return}
                    if(form.tc.length!==11){toast('TC 11 haneli olmalı.','error');return}
                    setStep(2)
                  }}>Devam →</button>
                </div>
              )}

              {/* Adım 2 */}
              {step === 2 && (
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--green-dark)', marginBottom: 20 }}>İletişim & Adres Bilgileri</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Telefon *</label>
                      <input className="form-input" value={form.phone} onChange={f('phone')} placeholder="0 5XX XXX XX XX" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">E-posta *</label>
                      <input className="form-input" type="email" value={form.email} onChange={f('email')} placeholder="ornek@mail.com" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">İl</label>
                      <input className="form-input" value={form.city} onChange={f('city')} placeholder="İstanbul" />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Açık Adres</label>
                      <textarea className="form-input form-textarea" style={{ height:80 }} value={form.address} onChange={f('address')} placeholder="Mahalle, sokak, bina..." />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Notlar (opsiyonel)</label>
                      <textarea className="form-input form-textarea" style={{ height:70 }} value={form.note} onChange={f('note')} placeholder="Eklemek istediğiniz bilgiler..." />
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:10, marginTop:10 }}>
                    <button className="btn" style={{ background:'#f0f0f0' }} onClick={()=>setStep(1)}>← Geri</button>
                    <button className="btn btn-primary btn-ripple hover-lift" style={{ minWidth:160 }} onClick={()=>{
                      if(!form.phone||!form.email){toast('Telefon ve e-posta zorunlu.','error');return}
                      setStep(3)
                    }}>Devam →</button>
                  </div>
                </div>
              )}

              {/* Adım 3 */}
              {step === 3 && (
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--green-dark)', marginBottom: 6 }}>Belge Yükleme</div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 22, lineHeight: 1.6 }}>
                    Seçtiğiniz pakete göre gerekli belgelerinizi yükleyin. Eksik belgeler başvurunuzu geciktirebilir.
                  </p>
                  <div style={{ display: 'grid', gap: 14 }}>
                    <div className="form-group">
                      <ImageUploadField label="📸 Vesikalık Fotoğraf *" value={form.photoFile} onChange={v=>setForm(p=>({...p,photoFile:v}))} />
                    </div>
                    <div className="form-group">
                      <ImageUploadField label="🪪 Nüfus Cüzdanı Fotokopisi *" value={form.idFile} onChange={v=>setForm(p=>({...p,idFile:v}))} />
                    </div>
                    <div className="form-group">
                      <ImageUploadField label="🏥 Sağlık Beyanı / Raporu" value={form.healthFile} onChange={v=>setForm(p=>({...p,healthFile:v}))} />
                    </div>
                  </div>
                  <div style={{ background: '#FFF8E1', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#E65100', marginTop: 16, lineHeight: 1.6 }}>
                    ⚠️ Belgeleriniz onaylandıktan sonra orijinallerini kulüp merkezine teslim etmeniz gerekmektedir.
                  </div>
                  <div style={{ display:'flex', gap:10, marginTop:18 }}>
                    <button className="btn" style={{ background:'#f0f0f0' }} onClick={()=>setStep(2)}>← Geri</button>
                    <button className="btn btn-primary btn-ripple hover-lift" style={{ minWidth:160 }} onClick={()=>setStep(4)}>Devam →</button>
                  </div>
                </div>
              )}

              {/* Adım 4: Onay */}
              {step === 4 && (
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--green-dark)', marginBottom: 20 }}>Başvuru Özeti</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 20 }}>
                    {[
                      ['Ad Soyad', form.name],
                      ['TC Kimlik', form.tc],
                      ['Telefon', form.phone],
                      ['E-posta', form.email],
                      ['Branş', form.branch],
                                            ['İl', form.city || '—'],
                    ].map(([l,v])=>(
                      <div key={l} style={{ background: 'var(--gray-bg)', borderRadius: 6, padding: '10px 14px' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 2 }}>{l}</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'var(--green-pale)', borderRadius: 8, padding: '14px 16px', marginBottom: 18, fontSize: 13, lineHeight: 1.7, color: 'var(--green-dark)' }}>
                    📋 Başvurunuz Yönetim Kurulu'nda değerlendirilecek ve sonuç e-posta / telefon ile bildirilecektir. Onay sonrası 30 gün içinde aidat ödemeniz gerekmektedir.
                  </div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
                    <input type="checkbox" checked={form.agreed} onChange={e=>setForm(p=>({...p,agreed:e.target.checked}))} style={{ width:16, height:16, marginTop:2, accentColor:'var(--green)', flexShrink:0 }} />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      Kulüp tüzüğünü ve üyelik koşullarını okudum, kabul ediyorum. Başvuruda verdiğim bilgilerin doğru ve eksiksiz olduğunu beyan ederim.
                    </span>
                  </label>
                  <div style={{ display:'flex', gap:10 }}>
                    <button className="btn" style={{ background:'#f0f0f0' }} onClick={()=>setStep(3)}>← Geri</button>
                    <button className="btn btn-primary btn-ripple hover-lift" style={{ flex:1, height:46, fontSize:15 }} onClick={handleSubmit}>
                      ✅ Başvuruyu Gönder
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ÜYELİK SORGULA */}
        {activeTab === 'query' && (
          <div className="anim-ballIn" style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 32, border: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>🔍</div>
                <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 6 }}>Üyelik Sorgulama</div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>TC kimlik numaranızla üyelik durumunuzu ve aidat bilgilerinizi sorgulayabilirsiniz.</p>
              </div>
              <div className="form-group">
                <label className="form-label">TC Kimlik Numarası</label>
                <input className="form-input" value={queryTC} onChange={e=>setQueryTC(e.target.value.replace(/\D/g,'').slice(0,11))} placeholder="11 haneli TC kimlik no" maxLength={11} style={{ fontFamily:'monospace', letterSpacing:3, fontSize:16, textAlign:'center' }} onKeyDown={e=>e.key==='Enter'&&handleQuery()} />
              </div>
              <button className="btn btn-primary btn-full" style={{ height:44, fontSize:15, marginBottom:8 }} onClick={handleQuery}>Sorgula</button>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign:'center' }}>Demo: 12345678901 ile sorgulayın</p>

              {queryResult && (
                <div style={{ marginTop: 24, animation: 'scaleIn .3s ease' }}>
                  {queryResult.found ? (
                    <div style={{ background: 'var(--green-pale)', borderRadius: 10, padding: 20, border: '1.5px solid var(--green)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                        <div style={{ width:40, height:40, background:'var(--green)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:18 }}>✓</div>
                        <div>
                          <div style={{ fontWeight:800, fontSize:15 }}>{queryResult.name}</div>
                          <span className="status status-active">Aktif Üye</span>
                        </div>
                      </div>
                      {[
                        ['Üyelik Planı', queryResult.plan],
                        ['Branş', queryResult.branch],
                        ['Üyelik Tarihi', queryResult.since],
                        ['Sonraki Aidat', queryResult.nextPayment],
                      ].map(([l,v])=>(
                        <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'7px 0', borderBottom:'1px solid rgba(0,145,58,.15)' }}>
                          <span style={{ color:'var(--text-muted)' }}>{l}</span>
                          <span style={{ fontWeight:700 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ background: '#fce4e4', borderRadius: 10, padding: 20, textAlign:'center', border: '1.5px solid #e53935' }}>
                      <div style={{ fontSize:32, marginBottom:8 }}>❌</div>
                      <div style={{ fontWeight:700, color:'#c62828' }}>Kayıt bulunamadı</div>
                      <p style={{ fontSize:13, color:'#666', marginTop:8 }}>Bu TC numarasına ait aktif üyelik kaydı bulunmamaktadır.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SSS */}
        {activeTab === 'faq' && (
          <div className="anim-ballIn" style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 20, color: 'var(--green-dark)' }}>Sık Sorulan Sorular</div>
            {FAQS.map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, marginBottom: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq===i?null:i)}
                  style={{ width:'100%', padding:'16px 20px', background:'none', border:'none', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', textAlign:'left' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{item.q}</span>
                  <span style={{ fontSize: 18, color: 'var(--green)', flexShrink:0, marginLeft:12, transform: openFaq===i?'rotate(180deg)':'rotate(0)', transition:'transform .2s' }}>▾</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 16px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}

            <div style={{ background: 'var(--green-dark)', borderRadius: 10, padding: 24, marginTop: 24, textAlign:'center' }}>
              <div style={{ color:'#fff', fontWeight:800, fontSize:16, marginBottom:8 }}>Sorunuz mu var?</div>
              <p style={{ color:'rgba(255,255,255,.75)', fontSize:13, marginBottom:16 }}>Üyelik hakkında daha fazla bilgi almak için bize ulaşın.</p>
              <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
                <a href="tel:0216XXXXXXX" className="btn btn-yellow" style={{ textDecoration:'none' }}>📞 Ara</a>
                <button className="btn btn-outline" onClick={()=>setActiveTab('apply')}>📝 Başvur</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
