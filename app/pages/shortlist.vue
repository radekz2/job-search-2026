<script setup lang="ts">
type BadgeColor = 'error' | 'neutral' | 'primary' | 'success' | 'warning'

useSeoMeta({ title: 'My Shortlist — Job Search 2026' })

interface ShortlistJob {
  id: string
  title: string
  company: string
  location: string
  link: string
  source: string
  remote: 0 | 1
  salary: string
  date_posted: string
  bucket: string
  level: string
  score: number | null
  score_rationale: string
  recommendation: string
  strengths: string
  concerns: string
  status: string
  notes: string
  date_added: string
  date_updated: string
}

const statusFilter = ref('')
const drawerOpen = ref(false)
const selectedJob = ref<ShortlistJob | null>(null)

const { data, pending, refresh } = useFetch<ShortlistJob[]>('/api/shortlist', {
  query: computed(() => statusFilter.value ? { status: statusFilter.value } : {})
})
const jobs = computed(() => data.value ?? [])
const shortlistStatusItems = [
  { label: 'Saved', value: 'saved' },
  { label: 'Applied', value: 'applied' },
  { label: 'Interviewing', value: 'interviewing' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Offer', value: 'offer' }
]

const statusCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const job of jobs.value) {
    counts[job.status] = (counts[job.status] ?? 0) + 1
  }
  return counts
})

function statusColor(status: string): BadgeColor {
  const map: Record<string, BadgeColor> = {
    offer: 'success', interviewing: 'primary', applied: 'warning',
    saved: 'neutral', rejected: 'error'
  }
  return map[status] ?? 'neutral'
}

async function updateStatus(job: ShortlistJob, status: string | number | boolean | bigint | null | undefined) {
  await $fetch(`/api/jobs/${job.id}/shortlist`, {
    method: 'POST', body: { status: status == null ? 'saved' : String(status), notes: job.notes }
  })
  await refresh()
}

async function remove(job: ShortlistJob) {
  await $fetch(`/api/jobs/${job.id}/shortlist`, { method: 'DELETE' })
  await refresh()
}

function exportCsv() {
  const rows = jobs.value
  const headers = ['Title', 'Company', 'Location', 'Score', 'Status', 'Notes', 'Date Added', 'Link']
  const csv = [
    headers.join(','),
    ...rows.map(j => [
      `"${j.title.replace(/"/g, '""')}"`,
      `"${j.company.replace(/"/g, '""')}"`,
      `"${j.location}"`, j.score ?? '',
      j.status, `"${(j.notes || '').replace(/"/g, '""')}"`,
      j.date_added.slice(0, 10), j.link
    ].join(','))
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `shortlist-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <UContainer class="py-6 space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-bold">
          My Shortlist
        </h1>
        <p class="text-muted text-sm mt-1">
          {{ jobs.length }} saved roles
        </p>
      </div>
      <UButton
        icon="i-lucide-download"
        variant="outline"
        @click="exportCsv"
      >
        Export CSV
      </UButton>
    </div>

    <!-- Status summary badges -->
    <div class="flex flex-wrap gap-2">
      <UBadge
        :color="!statusFilter ? 'primary' : 'neutral'"
        class="cursor-pointer"
        @click="statusFilter = ''"
      >
        All ({{ jobs.length }})
      </UBadge>
      <UBadge
        v-for="[status, count] in Object.entries(statusCounts)"
        :key="status"
        :color="statusColor(status)"
        class="cursor-pointer capitalize"
        @click="statusFilter = status"
      >
        {{ status }} ({{ count }})
      </UBadge>
    </div>

    <div
      v-if="pending"
      class="text-center text-muted py-12"
    >
      Loading…
    </div>
    <div
      v-else-if="!jobs.length"
      class="text-center text-muted py-12"
    >
      <UIcon
        name="i-lucide-star"
        class="text-4xl mb-3"
      />
      <p>No jobs shortlisted yet. Go to the Jobs board and star roles you're interested in.</p>
      <UButton
        to="/"
        class="mt-4"
      >
        Browse Jobs
      </UButton>
    </div>

    <div
      v-else
      class="space-y-3"
    >
      <div
        v-for="job in jobs"
        :key="job.id"
        class="rounded-lg border border-default bg-card p-4 space-y-3 hover:border-primary/50 transition-colors cursor-pointer"
        @click="selectedJob = job; drawerOpen = true"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate">
              {{ job.title }}
            </p>
            <p class="text-sm text-muted">
              {{ job.company }} · {{ job.location }}
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <UBadge
              v-if="job.score"
              :color="job.score >= 8 ? 'success' : job.score >= 6.5 ? 'primary' : 'warning'"
              class="font-mono font-bold"
            >
              {{ job.score.toFixed(1) }}
            </UBadge>
            <UBadge
              :color="statusColor(job.status)"
              class="capitalize"
            >
              {{ job.status }}
            </UBadge>
          </div>
        </div>

        <div
          class="flex items-center gap-2"
          @click.stop
        >
          <USelect
            :model-value="job.status"
            :items="shortlistStatusItems"
            size="xs"
            @update:model-value="updateStatus(job, $event)"
          />
          <UButton
            size="xs"
            variant="ghost"
            color="error"
            icon="i-lucide-trash-2"
            @click="remove(job)"
          />
          <UButton
            :to="job.link"
            target="_blank"
            size="xs"
            variant="outline"
            icon="i-lucide-external-link"
            @click.stop
          />
        </div>

        <p
          v-if="job.notes"
          class="text-sm text-muted italic"
        >
          {{ job.notes }}
        </p>
      </div>
    </div>
  </UContainer>
</template>
