<script setup lang="ts">
useSeoMeta({ title: 'Jobs — Job Search 2026' })

interface Job {
  id: string
  title: string
  company: string
  location: string
  link: string
  source: string
  remote: 0 | 1
  salary: string
  date_posted: string
  date_scraped: string
  telework: string
  bucket: string
  level: string
  score: number | null
  score_rationale: string
  recommendation: string
  strengths: string
  concerns: string
  description?: string
  shortlisted: 0 | 1
  shortlist_status: string | null
  shortlist_notes: string | null
}

interface JobsResponse {
  data: Job[]
  meta: {
    total: number
    page: number
    per_page: number
    pages: number
  }
}

const filters = ref({
  source: '', bucket: '', level: '', remote: '',
  score_min: '', score_max: '', rec: '', search: ''
})
const page = ref(1)
const drawerOpen = ref(false)
const selectedJob = ref<Job | null>(null)

const queryParams = computed(() => {
  const p: Record<string, string> = { page: String(page.value) }
  for (const [k, v] of Object.entries(filters.value)) {
    if (v) p[k] = v
  }
  return p
})

const { data, pending, refresh } = useFetch<JobsResponse>('/api/jobs', {
  query: queryParams,
  watch: [queryParams]
})

const jobs = computed(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta ?? { total: 0, page: 1, per_page: 25, pages: 1 })

watch(filters, () => {
  page.value = 1
}, { deep: true })

function openJob(job: Job) {
  selectedJob.value = job
  drawerOpen.value = true
}

async function toggleShortlist(job: Job) {
  if (job.shortlisted) {
    await $fetch(`/api/jobs/${job.id}/shortlist`, { method: 'DELETE' })
  } else {
    await $fetch(`/api/jobs/${job.id}/shortlist`, { method: 'POST', body: { status: 'saved' } })
  }
  await refresh()
  if (selectedJob.value?.id === job.id) {
    selectedJob.value = { ...selectedJob.value, shortlisted: job.shortlisted ? 0 : 1 }
  }
}

async function updateShortlist(job: Job) {
  await $fetch(`/api/jobs/${job.id}/shortlist`, {
    method: 'POST',
    body: { status: job.shortlist_status ?? 'saved', notes: job.shortlist_notes ?? '' }
  })
  await refresh()
}
</script>

<template>
  <UContainer class="py-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">
          Job Board
        </h1>
        <p class="text-muted text-sm mt-1">
          {{ meta.total }} roles found
          <span
            v-if="pending"
            class="ml-2 text-xs"
          >Loading…</span>
        </p>
      </div>
    </div>

    <JobFilters v-model="filters" />

    <JobTable
      :jobs="jobs"
      :loading="pending"
      @select="openJob"
      @shortlist="toggleShortlist"
    />

    <div class="flex justify-center">
      <UPagination
        v-model="page"
        :total="meta.total"
        :page-count="meta.per_page"
      />
    </div>

    <JobDrawer
      v-model:open="drawerOpen"
      :job="selectedJob"
      @shortlist="updateShortlist"
      @remove-shortlist="toggleShortlist"
    />
  </UContainer>
</template>
