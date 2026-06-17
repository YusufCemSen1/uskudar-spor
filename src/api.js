const BASE = 'http://localhost:8080/api'

// Token yönetimi
export const getToken  = ()        => localStorage.getItem('usk_jwt')
export const setToken  = (t)       => localStorage.setItem('usk_jwt', t)
export const clearToken = ()       => localStorage.removeItem('usk_jwt')

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
})

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Sunucu hatası' }))
    throw new Error(err.message || 'Hata oluştu')
  }
  return res.status === 204 ? null : res.json()
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const api = {
  auth: {
    login:          (email, password) => req('POST', '/auth/login', { email, password }),
    register:       (data)            => req('POST', '/auth/register', data),
    me:             ()                => req('GET',  '/auth/me'),
    updateProfile:  (data)            => req('PUT',  '/auth/profile', data),
    changePassword: (data)            => req('PUT',  '/auth/password', data),
  },

  // ── NEWS
  news: {
    list:   (category) => req('GET', `/news${category ? `?category=${category}` : ''}`),
    get:    (id)       => req('GET', `/news/${id}`),
    // Admin
    all:    ()         => req('GET',    '/news/admin/all'),
    create: (data)     => req('POST',   '/news/admin', data),
    update: (id, data) => req('PUT',    `/news/admin/${id}`, data),
    delete: (id)       => req('DELETE', `/news/admin/${id}`),
  },

  // ── PRODUCTS
  products: {
    list:   (category) => req('GET', `/products${category ? `?category=${category}` : ''}`),
    get:    (id)       => req('GET', `/products/${id}`),
    // Admin
    create: (data)     => req('POST',   '/products/admin', data),
    update: (id, data) => req('PUT',    `/products/admin/${id}`, data),
    delete: (id)       => req('DELETE', `/products/admin/${id}`),
  },

  // ── ORDERS
  orders: {
    my:           ()            => req('GET',  '/orders/my'),
    place:        (data)        => req('POST', '/orders', data),
    // Admin
    all:          ()            => req('GET',  '/orders/admin'),
    updateStatus: (id, status)  => req('PUT',  `/orders/admin/${id}/status`, { status }),
  },

  // ── REVIEWS
  reviews: {
    list:   (productId)        => req('GET',  `/reviews/product/${productId}`),
    create: (productId, data)  => req('POST', `/reviews/product/${productId}`, data),
  },

  // ── ADDRESSES
  addresses: {
    list:   ()         => req('GET',    '/addresses'),
    create: (data)     => req('POST',   '/addresses', data),
    update: (id, data) => req('PUT',    `/addresses/${id}`, data),
    delete: (id)       => req('DELETE', `/addresses/${id}`),
  },

  // ── SETTINGS
  settings: {
    get:    ()     => req('GET', '/settings'),
    update: (data) => req('PUT', '/settings/admin', data),
  },

  // ── ADMIN USERS
  adminUsers: {
    list:   ()            => req('GET',    '/admin/users'),
    update: (id, data)    => req('PUT',    `/admin/users/${id}`, data),
    delete: (id)          => req('DELETE', `/admin/users/${id}`),
  },
}
