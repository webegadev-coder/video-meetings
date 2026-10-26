import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authService, type AuthUser } from '~/service/auth.service'

const getStoredToken = () => {
  if (!import.meta.client || typeof localStorage === 'undefined') {
    return ''
  }

  return localStorage.getItem('jwt_token') ?? ''
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>('')
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref('')
  const isHydrated = ref(false)

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
      const { access_token, user: authUser } = await authService.login({ email, password })

      setToken(access_token)
      user.value = authUser
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
      const { user: profileUser } = await authService.getProfile(token.value)
      user.value = profileUser
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
    isHydrated.value = true
  }

  const hydrate = async () => {
    if (import.meta.client) {
      const storedToken = getStoredToken()
      if (storedToken) {
        token.value = storedToken
      }
    }

    if (!token.value) {
      isHydrated.value = true
      return
    }

    try {
      await loadProfile()
    } catch {
      logout()
    } finally {
      isHydrated.value = true
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isHydrated,
    isAuthenticated,
    login,
    loadProfile,
    logout,
    hydrate,
  }
})
