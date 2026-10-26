<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import api from '~/utils/axios'

const email = ref('user@example.com')
const password = ref('123456')
const token = ref('')
const user = ref<{ id: string; email: string; name: string } | null>(null)
const error = ref('')
const loading = ref(false)

const getStoredToken = () => localStorage.getItem('jwt_token') ?? ''

const loadProfile = async (jwt: string) => {
  const { data } = await api.get<{ user: { id: string; email: string; name: string } }>('/auth/profile', {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })

  user.value = data.user
}

const login = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await api.post<{ access_token: string; user: { id: string; email: string; name: string } }>('/auth/login', {
      email: email.value,
      password: password.value,
    })

    token.value = data.access_token
    localStorage.setItem('jwt_token', token.value)
    user.value = data.user
    await loadProfile(token.value)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Authorization failed'
    error.value = message
    token.value = ''
    user.value = null
    localStorage.removeItem('jwt_token')
  } finally {
    loading.value = false
  }
}

const logout = () => {
  token.value = ''
  user.value = null
  localStorage.removeItem('jwt_token')
}

onMounted(async () => {
  const savedToken = getStoredToken()

  if (!savedToken) {
    return
  }

  token.value = savedToken

  try {
    await loadProfile(savedToken)
  } catch {
    logout()
  }
})
</script>

<template>
  <div class="p-5 flex justify-center">
    <Card class="w-full max-w-md">
      <template #title>
        <div class="text-2xl font-semibold">JWT authorization</div>
      </template>

      <template #content>
        <div class="flex flex-col gap-4 pt-2">
          <div v-if="user" class="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Signed in as <strong>{{ user.name }}</strong> ({{ user.email }})
          </div>

          <label class="flex flex-col gap-2 text-sm font-medium">
            Email
            <InputText v-model="email" type="email" placeholder="name@example.com" class="w-full" />
          </label>

          <label class="flex flex-col gap-2 text-sm font-medium">
            Password
            <InputText v-model="password" type="password" placeholder="123456" class="w-full" />
          </label>

          <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {{ error }}
          </div>

          <div v-if="token" class="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs break-all">
            JWT: {{ token }}
          </div>

          <div class="flex gap-2">
            <Button :label="loading ? 'Signing in...' : 'Login'" severity="primary" class="flex-1" :disabled="loading" @click="login" />
            <Button v-if="token" label="Logout" severity="secondary" outlined @click="logout" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>