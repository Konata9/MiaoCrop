<script setup lang="ts">
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { Button } from '@/components/ui/button'
import { 
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical
} from 'lucide-vue-next'

const props = defineProps<{
  image: string
  aspectRatio?: number // undefined for free
}>()

const emit = defineEmits<{
  (e: 'change', result: any): void
  (e: 'update:aspectRatio', ratio: number | undefined): void
}>()

const cropper = ref<any>(null)
const localAspectRatio = ref<number | undefined>(props.aspectRatio)

const handleChange = (result: any) => {
  emit('change', result)
}

const rotate = (angle: number) => {
  cropper.value?.rotate(angle)
}

const flip = (horizontal: boolean, vertical: boolean) => {
  cropper.value?.flip(horizontal, vertical)
}

const setAspectRatio = (ratio: number | undefined) => {
  localAspectRatio.value = ratio
  emit('update:aspectRatio', ratio)
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
          aspectRatio: localAspectRatio
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
      <Button 
        variant="ghost" 
        size="sm" 
        :class="{ 'bg-secondary': !localAspectRatio }"
        @click="setAspectRatio(undefined)"
      >
        Free
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        :class="{ 'bg-secondary': localAspectRatio === 1 }"
        @click="setAspectRatio(1)"
      >
        1:1
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        :class="{ 'bg-secondary': localAspectRatio === 4/3 }"
        @click="setAspectRatio(4/3)"
      >
        4:3
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        :class="{ 'bg-secondary': localAspectRatio === 16/9 }"
        @click="setAspectRatio(16/9)"
      >
        16:9
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        :class="{ 'bg-secondary': localAspectRatio === 16/10 }"
        @click="setAspectRatio(16/10)"
      >
        16:10
      </Button>
    </div>
  </div>
</template>

<style>
.vue-advanced-cropper__background, .vue-advanced-cropper__foreground {
  background: hsl(var(--muted));
}

/* Custom crop box styles for better visibility */
.vue-simple-handler {
  background-color: rgb(59, 130, 246) !important; /* blue-500 */
  opacity: 1 !important;
}

.vue-simple-line {
  border-color: rgb(59, 130, 246) !important;
  opacity: 1 !important;
  border-width: 1px !important;
}
</style>
