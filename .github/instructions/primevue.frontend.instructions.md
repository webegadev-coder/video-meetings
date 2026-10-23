---
applyTo: "apps/frontend/**/*.{vue,ts,js,css}"
---

# PrimeVue frontend guidance

Use PrimeVue as the default component library for the Nuxt frontend. Prefer official PrimeVue components over custom hand-written UI when the behavior is already covered by the library.

## Standards

- Use semantic, themeable components from PrimeVue for forms, actions, dialogs, data tables, and cards.
- Keep UI logic simple and composition-friendly in Nuxt components.
- Use the Aura theme from `@primeuix/themes` and keep styling consistent with the global design system.
- Prefer `Button`, `InputText`, `Textarea`, `Dropdown`, `Dialog`, `Card`, `DataTable`, `SelectButton`, and related components for common tasks.
- Use `pt` props and slots when a small UI adjustment is needed, instead of replacing the component with custom CSS.
- Avoid duplicated styles when a PrimeVue variant already exists.

## Nuxt usage

- Register PrimeVue via the Nuxt module configured in the project.
- Import components locally when a component needs only a few explicit imports.
- Use `useNuxtApp()` or composables for stateful UI orchestration when needed.
- Keep backend integration through `/api` proxy; do not call hardcoded localhost URLs in the frontend app.

## Example

```vue
<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
</script>

<template>
  <div class="p-4">
    <InputText v-model="value" placeholder="Search" />
    <Button label="Submit" severity="primary" class="ml-2" />
  </div>
</template>
```

## Quality bar

- Prefer accessible, keyboard-friendly PrimeVue components.
- Keep new reusable UI pieces under `app/components` when they are shared.
- Maintain consistent spacing, sizing, and theme tokens with the project defaults.
