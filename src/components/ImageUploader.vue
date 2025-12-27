<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'

const emit = defineEmits<{
  (e: 'upload', image: string): void
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const { t } = useI18n()

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file) processFile(file)
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file) {
      processFile(file)
      target.value = ''
    }
  }
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert(t('uploader.invalidFile'))
    return
  }

  // Use simple alert for now, can be replaced with Toast later
  
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      emit('upload', e.target.result as string)
    }
  }
  reader.readAsDataURL(file)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<template>
  <Card
    class="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-colors cursor-pointer hover:bg-muted/50 w-full max-w-xl mx-auto min-h-[300px]"
    :class="{ 'border-primary bg-muted/50': isDragging, 'border-muted-foreground/25': !isDragging }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="triggerFileInput"
  >
    <div class="flex flex-col items-center gap-4 text-center">
      <div class="p-4 bg-background rounded-full shadow-sm">
        <Upload class="w-8 h-8 text-muted-foreground" />
      </div>
      <div class="space-y-1">
        <h3 class="font-semibold text-lg tracking-tight">{{ t('uploader.title') }}</h3>
        <p class="text-sm text-muted-foreground">
          {{ t('uploader.subtitle') }}
        </p>
      </div>
      <Button variant="secondary" size="sm" class="mt-2 pointer-events-none">
        {{ t('uploader.selectFile') }}
      </Button>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />
  </Card>
</template>
