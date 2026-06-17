import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'

const ShopContext = createContext(null)
const BACKEND = 'https://uskudar-backend.onrender.com'

function load(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback } }
function save(key, value)    { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }

export function ShopProvider({ children }) {
  const { isKongre, currentUser } = useAuth()
  const [cart, setCart]           = useState(() => load('usk_cart', []))
  const [favorites, setFavorites] = useState(() => load('usk_favs', []))
  const [orders, setOrders]       = useState(() => load('usk_orders', []))
  const [addresses, setAddresses] = useState(() => load('usk_addresses', []))
  const syncTimeout = useRef(null)

  // Kullanıcı girişinde sunucudan sepeti çek
  useEffect(() => {
    if (!currentUser) return
    const userId = String(currentUser.id)
    fetch(`${BACKEND}/api/cart/${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          setCart(data.items)
          save('usk_cart', data.items)
        }
      })
      .catch(() => {})
  }, [currentUser?.id])

  // Sepet değişince sunucuya kaydet (debounced)
  useEffect(() => {
    save('usk_cart', cart)
    if (!currentUser) return
    clearTimeout(syncTimeout.current)
    syncTimeout.current = setTimeout(() => {
      fetch(`${BACKEND}/api/cart/${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      }).catch(() => {})
    }, 800)
  }, [cart, currentUser?.id])

  useEffect(() => save('usk_favs', favorites), [favorites])
  useEffect(() => save('usk_orders', orders), [orders])
  useEffect(() => save('usk_addresses', addresses), [addresses])

  // CART
  const addToCart = (product, opts = {}) => {
    const key = `${product.id}-${opts.size || ''}-${opts.color || ''}`
    setCart(prev => {
      const ex = prev.find(i => i.key === key)
      if (ex) return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, key, qty: 1, selectedSize: opts.size, selectedColor: opts.color }]
    })
  }
  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key))
  const updateQty = (key, qty) => {
    if (qty < 1) { removeFromCart(key); return }
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i))
  }
  const clearCart = () => {
    setCart([])
    if (currentUser) {
      fetch(`${BACKEND}/api/cart/${currentUser.id}`, { method: 'DELETE' }).catch(() => {})
    }
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const kongreDiscount = isKongre ? 0.10 : 0
  const getItemPrice = (i) => {
    const base = i.discountPrice || i.price
    return isKongre ? Math.round(base * 0.90) : base
  }
  const cartTotal = cart.reduce((s, i) => s + getItemPrice(i) * i.qty, 0)

  // FAVORITES
  const toggleFav = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const isFav = (id) => favorites.includes(id)

  // ORDERS
  const placeOrder = (orderData) => {
    const order = { ...orderData, id: Date.now(), date: new Date().toISOString(), status: 'processing', items: cart }
    setOrders(prev => [order, ...prev])
    clearCart()
    return order.id
  }

  // ADDRESSES
  const addAddress    = (addr) => setAddresses(prev => [...prev, { ...addr, id: Date.now() }])
  const deleteAddress = (id)   => setAddresses(prev => prev.filter(a => a.id !== id))
  const updateAddress = (id, data) => setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...data } : a))

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
