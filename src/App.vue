<script setup lang="ts">
import { ref } from 'vue'
import { useColorMode } from '@vueuse/core'
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ImageUploader from '@/components/ImageUploader.vue'
import CropEditor from '@/components/CropEditor.vue'
import PreviewPanel from '@/components/PreviewPanel.vue'
import { useI18n } from '@/lib/i18n'

const baseUrl = import.meta.env.BASE_URL

const { locale, setLocale, t } = useI18n()

const setLocaleFromSelect = (value: unknown) => {
  if (value === 'en' || value === 'zh-CN') setLocale(value)
}

// Dark mode
const mode = useColorMode()
const toggleTheme = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}

// State
const originalImage = ref<string | null>(null)
const previewImage = ref<string | null>(null)
const cropResult = ref<any>(null)
const currentAspectRatio = ref<number | undefined>(undefined)
const editorRef = ref<any>(null) // Ref to CropEditor component

// Handlers
const handleUpload = (image: string) => {
  originalImage.value = image
  currentAspectRatio.value = undefined
}

const handleCropChange = (result: any) => {
  cropResult.value = result
  // Update preview
  if (result.canvas) {
    previewImage.value = result.canvas.toDataURL()
  }
}

const handleAspectRatioChange = (ratio: number | undefined) => {
  currentAspectRatio.value = ratio
}

const handleDownload = (format: string) => {
  if (!editorRef.value) return
  
  const { canvas } = editorRef.value.getResult()
  if (canvas) {
    const link = document.createElement('a')
    link.download = `cropped-image.${format}`
    link.href = canvas.toDataURL(`image/${format}`)
    link.click()
  }
}

const reset = () => {
  originalImage.value = null
  previewImage.value = null
  cropResult.value = null
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
    <!-- Header -->
    <header class="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center gap-2 font-bold text-xl">
          <img :src="`${baseUrl}icons/icon-32.png`" class="w-6 h-6" alt="MiaoCrop" />
          <span>MiaoCrop</span>
        </div>
        <div class="flex items-center gap-2">
          <Select :model-value="locale" @update:model-value="setLocaleFromSelect">
            <SelectTrigger class="h-9 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="zh-CN">简体中文</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" @click="toggleTheme">
            <Sun v-if="mode === 'dark'" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </Button>
          <a href="https://github.com/Konata9/MiaoCrop" target="_blank" class="text-sm font-medium hover:underline">
            GitHub
          </a>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1 container mx-auto px-4 py-8">
      <transition name="fade" mode="out-in">
        <div v-if="!originalImage" class="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div class="text-center space-y-2">
            <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">
              {{ t('hero.title') }}
            </h1>
            <p class="text-muted-foreground text-lg max-w-[600px]">
              {{ t('hero.subtitle') }}
            </p>
          </div>
          <ImageUploader @upload="handleUpload" />
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
          <!-- Editor Area -->
          <div class="lg:col-span-2 flex flex-col gap-4 h-full">
            <div class="flex items-center justify-between shrink-0">
              <h2 class="text-2xl font-semibold tracking-tight">{{ t('editor.title') }}</h2>
              <Button variant="ghost" size="sm" @click="reset" class="text-destructive hover:text-destructive hover:bg-destructive/10">
                {{ t('editor.reset') }}
              </Button>
            </div>
            <CropEditor 
              ref="editorRef"
              :image="originalImage" 
              @change="handleCropChange" 
              @update:aspect-ratio="handleAspectRatioChange"
            />
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 h-full">
            <PreviewPanel 
              :preview-url="previewImage" 
              :aspect-ratio="currentAspectRatio"
              @download="handleDownload" 
            />
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
