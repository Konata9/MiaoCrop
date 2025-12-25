<script setup lang="ts">
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { Button } from '@/components/ui/button'
import { 
  RotateCcw, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical,
  Minus,
  Plus
} from 'lucide-vue-next'

const props = defineProps<{
  image: string
  aspectRatio?: number // undefined for free
}>()

const emit = defineEmits<{
  (e: 'change', result: any): void
}>()

const cropper = ref<any>(null)

const handleChange = (result: any) => {
  emit('change', result)
}

const rotate = (angle: number) => {
  cropper.value?.rotate(angle)
}

const flip = (horizontal: boolean, vertical: boolean) => {
  cropper.value?.flip(horizontal, vertical)
}

const zoom = (factor: number) => {
  cropper.value?.zoom(factor)
}

defineExpose({
  getResult: () => cropper.value?.getResult()
})
</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <div class="relative flex-1 min-h-[400px] bg-secondary/30 rounded-lg overflow-hidden border">
      <Cropper
        ref="cropper"
        class="cropper h-full"
        :src="image"
        :stencil-props="{
          aspectRatio: aspectRatio
        }"
        @change="handleChange"
      />
    </div>
    
    <div class="flex flex-wrap items-center justify-center gap-2 p-2 bg-background border rounded-lg shadow-sm">
      <Button variant="ghost" size="icon" @click="rotate(-90)" title="Rotate Left">
        <RotateCcw class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" @click="rotate(90)" title="Rotate Right">
        <RotateCw class="w-4 h-4" />
      </Button>
      <div class="w-px h-6 bg-border mx-1"></div>
      <Button variant="ghost" size="icon" @click="flip(true, false)" title="Flip Horizontal">
        <FlipHorizontal class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" @click="flip(false, true)" title="Flip Vertical">
        <FlipVertical class="w-4 h-4" />
      </Button>
      <div class="w-px h-6 bg-border mx-1"></div>
      <Button variant="ghost" size="icon" @click="zoom(0.8)" title="Zoom Out">
        <Minus class="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" @click="zoom(1.2)" title="Zoom In">
        <Plus class="w-4 h-4" />
      </Button>
    </div>
  </div>
</template>

<style>
.vue-advanced-cropper__background, .vue-advanced-cropper__foreground {
  background: hsl(var(--muted));
}
</style>
