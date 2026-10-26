import api from '~/utils/axios'

export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  user: AuthUser
}

export interface ProfileResponse {
  user: AuthUser
}

export const authService = {
  async login(payload: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    return data
  },

  async getProfile(token?: string): Promise<ProfileResponse> {
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined

    const { data } = await api.get<ProfileResponse>('/auth/profile', config)
    return data
  },
}
