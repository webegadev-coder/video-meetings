<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useAuthStore } from '~/stores/useAuthStore'

definePageMeta({
  middleware: ['auth'],
})

const auth = useAuthStore()

const logout = () => {
  auth.logout()
  navigateTo('/login')
}
</script>

<template>
  <div class="p-5 flex justify-center">
    <Card class="w-full max-w-xl">
      <template #title>
        <div class="flex items-center justify-between gap-3">
          <span class="text-2xl font-semibold">Dashboard</span>
          <div class="flex gap-2">
            <Button label="Users" severity="secondary" outlined @click="navigateTo('/users')" />
            <Button label="Logout" severity="secondary" outlined @click="logout" />
          </div>
        </div>
      </template>

      <template #content>
        <div v-if="auth.user" class="space-y-3">
          <p><strong>Name:</strong> {{ auth.user.name }}</p>
          <p><strong>Email:</strong> {{ auth.user.email }}</p>
          <p><strong>Token:</strong></p>
          <div class="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs break-all">
            {{ auth.token }}
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
