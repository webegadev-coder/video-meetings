import { defineStore } from 'pinia'
import api from '~/utils/axios'

interface User {
  id: string
  email: string
  name: string
}

interface AuthResponse {
  access_token: string
  user: User
}

interface ProfileResponse {
  user: User
}

const getStoredToken = () => {
  if (!import.meta.client || typeof localStorage === 'undefined') {
    return ''
  }

  return localStorage.getItem('jwt_token') ?? ''
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>('')
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => Boolean(token.value))

  const setToken = (nextToken: string) => {
    token.value = nextToken

    if (import.meta.client) {
      if (nextToken) {
        localStorage.setItem('jwt_token', nextToken)
      } else {
        localStorage.removeItem('jwt_token')
      }
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = ''

    try {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password })

      setToken(data.access_token)
      user.value = data.user
      await loadProfile()
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authorization failed'
      error.value = message
      setToken('')
      user.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  const loadProfile = async () => {
    if (!token.value) {
      user.value = null
      return
    }

    try {
      const { data } = await api.get<ProfileResponse>('/auth/profile')
      user.value = data.user
    } catch {
      setToken('')
      user.value = null
      throw new Error('Token invalid or expired')
    }
  }

  const logout = () => {
    setToken('')
    user.value = null
    error.value = ''
  }

  const hydrate = async () => {
    if (import.meta.client) {
      const storedToken = getStoredToken()
      if (storedToken) {
        token.value = storedToken
      }
    }

    if (!token.value) {
      return
    }

    try {
      await loadProfile()
    } catch {
      logout()
    }
  }

  if (import.meta.client) {
    token.value = getStoredToken()
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    loadProfile,
    logout,
    hydrate,
  }
})
