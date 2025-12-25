<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { Download, Loader2, Package, Calculator } from 'lucide-vue-next'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { 
  removeWhiteBackground, 
  resizeImage, 
  generateIcons, 
  ICON_SIZES 
} from '@/lib/image-processing'

const props = defineProps<{
  previewUrl: string | null
  aspectRatio?: number
}>()

const emit = defineEmits<{
  (e: 'download', format: string): void
}>()

// State
const activeTab = ref('standard')
const format = ref('png')
const transparentBg = ref(false)
const processing = ref(false)

// Custom Cover State
const customWidth = ref<number | undefined>(undefined)
const customHeight = ref<number | undefined>(undefined)

// Auto-calculate dimensions based on aspect ratio
watch(() => customWidth.value, (newWidth) => {
  if (props.aspectRatio && newWidth && document.activeElement?.id === 'custom-width') {
    customHeight.value = Math.round(newWidth / props.aspectRatio)
  }
})

watch(() => customHeight.value, (newHeight) => {
  if (props.aspectRatio && newHeight && document.activeElement?.id === 'custom-height') {
    customWidth.value = Math.round(newHeight * props.aspectRatio)
  }
})

// Reset custom inputs when aspect ratio changes
watch(() => props.aspectRatio, () => {
  // Optional: clear inputs or recalculate if one exists
  if (props.aspectRatio && customWidth.value) {
    customHeight.value = Math.round(customWidth.value / props.aspectRatio)
  }
})

// Icon Generator State
const selectedSizes = ref<number[]>([...ICON_SIZES])

// Standard Download
const handleStandardDownload = async () => {
  if (!props.previewUrl) return
  
  try {
    processing.value = true
    let url = props.previewUrl

    // Apply transparent background if selected
    if (transparentBg.value) {
      url = await removeWhiteBackground(url)
    }

    const link = document.createElement('a')
    link.href = url
    link.download = `cropped-image.${format.value}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error processing image:', error)
  } finally {
    processing.value = false
  }
}

// Icon Generator
const toggleSize = (size: number) => {
  if (selectedSizes.value.includes(size)) {
    selectedSizes.value = selectedSizes.value.filter(s => s !== size)
  } else {
    selectedSizes.value.push(size)
  }
}

const handleIconDownload = async () => {
  if (!props.previewUrl || selectedSizes.value.length === 0) return
  
  try {
    processing.value = true
    let sourceUrl = props.previewUrl
    
    // Apply transparent background if selected (usually desired for icons)
    if (transparentBg.value) {
      sourceUrl = await removeWhiteBackground(sourceUrl)
    }

    const icons = await generateIcons(sourceUrl, selectedSizes.value)
    
    const zip = new JSZip()
    
    // Add original
    const originalBlob = await (await fetch(sourceUrl)).blob()
    zip.file(`icon-original.png`, originalBlob)

    // Add resized icons
    for (const icon of icons) {
      const blob = await (await fetch(icon.url)).blob()
      zip.file(`icon-${icon.size}.png`, blob)
    }

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'icons.zip')
  } catch (error) {
    console.error('Error generating icons:', error)
  } finally {
    processing.value = false
  }
}

// Cover Generator
const handleCoverDownload = async (width: number, height: number) => {
  if (!props.previewUrl) return
  
  try {
    processing.value = true
    let url = props.previewUrl

    if (transparentBg.value) {
      url = await removeWhiteBackground(url)
    }

    const resizedUrl = await resizeImage(url, width, height, 'contain')
    
    const link = document.createElement('a')
    link.href = resizedUrl
    link.download = `cover-${width}x${height}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error generating cover:', error)
  } finally {
    processing.value = false
  }
}

