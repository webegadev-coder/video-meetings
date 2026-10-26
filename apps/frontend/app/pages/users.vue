<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import { onMounted, ref } from 'vue'
import { authService, type AuthUser } from '~/service/auth.service'

definePageMeta({
  middleware: ['auth'],
})

const users = ref<AuthUser[]>([])
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const form = ref({
  name: '',
  email: '',
  password: '',
})

const loadUsers = async () => {
  loading.value = true
  error.value = ''

  try {
    users.value = await authService.listUsers()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load users'
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  if (!form.value.name || !form.value.email || !form.value.password) {
    error.value = 'Please fill in all fields'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    await authService.createUser({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
    })

    form.value = { name: '', email: '', password: '' }
    await loadUsers()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create user'
  } finally {
    submitting.value = false
  }
}

const removeUser = async (id: string) => {
  try {
    await authService.deleteUser(id)
    await loadUsers()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to delete user'
  }
}

onMounted(() => {
  void loadUsers()
})
</script>

<template>
  <div class="p-5">
    <div class="mx-auto max-w-5xl space-y-5">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold">Users</h1>
          <p class="text-sm text-slate-500">Manage users stored in PostgreSQL</p>
        </div>
        <Button label="Back to dashboard" severity="secondary" outlined @click="navigateTo('/')" />
      </div>

      <Card>
        <template #content>
          <div class="grid gap-4 md:grid-cols-3">
            <label class="flex flex-col gap-2 text-sm font-medium">
              Name
              <InputText v-model="form.name" placeholder="John Doe" class="w-full" />
            </label>

            <label class="flex flex-col gap-2 text-sm font-medium">
              Email
              <InputText v-model="form.email" type="email" placeholder="user@example.com" class="w-full" />
            </label>

            <label class="flex flex-col gap-2 text-sm font-medium">
              Password
              <InputText v-model="form.password" type="password" placeholder="123456" class="w-full" />
            </label>
          </div>

          <div class="mt-4 flex items-center gap-3">
            <Button :label="submitting ? 'Creating...' : 'Create user'" severity="primary" :disabled="submitting" @click="submit" />
            <Button label="Refresh" severity="secondary" outlined :disabled="loading" @click="loadUsers" />
          </div>

          <div v-if="error" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {{ error }}
          </div>
        </template>
      </Card>

      <Card>
        <template #title>
          <div class="flex items-center justify-between">
            <span>Users list</span>
          </div>
        </template>

        <template #content>
          <div v-if="loading" class="text-sm text-slate-500">Loading users...</div>

          <div v-else-if="!users.length" class="text-sm text-slate-500">No users found.</div>

          <div v-else class="space-y-3">
            <div
              v-for="user in users"
              :key="user.id"
              class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
            >
              <div>
                <div class="font-medium">{{ user.name }}</div>
                <div class="text-sm text-slate-500">{{ user.email }}</div>
              </div>

              <Button label="Delete" severity="danger" text @click="removeUser(user.id)" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
