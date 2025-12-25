<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download } from 'lucide-vue-next'

const props = defineProps<{
  previewUrl: string | null
}>()

const emit = defineEmits<{
  (e: 'download', format: string): void
}>()

const format = ref('png')

const handleDownload = () => {
  if (!props.previewUrl) return
  emit('download', format.value)
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4 border rounded-lg bg-card h-full">
    <h3 class="font-semibold text-lg">Preview</h3>
    
    <div class="flex-1 flex items-center justify-center bg-muted/30 rounded-lg border border-dashed min-h-[200px] overflow-hidden relative p-4">
      <img v-if="previewUrl" :src="previewUrl" class="max-w-full max-h-[300px] object-contain shadow-sm rounded-sm" />
      <div v-else class="text-muted-foreground text-sm flex flex-col items-center gap-2">
        <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center opacity-50">
          <Download class="w-6 h-6" />
        </div>
        No preview available
      </div>
    </div>
    
    <div class="space-y-4 pt-4 border-t">
      <div class="space-y-2">
        <Label>Output Format</Label>
        <Select v-model="format">
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="webp">WebP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button class="w-full" :disabled="!previewUrl" @click="handleDownload">
        <Download class="w-4 h-4 mr-2" />
        Download Image
      </Button>
    </div>
  </div>
</template>
