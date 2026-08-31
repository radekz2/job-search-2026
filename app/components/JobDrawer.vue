<script setup lang="ts">
type BadgeColor = 'error' | 'neutral' | 'primary' | 'success' | 'warning'

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

defineProps<{
  job: Job | null
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'shortlist': [job: Job]
  'removeShortlist': [job: Job]
}>()

const statusOptions = [
  { label: 'Saved', value: 'saved' },
  { label: 'Applied', value: 'applied' },
  { label: 'Interviewing', value: 'interviewing' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Offer', value: 'offer' }
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

function updateShortlistStatus(job: Job, status: string | number | boolean | bigint | null | undefined) {
  emit('shortlist', { ...job, shortlist_status: status == null ? null : String(status) })
}

function updateShortlistNotes(job: Job, notes: string | number | null) {
  emit('shortlist', { ...job, shortlist_notes: notes == null ? null : String(notes) })
}
</script>

<template>
  <USlideover
    :open="open"
    :title="job?.title ?? ''"
    @update:open="emit('update:open', $event)"
  >
    <template
      v-if="job"
      #body
    >
      <div class="space-y-4 pb-6">
        <!-- Header meta -->
        <div class="flex flex-wrap gap-2 items-center">
          <UBadge
            :color="scoreColor(job.score)"
            class="font-mono font-bold text-base"
          >
            {{ job.score?.toFixed(1) ?? '—' }} / 10
          </UBadge>
          <UBadge
            v-if="job.recommendation"
            :color="recColor(job.recommendation)"
          >
            {{ job.recommendation }}
          </UBadge>
          <UBadge variant="outline">
            {{ job.source }}
          </UBadge>
          <UBadge
            v-if="job.remote"
            color="success"
            variant="soft"
          >
            Remote
          </UBadge>
        </div>

        <!-- Company / location -->
        <div class="text-sm text-muted space-y-1">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-building-2" />
            <span>{{ job.company }}</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-map-pin" />
            <span>{{ job.location }}</span>
            <span
              v-if="job.telework"
              class="text-xs"
            >({{ job.telework }})</span>
          </div>
          <div
            v-if="job.salary"
            class="flex items-center gap-2"
          >
            <UIcon name="i-lucide-banknote" />
            <span>{{ job.salary }}</span>
          </div>
          <div
            v-if="job.date_posted"
            class="flex items-center gap-2"
          >
            <UIcon name="i-lucide-calendar" />
            <span>Posted {{ job.date_posted }}</span>
          </div>
        </div>

        <!-- LLM Rationale -->
        <div
          v-if="job.score_rationale"
          class="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2"
        >
          <p class="font-semibold text-sm">
            LLM Assessment
          </p>
          <p class="text-sm">
            {{ job.score_rationale }}
          </p>
          <div
            v-if="job.strengths"
            class="text-sm"
          >
            <span class="font-medium text-success">Strengths: </span>{{ job.strengths }}
          </div>
          <div
            v-if="job.concerns"
            class="text-sm"
          >
            <span class="font-medium text-warning">Concerns: </span>{{ job.concerns }}
          </div>
        </div>

        <!-- Apply link -->
        <UButton
          :to="job.link"
          target="_blank"
          icon="i-lucide-external-link"
          block
        >
          View on {{ job.source }}
        </UButton>

        <!-- Shortlist controls -->
        <div v-if="job.shortlisted">
          <UDivider label="Shortlist" />
          <div class="mt-3 space-y-2">
            <USelect
              :model-value="job.shortlist_status ?? 'saved'"
              :items="statusOptions"
              @update:model-value="updateShortlistStatus(job, $event)"
            />
            <UTextarea
              :model-value="job.shortlist_notes ?? ''"
              placeholder="Notes for this application…"
              :rows="3"
              @update:model-value="updateShortlistNotes(job, $event)"
            />
            <UButton
              variant="outline"
              color="error"
              icon="i-lucide-star-off"
              block
              @click="emit('removeShortlist', job)"
            >
              Remove from shortlist
            </UButton>
          </div>
        </div>
        <UButton
          v-else
          icon="i-lucide-star"
          block
          @click="emit('shortlist', job)"
        >
          Add to shortlist
        </UButton>

        <!-- Description -->
        <div v-if="job.description">
          <UDivider label="Job Description" />
          <p class="mt-3 text-sm text-muted whitespace-pre-line leading-relaxed">
            {{ job.description.slice(0, 3000) }}{{ job.description.length > 3000 ? '…' : '' }}
          </p>
        </div>
      </div>
    </template>
  </USlideover>
</template>
