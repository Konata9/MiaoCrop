<script setup lang="ts">
import { ref } from 'vue'
import { useColorMode } from '@vueuse/core'
import { Moon, Sun, Upload, Github, BookOpen } from 'lucide-vue-next'
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
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { removeWhiteBackground, resizeImage, generateIcons, cropImage } from '@/lib/image-processing'

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
const isDraggingOver = ref(false)

// Handlers
const handleDragOver = (e: DragEvent) => {
  if (!originalImage.value) return
  e.preventDefault()
  isDraggingOver.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  if (e.currentTarget && (e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
    return
  }
  isDraggingOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDraggingOver.value = false
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (!file) return

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          handleUpload(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    } else {
      alert(t('uploader.invalidFile'))
    }
  }
}

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

// Handlers
const handleDownload = async (payload: any) => {
  if (!editorRef.value || !originalImage.value) return
  
  const { coordinates } = editorRef.value.getResult()
  if (!coordinates) return

  const { mode, transparent } = payload
  
  // Lossless crop from original image
  let url = await cropImage(originalImage.value, coordinates)

  try {
    if (transparent) {
      const newUrl = await removeWhiteBackground(url)
      url = newUrl
    }

    if (mode === 'standard') {
      const { format } = payload
      if (format === 'png' || transparent) {
        saveAs(url, `cropped-image.png`)
      } else {
        // Create a temporary canvas to export with quality 1.0
        const img = new Image()
        await new Promise((resolve) => {
          img.onload = resolve
          img.src = url
        })
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = img.width
        tempCanvas.height = img.height
        const ctx = tempCanvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        
        tempCanvas.toBlob((b: Blob | null) => {
          if (b) saveAs(b, `cropped-image.${format}`)
        }, `image/${format}`, 1.0)
      }
    } else if (mode === 'icons') {
      const { sizes } = payload
      const zip = new JSZip()
      const icons = await generateIcons(url, sizes)
      
      icons.forEach(({ size, url: iconUrl }) => {
        const data = iconUrl.replace(/^data:image\/(png|jpeg);base64,/, "")
        zip.file(`icon-${size}x${size}.png`, data, { base64: true })
      })
      
      const content = await zip.generateAsync({ type: "blob" })
      saveAs(content, "icons.zip")
    } else if (mode === 'cover') {
      const { width, height } = payload
      const resizedUrl = await resizeImage(url, width, height, 'contain')
      saveAs(resizedUrl, `cover-${width}x${height}.png`)
    }
  } catch (error) {
    console.error('Download error:', error)
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
        <div class="flex items-center gap-6">
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
          <div class="flex items-center gap-4">
            <Button variant="ghost" size="icon" @click="toggleTheme" class="rounded-full">
              <Sun v-if="mode === 'dark'" class="w-5 h-5" />
              <Moon v-else class="w-5 h-5" />
            </Button>
            <div class="h-4 w-px bg-border/60 mx-1"></div>
            <a href="https://github.com/Konata9/MiaoCrop" target="_blank" class="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <Github class="w-4 h-4" />
              GitHub
            </a>
            <a href="https://konata9.cc" target="_blank" class="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <BookOpen class="w-4 h-4" />
              Blog
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1 container mx-auto px-4 py-4 lg:py-6 flex flex-col min-h-0">
      <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-0 gap-6 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        <!-- Editor Area -->
        <div class="lg:col-span-2 flex flex-col gap-4 lg:h-full lg:min-h-0 lg:overflow-hidden lg:pr-6">
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
          
          <div 
            class="flex-1 min-h-[500px] lg:min-h-0 lg:overflow-hidden relative rounded-xl overflow-hidden"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
          >
            <div 
              v-if="isDraggingOver && originalImage" 
              class="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-primary rounded-xl animate-in fade-in zoom-in-95 duration-200 pointer-events-none"
            >
              <Upload class="w-12 h-12 text-primary mb-4" />
              <h3 class="text-xl font-semibold">{{ t('editor.dropToReplace') }}</h3>
            </div>

            <transition name="fade" mode="out-in" class="h-full">
              <ImageUploader 
                v-if="!originalImage" 
                class="h-full border-dashed border-2 border-muted-foreground/20 rounded-xl shadow-none hover:bg-muted/30 transition-colors" 
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
        <div class="lg:col-span-1 flex flex-col gap-4 lg:h-full lg:min-h-0 lg:overflow-hidden lg:border-l lg:pl-6">
          <div class="flex items-center justify-between shrink-0 h-10">
            <h2 class="text-2xl font-semibold tracking-tight"></h2>
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
