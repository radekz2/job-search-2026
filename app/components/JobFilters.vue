<script setup lang="ts">
type FilterField = 'bucket' | 'level' | 'rec' | 'remote' | 'score_max' | 'score_min' | 'search' | 'source'

const props = defineProps<{
  modelValue: {
    source: string
    bucket: string
    level: string
    remote: string
    score_min: string
    score_max: string
    rec: string
    search: string
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: typeof props.modelValue]
}>()

const sources = ['LinkedIn', 'Job Bank', 'Greenhouse', 'Lever', 'Ashby', 'Workday', 'Adzuna', 'BuiltIn', 'RemoteOK']

function update(field: FilterField, value: string | number | boolean | bigint | null | undefined) {
  emit('update:modelValue', { ...props.modelValue, [field]: value == null ? '' : String(value) })
}

function clear() {
  emit('update:modelValue', {
    source: '', bucket: '', level: '', remote: '',
    score_min: '', score_max: '', rec: '', search: ''
  })
}
</script>

<template>
  <div class="flex flex-wrap gap-3 items-end">
    <UInput
      :model-value="modelValue.search"
      placeholder="Search title, company, location…"
      icon="i-lucide-search"
      class="w-64"
      @update:model-value="update('search', $event)"
    />

    <USelect
      :model-value="modelValue.source"
      :items="[{ label: 'All sources', value: '' }, ...sources.map(s => ({ label: s, value: s }))]"
      @update:model-value="update('source', $event)"
    />

    <USelect
      :model-value="modelValue.bucket"
      :items="[
        { label: 'All buckets', value: '' },
        { label: 'IT / Technology', value: 'it' },
        { label: 'Software / Engineering', value: 'sw' }
      ]"
      @update:model-value="update('bucket', $event)"
    />

    <USelect
      :model-value="modelValue.level"
      :items="[
        { label: 'All levels', value: '' },
        { label: 'Director', value: 'director' },
        { label: 'Manager', value: 'manager' }
      ]"
      @update:model-value="update('level', $event)"
    />

    <USelect
      :model-value="modelValue.remote"
      :items="[
        { label: 'On-site & Remote', value: '' },
        { label: 'Remote only', value: '1' },
        { label: 'On-site only', value: '0' }
      ]"
      @update:model-value="update('remote', $event)"
    />

    <USelect
      :model-value="modelValue.rec"
      :items="[
        { label: 'All recommendations', value: '' },
        { label: 'Apply', value: 'Apply' },
        { label: 'Review', value: 'Review' },
        { label: 'Skip', value: 'Skip' }
      ]"
      @update:model-value="update('rec', $event)"
    />

    <div class="flex gap-2 items-center">
      <span class="text-sm text-muted">Score</span>
      <UInput
        :model-value="modelValue.score_min"
        type="number"
        min="0"
        max="10"
        step="0.5"
        placeholder="Min"
        class="w-20"
        @update:model-value="update('score_min', $event)"
      />
      <span class="text-muted">–</span>
      <UInput
        :model-value="modelValue.score_max"
        type="number"
        min="0"
        max="10"
        step="0.5"
        placeholder="Max"
        class="w-20"
        @update:model-value="update('score_max', $event)"
      />
    </div>

    <UButton
      variant="ghost"
      icon="i-lucide-x"
      @click="clear"
    >
      Clear
    </UButton>
  </div>
</template>
