<script setup lang="ts">
import type { ColumnDef, Row } from '@tanstack/vue-table'

type BadgeColor = 'error' | 'info' | 'neutral' | 'primary' | 'secondary' | 'success' | 'warning'

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
  shortlisted: 0 | 1
  shortlist_status: string | null
  shortlist_notes: string | null
}

defineProps<{
  jobs: Job[]
  loading: boolean
}>()

const emit = defineEmits<{
  select: [job: Job]
  shortlist: [job: Job]
}>()

const columns: ColumnDef<Job>[] = [
  { accessorKey: 'score', header: 'Score', enableSorting: true },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'company', header: 'Company' },
  { accessorKey: 'location', header: 'Location' },
  { accessorKey: 'source', header: 'Source' },
  { accessorKey: 'recommendation', header: 'Rec' },
  { id: 'actions', header: '' }
]

function scoreColor(score: number | null): BadgeColor {
  if (score === null) return 'neutral'
  if (score >= 8) return 'success'
  if (score >= 6.5) return 'primary'
  if (score >= 5) return 'warning'
  return 'error'
}

function recColor(rec: string): BadgeColor {
  if (rec === 'Apply') return 'success'
  if (rec === 'Review') return 'warning'
  return 'neutral'
}

function sourceColor(source: string): BadgeColor {
  const map: Record<string, BadgeColor> = {
    'LinkedIn': 'primary', 'Job Bank': 'success', 'Greenhouse': 'secondary',
    'Lever': 'info', 'Ashby': 'warning', 'Workday': 'primary', 'Adzuna': 'error'
  }
  return map[source] ?? 'neutral'
}

function handleSelect(_: Event, row: Row<Job>) {
  emit('select', row.original)
}

function handleShortlist(row: Row<Job>) {
  emit('shortlist', row.original)
}
</script>

<template>
  <UTable
    :data="jobs"
    :columns="columns"
    :loading="loading"
    hover
    @select="handleSelect"
  >
    <template #score-data="{ row }">
      <UBadge
        :color="scoreColor(row.original.score)"
        variant="soft"
        class="font-mono font-bold"
      >
        {{ row.original.score?.toFixed(1) ?? '—' }}
      </UBadge>
    </template>

    <template #title-data="{ row }">
      <div class="flex items-center gap-2">
        <span class="font-medium">{{ row.original.title }}</span>
        <UIcon
          v-if="row.original.shortlisted"
          name="i-lucide-star"
          class="text-warning text-sm"
        />
      </div>
    </template>

    <template #source-data="{ row }">
      <UBadge
        :color="sourceColor(row.original.source)"
        variant="outline"
        size="xs"
      >
        {{ row.original.source }}
      </UBadge>
    </template>

    <template #location-data="{ row }">
      <div class="flex items-center gap-1 text-sm text-muted">
        <UIcon
          v-if="row.original.remote"
          name="i-lucide-wifi"
          class="text-success"
        />
        {{ row.original.location || '—' }}
      </div>
    </template>

    <template #recommendation-data="{ row }">
      <UBadge
        v-if="row.original.recommendation"
        :color="recColor(row.original.recommendation)"
        size="xs"
      >
        {{ row.original.recommendation }}
      </UBadge>
    </template>

    <template #actions-data="{ row }">
      <UButton
        :icon="row.original.shortlisted ? 'i-lucide-star-off' : 'i-lucide-star'"
        :color="row.original.shortlisted ? 'warning' : 'neutral'"
        variant="ghost"
        size="xs"
        @click.stop="handleShortlist(row)"
      />
    </template>
  </UTable>
</template>
