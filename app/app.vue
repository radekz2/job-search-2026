<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: 'Job Search 2026 — Radek Zajkowski',
  description: 'Automated technology job search. Filter, score, and shortlist management roles.'
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="font-bold text-lg text-primary"
        >
          Job Search 2026
        </NuxtLink>
      </template>
      <template #right>
        <UButton
          to="/"
          variant="ghost"
          icon="i-lucide-briefcase"
        >
          Jobs
        </UButton>
        <UButton
          to="/shortlist"
          variant="ghost"
          icon="i-lucide-star"
        >
          Shortlist
        </UButton>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #right>
        <span class="text-sm text-muted">
          Powered by Nuxt + Netlify
        </span>
      </template>
    </UFooter>
  </UApp>
</template>
