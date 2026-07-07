import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './AuthContext'

const ShopContext = createContext(null)
const BACKEND = 'https://uskudar-backend.onrender.com'

function lsLoad(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback } }
function lsSave(key, value) { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }

export function ShopProvider({ children }) {
  const { isKongre, currentUser } = useAuth()
  const [cart, setCart]           = useState(() => lsLoad('usk_cart', []))
  const [favorites, setFavorites] = useState(() => lsLoad('usk_favs', []))
  const [orders, setOrders]       = useState(() => lsLoad('usk_orders', []))
  const [addresses, setAddresses] = useState(() => lsLoad('usk_addresses', []))
  const cartUnsub = useRef(null)
  const userUnsub = useRef(null)

  // Kullanıcıya özel Firestore koleksiyonları dinle
  useEffect(() => {
    if (cartUnsub.current) cartUnsub.current()
    if (userUnsub.current) userUnsub.current()

    if (!currentUser) return

    const uid = String(currentUser.id)

    cartUnsub.current = onSnapshot(doc(db, 'carts', uid), (snap) => {
      if (snap.exists()) {
        const d = snap.data().items || []
        setCart(d); lsSave('usk_cart', d)
      }
    })

    userUnsub.current = onSnapshot(doc(db, 'userData', uid), (snap) => {
      if (snap.exists()) {
        const d = snap.data()
        if (d.favorites) { setFavorites(d.favorites); lsSave('usk_favs', d.favorites) }
        if (d.orders)    { setOrders(d.orders);       lsSave('usk_orders', d.orders) }
        if (d.addresses) { setAddresses(d.addresses); lsSave('usk_addresses', d.addresses) }
      }
    })
  }, [currentUser?.id])

  const _saveCart = (items) => {
    setCart(items); lsSave('usk_cart', items)
    if (currentUser) {
      setDoc(doc(db, 'carts', String(currentUser.id)), { items }).catch(() => {})
    }
  }

  const _saveUserData = (data) => {
    if (!currentUser) return
    setDoc(doc(db, 'userData', String(currentUser.id)), data, { merge: true }).catch(() => {})
  }

  // CART
  const addToCart = (product, opts = {}) => {
    const key = `${product.id}-${opts.size || ''}-${opts.color || ''}`
    setCart(prev => {
      const ex = prev.find(i => i.key === key)
      const updated = ex
        ? prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, key, qty: 1, selectedSize: opts.size, selectedColor: opts.color }]
      lsSave('usk_cart', updated)
      if (currentUser) setDoc(doc(db, 'carts', String(currentUser.id)), { items: updated }).catch(() => {})
      return updated
    })
  }

  const removeFromCart = (key) => _saveCart(cart.filter(i => i.key !== key))

  const updateQty = (key, qty) => {
    if (qty < 1) { removeFromCart(key); return }
    _saveCart(cart.map(i => i.key === key ? { ...i, qty } : i))
  }

  const clearCart = () => {
    _saveCart([])
    if (currentUser) {
      fetch(`${BACKEND}/api/cart/${currentUser.id}`, { method: 'DELETE' }).catch(() => {})
    }
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const getItemPrice = (i) => {
    const base = i.discountPrice || i.price
    return isKongre ? Math.round(base * 0.90) : base
  }
  const cartTotal = cart.reduce((s, i) => s + getItemPrice(i) * i.qty, 0)
  const kongreDiscount = isKongre ? 0.10 : 0

  // FAVORITES
  const toggleFav = (id) => {
    const updated = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites, id]
    setFavorites(updated); lsSave('usk_favs', updated)
    _saveUserData({ favorites: updated })
  }
  const isFav = (id) => favorites.includes(id)

  // ORDERS
  const placeOrder = (orderData) => {
    const order = { ...orderData, id: Date.now(), date: new Date().toISOString(), status: 'processing', items: cart }
    const updated = [order, ...orders]
    setOrders(updated); lsSave('usk_orders', updated)
    _saveUserData({ orders: updated })
    clearCart()
    return order.id
  }

  // ADDRESSES
  const addAddress    = (addr) => { const updated = [...addresses, { ...addr, id: Date.now() }]; setAddresses(updated); lsSave('usk_addresses', updated); _saveUserData({ addresses: updated }) }
  const deleteAddress = (id)   => { const updated = addresses.filter(a => a.id !== id); setAddresses(updated); lsSave('usk_addresses', updated); _saveUserData({ addresses: updated }) }
  const updateAddress = (id, data) => { const updated = addresses.map(a => a.id === id ? { ...a, ...data } : a); setAddresses(updated); lsSave('usk_addresses', updated); _saveUserData({ addresses: updated }) }

  return (
    <ShopContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal, getItemPrice, kongreDiscount,
      favorites, toggleFav, isFav,
      orders, placeOrder,
      addresses, addAddress, deleteAddress, updateAddress,
    }}>
      {children}
    </ShopContext.Provider>
  )
}

export const useShop = () => useContext(ShopContext)
