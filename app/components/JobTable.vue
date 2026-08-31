<script setup lang="ts">
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
  bucket: string
  level: string
  score: number | null
  score_rationale: string
  recommendation: string
  strengths: string
  concerns: string
  shortlisted: 0 | 1
  shortlist_status: string | null
  shortlist_notes: string | null
}

const props = defineProps<{
  jobs: Job[]
  loading: boolean
}>()

const emit = defineEmits<{
  select: [job: Job]
  shortlist: [job: Job]
}>()

const columns = [
  { key: 'score', label: 'Score', sortable: true },
  { key: 'title', label: 'Title' },
  { key: 'company', label: 'Company' },
  { key: 'location', label: 'Location' },
  { key: 'source', label: 'Source' },
  { key: 'recommendation', label: 'Rec' },
  { key: 'actions', label: '' },
]

function scoreColor(score: number | null): string {
  if (score === null) return 'neutral'
  if (score >= 8) return 'success'
  if (score >= 6.5) return 'primary'
  if (score >= 5) return 'warning'
  return 'error'
}

function recColor(rec: string): string {
  if (rec === 'Apply') return 'success'
  if (rec === 'Review') return 'warning'
  return 'neutral'
}

function sourceColor(source: string): string {
  const map: Record<string, string> = {
    LinkedIn: 'primary', 'Job Bank': 'success', Greenhouse: 'secondary',
    Lever: 'info', Ashby: 'warning', Workday: 'primary', Adzuna: 'error',
  }
  return map[source] ?? 'neutral'
}
</script>

<template>
  <UTable
    :rows="jobs"
    :columns="columns"
    :loading="loading"
    hover
    @select="emit('select', $event)"
  >
    <template #score-data="{ row }">
      <UBadge :color="scoreColor(row.score)" variant="soft" class="font-mono font-bold">
        {{ row.score?.toFixed(1) ?? '—' }}
      </UBadge>
    </template>

    <template #title-data="{ row }">
      <div class="flex items-center gap-2">
        <span class="font-medium">{{ row.title }}</span>
        <UIcon v-if="row.shortlisted" name="i-lucide-star" class="text-warning text-sm" />
      </div>
    </template>

    <template #source-data="{ row }">
      <UBadge :color="sourceColor(row.source)" variant="outline" size="xs">
        {{ row.source }}
      </UBadge>
    </template>

    <template #location-data="{ row }">
      <div class="flex items-center gap-1 text-sm text-muted">
        <UIcon v-if="row.remote" name="i-lucide-wifi" class="text-success" />
        {{ row.location || '—' }}
      </div>
    </template>

    <template #recommendation-data="{ row }">
      <UBadge v-if="row.recommendation" :color="recColor(row.recommendation)" size="xs">
        {{ row.recommendation }}
      </UBadge>
    </template>

    <template #actions-data="{ row }">
      <UButton
        :icon="row.shortlisted ? 'i-lucide-star-off' : 'i-lucide-star'"
        :color="row.shortlisted ? 'warning' : 'neutral'"
        variant="ghost"
        size="xs"
        @click.stop="emit('shortlist', row)"
      />
    </template>
  </UTable>
</template>
