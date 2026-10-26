<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import { useAuthStore } from '~/stores/useAuthStore'

definePageMeta({
  middleware: ['auth'],
})

const auth = useAuthStore()
const email = ref('user@example.com')
const password = ref('123456')

watch(
  () => auth.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      navigateTo('/')
    }
  },
  { immediate: true },
)

const submit = async () => {
  await auth.login(email.value, password.value)

  if (auth.isAuthenticated) {
    await navigateTo('/')
  }
}
</script>

<template>
  <div class="p-5 flex justify-center">
    <Card class="w-full max-w-md">
      <template #title>
        <div class="text-2xl font-semibold">JWT authorization</div>
      </template>

      <template #content>
        <div class="flex flex-col gap-4 pt-2">
          <div v-if="auth.user" class="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Signed in as <strong>{{ auth.user.name }}</strong> ({{ auth.user.email }})
          </div>

          <label class="flex flex-col gap-2 text-sm font-medium">
            Email
            <InputText v-model="email" type="email" placeholder="name@example.com" class="w-full" />
          </label>

          <label class="flex flex-col gap-2 text-sm font-medium">
            Password
            <InputText v-model="password" type="password" placeholder="123456" class="w-full" />
          </label>

          <div v-if="auth.error" class="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {{ auth.error }}
          </div>

          <div v-if="auth.token" class="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs break-all">
            JWT: {{ auth.token }}
          </div>

          <Button :label="auth.loading ? 'Signing in...' : 'Login'" severity="primary" class="w-full" :disabled="auth.loading" @click="submit" />
        </div>
      </template>
    </Card>
  </div>
</template>
