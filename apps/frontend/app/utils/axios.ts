import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (import.meta.client) {
    const token = localStorage.getItem('jwt_token')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export default api
