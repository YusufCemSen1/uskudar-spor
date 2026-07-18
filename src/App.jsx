import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTabTitle } from './hooks/useTabTitle'
import { StoreProvider } from './context/StoreContext'
import { ShopProvider } from './context/ShopContext'
import { AuthProvider } from './context/AuthContext'
import { SiteProvider } from './context/SiteContext'
import { ToastProvider } from './components/Toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import News from './pages/News'
import Branches from './pages/Branches'
import Membership from './pages/Membership'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterSuccess from './pages/RegisterSuccess'
import BranchDetail from './pages/BranchDetail'
import About from './pages/About'
import BioPage from './pages/BioPage'
import Fixtures from './pages/Fixtures'
import SiteFooter from './components/SiteFooter'

function AppInner() {
  useTabTitle()
  return null
}

function SiteClosedOverlay() {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:99999, background:'#0a1a0f', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:24, padding:24 }}>
      <div style={{ fontSize:64 }}>🔒</div>
      <div style={{ textAlign:'center', maxWidth:480 }}>
        <div style={{ width:60, height:3, background:'#00a844', margin:'0 auto 20px', borderRadius:2 }} />
        <div style={{ fontSize:18, fontWeight:700, color:'#ff4d4d', marginBottom:12 }}>Site Geçici Olarak Kullanıma Kapalıdır</div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,.65)', lineHeight:1.8 }}>
          Web sitesi yapım ve tasarım ücreti ödenmediği için site geçici olarak erişime kapatılmıştır.<br />
          Bilgi için kulüple iletişime geçiniz.
        </div>
        <div style={{ marginTop:24, fontSize:13, color:'rgba(255,255,255,.4)' }}>📞 0545 812 1908</div>
      </div>
    </div>
  )
}

const SITE_CLOSED = true

export default function App() {
  if (SITE_CLOSED) return <SiteClosedOverlay />
  return (
    <SiteProvider>
      <StoreProvider>
        <AuthProvider>
          <ShopProvider>
            <ToastProvider>
              <BrowserRouter>
                <AppInner />
                <Navbar />
                <Routes>
                  <Route path="/"           element={<Home />} />
                  <Route path="/haberler"   element={<News />} />
                  <Route path="/branslar"   element={<Branches />} />
                  <Route path="/branslar/:id" element={<BranchDetail />} />
                  <Route path="/hakkimizda" element={<About />} />
                  <Route path="/fikstür"    element={<Fixtures />} />
                  <Route path="/biyografi/:type/:id" element={<BioPage />} />
                  <Route path="/uyelik"     element={<Membership />} />
                  <Route path="/magaza"     element={<Shop />} />
                  <Route path="/magaza/:id" element={<ProductDetail />} />
                  <Route path="/sepet"      element={<Cart />} />
                  <Route path="/odeme"      element={<Checkout />} />
                  <Route path="/profil"     element={<Profile />} />
                  <Route path="/iletisim"   element={<Contact />} />
                  <Route path="/panel"      element={<Admin />} />
                  <Route path="/giris"      element={<Login />} />
                  <Route path="/kayit"      element={<Register />} />
                  <Route path="/basvuru-basarili" element={<RegisterSuccess />} />
                </Routes>
                <SiteFooter />
              </BrowserRouter>
            </ToastProvider>
          </ShopProvider>
        </AuthProvider>
      </StoreProvider>
    </SiteProvider>
  )
}
