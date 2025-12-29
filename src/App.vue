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
import MiaoMintAd from '@/components/MiaoMintAd.vue'
import { useI18n } from '@/lib/i18n'

const baseUrl = import.meta.env.BASE_URL

const { locale, setLocale, t } = useI18n()

const setLocaleFromSelect = (value: unknown) => {
  if (value === 'en' || value === 'zh-CN' || value === 'ja') setLocale(value)
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
  <div class="min-h-screen lg:h-screen lg:overflow-hidden bg-background text-foreground flex flex-col transition-colors duration-300">
    <!-- Header -->
    <header class="border-b shrink-0 bg-background/95 backdrop-blur z-50">
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
              <SelectItem value="ja">日本語</SelectItem>
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
    <main class="flex-1 container mx-auto px-4 py-4 lg:py-6 flex flex-col min-h-0">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        <!-- Editor Area -->
        <div class="lg:col-span-2 flex flex-col gap-4 lg:h-full lg:min-h-0 lg:overflow-hidden">
          <div class="flex items-center justify-between shrink-0 h-10">
            <h2 class="text-2xl font-semibold tracking-tight">{{ t('editor.title') }}</h2>
            <Button 
              v-if="originalImage"
              variant="ghost" 
              size="sm" 
              @click="reset" 
              class="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {{ t('editor.reset') }}
            </Button>
          </div>
          
          <div class="flex-1 min-h-[500px] lg:min-h-0 lg:overflow-hidden">
            <transition name="fade" mode="out-in" class="h-full">
              <ImageUploader 
                v-if="!originalImage" 
                class="h-full border-dashed border-2 rounded-lg shadow-none bg-secondary/30" 
                @upload="handleUpload" 
              />
              <CropEditor 
                v-else
                ref="editorRef"
                :image="originalImage" 
                @change="handleCropChange" 
                @update:aspect-ratio="handleAspectRatioChange"
              />
            </transition>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 flex flex-col gap-4 lg:h-full lg:min-h-0 lg:overflow-hidden">
          <div class="flex items-center justify-between shrink-0 h-10">
            <h2 class="text-2xl font-semibold tracking-tight">{{ t('export.title') }}</h2>
          </div>
          <div class="shrink-0">
            <MiaoMintAd />
          </div>
          <div class="flex-1 min-h-0 lg:overflow-hidden">
            <PreviewPanel 
              :preview-url="previewImage" 
              :aspect-ratio="currentAspectRatio"
              @download="handleDownload" 
              class="h-full"
            />
          </div>
        </div>
      </div>
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