const handleCustomCoverDownload = () => {
  if (customWidth.value && customHeight.value) {
    handleCoverDownload(customWidth.value, customHeight.value)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4 border rounded-lg bg-card h-full overflow-hidden">
    <div class="flex items-center justify-between shrink-0">
      <h3 class="font-semibold text-lg">Export</h3>
    </div>
    
    <!-- Preview Area (Compact) -->
    <div class="h-[180px] shrink-0 flex items-center justify-center bg-muted/30 rounded-lg border border-dashed overflow-hidden relative p-4">
      <img 
        v-if="previewUrl" 
        :src="previewUrl" 
        class="max-w-full max-h-[160px] object-contain shadow-sm rounded-sm transition-all"
        :class="{ 'bg-[url(/checkerboard.svg)]': transparentBg }"
      />
      <div v-else class="text-muted-foreground text-sm flex flex-col items-center gap-2">
        <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center opacity-50">
          <Download class="w-6 h-6" />
        </div>
        No preview
      </div>
    </div>
    
    <!-- Controls (Expanded) -->
    <div class="flex-1 min-h-0 flex flex-col space-y-4 pt-4 border-t">
      <div class="flex items-center space-x-2 shrink-0">
        <Switch id="transparent-mode" v-model:checked="transparentBg" />
        <Label htmlFor="transparent-mode">Remove White Background</Label>
      </div>

      <Tabs v-model="activeTab" default-value="standard" class="w-full flex-1 flex flex-col min-h-0">
        <TabsList class="grid w-full grid-cols-3 shrink-0">
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="icons">Icons</TabsTrigger>
          <TabsTrigger value="covers">Covers</TabsTrigger>
        </TabsList>

        <!-- Standard Tab -->
        <TabsContent value="standard" class="flex-1 overflow-y-auto space-y-4 pt-4 pr-1">
          <div class="space-y-4 p-1">
            <div class="space-y-2">
              <Label>Format</Label>
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
            
            <div class="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              <p>Standard export mode. Best for general use.</p>
            </div>
          </div>
          
          <Button class="w-full mt-auto" size="lg" :disabled="!previewUrl || processing" @click="handleStandardDownload">
            <Loader2 v-if="processing" class="w-4 h-4 mr-2 animate-spin" />
            <Download v-else class="w-4 h-4 mr-2" />
            Download Image
          </Button>
        </TabsContent>

        <!-- Icons Tab -->
        <TabsContent value="icons" class="flex-1 overflow-y-auto space-y-4 pt-4 pr-1">
          <div class="space-y-4 p-1">
            <div class="text-sm text-muted-foreground mb-2">
              Select icon sizes to generate:
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="size in ICON_SIZES" :key="size" class="flex items-center space-x-2 border p-2 rounded hover:bg-muted/50 transition-colors">
                <Checkbox 
                  :id="`size-${size}`" 
                  :checked="selectedSizes.includes(size)"
                  @update:checked="toggleSize(size)"
                />
                <label
                  :for="`size-${size}`"
                  class="text-sm font-medium leading-none flex-1 cursor-pointer"
                >
                  {{ size }}x{{ size }}
                </label>
              </div>
            </div>
          </div>
          
          <Button class="w-full mt-auto" size="lg" :disabled="!previewUrl || processing" @click="handleIconDownload">
            <Loader2 v-if="processing" class="w-4 h-4 mr-2 animate-spin" />
            <Package v-else class="w-4 h-4 mr-2" />
            Download ZIP
          </Button>
        </TabsContent>

        <!-- Covers Tab -->
        <TabsContent value="covers" class="flex-1 overflow-y-auto space-y-4 pt-4 pr-1">
          <div class="grid grid-cols-1 gap-3 p-1">
            <!-- Presets -->
            <Button 
              variant="outline" 
              class="justify-between h-16 px-4"
              :disabled="!previewUrl || processing"
              @click="handleCoverDownload(1280, 800)"
            >
              <div class="flex flex-col items-start gap-1">
                <span class="font-semibold">1280 x 800</span>
                <span class="text-xs text-muted-foreground">MacBook Air / Laptop</span>
              </div>
              <Download class="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button 
              variant="outline" 
              class="justify-between h-16 px-4"
              :disabled="!previewUrl || processing"
              @click="handleCoverDownload(640, 400)"
            >
              <div class="flex flex-col items-start gap-1">
                <span class="font-semibold">640 x 400</span>
                <span class="text-xs text-muted-foreground">Thumbnail / Preview</span>
              </div>
              <Download class="w-4 h-4 text-muted-foreground" />
            </Button>
            
            <!-- Custom Dimensions -->
            <div class="space-y-3 pt-2 border-t mt-2">
              <Label class="text-xs font-semibold text-muted-foreground uppercase">Custom Size</Label>
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <Label for="custom-width" class="text-xs">Width (px)</Label>
                  <Input 
                    id="custom-width" 
                    type="number" 
                    v-model="customWidth" 
                    placeholder="Width"
                    min="1"
                  />
                </div>
                <div class="space-y-1.5">
                  <Label for="custom-height" class="text-xs">Height (px)</Label>
                  <Input 
                    id="custom-height" 
                    type="number" 
                    v-model="customHeight" 
                    placeholder="Height"
                    min="1"
                  />
                </div>
              </div>
              
              <Button 
                class="w-full" 
                variant="secondary"
                :disabled="!previewUrl || processing || !customWidth || !customHeight"
                @click="handleCustomCoverDownload"
              >
                <Calculator class="w-4 h-4 mr-2" />
                Download Custom
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
