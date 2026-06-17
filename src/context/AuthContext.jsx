import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Admin özel kullanıcı
const ADMIN_USER = {
  id: 0,
  name: 'Kulüp Yöneticisi',
  email: 'yonetici@uskudaranadolu.com',
  password: 'uskudar2026',
  role: 'admin',
  avatar: 'KY',
}

function load(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback } }
function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('usk_user')
    return saved ? JSON.parse(saved) : null
  })
  const [users, setUsers] = useState(() => load('usk_users', []))

  const login = (email, password) => {
    // Admin kontrolü
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      const u = { id: ADMIN_USER.id, name: ADMIN_USER.name, email: ADMIN_USER.email, role: 'admin', avatar: ADMIN_USER.avatar }
      sessionStorage.setItem('usk_user', JSON.stringify(u))
      setCurrentUser(u)
      return { success: true, user: u }
    }
    // Normal kullanıcı
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, message: 'E-posta veya şifre hatalı.' }
    const u = { id: found.id, name: found.name, email: found.email, role: 'member', avatar: found.avatar || found.name.substring(0,2).toUpperCase() }
    sessionStorage.setItem('usk_user', JSON.stringify(u))
    setCurrentUser(u)
    return { success: true, user: u }
  }

  const register = (data) => {
    if (data.email === ADMIN_USER.email) return { success: false, message: 'Bu e-posta kullanılamaz.' }
    if (users.find(u => u.email === data.email)) return { success: false, message: 'Bu e-posta zaten kayıtlı.' }
    const newUser = { ...data, id: Date.now(), avatar: data.name.substring(0,2).toUpperCase(), role: 'member' }
    const updated = [...users, newUser]
    setUsers(updated)
    save('usk_users', updated)
    return { success: true }
  }

  const logout = () => {
    sessionStorage.removeItem('usk_user')
    setCurrentUser(null)
  }

  const updateProfile = (data) => {
    if (!currentUser) return
    const updated = { ...currentUser, ...data }
    sessionStorage.setItem('usk_user', JSON.stringify(updated))
    setCurrentUser(updated)
    if (currentUser.role !== 'admin') {
      const updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, ...data } : u)
      setUsers(updatedUsers)
      save('usk_users', updatedUsers)
    }
  }

  const isAdmin = currentUser?.role === 'admin'

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, updateProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
