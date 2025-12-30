<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'

const { t } = useI18n()
</script>

<template>
  <a 
    href="https://miaomint.konata9.cc/" 
    target="_blank"
    class="block group outline-none"
  >
    <Card class="flex items-center gap-3 p-3 bg-gradient-to-br from-background to-secondary/20 hover:to-secondary/40 transition-all border-dashed hover:border-solid hover:border-primary/50 group-focus-visible:ring-2 ring-primary">
      <div class="shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
        <img src="https://miaomint.konata9.cc/logo.png" alt="MiaoMint Logo" class="w-full h-full object-cover" />
      </div>
      <div class="flex-1 min-w-0 space-y-0.5">
        <div class="flex items-center justify-between gap-2">
          <h4 class="font-semibold text-sm leading-none truncate pr-1">MiaoMint</h4>
          <span class="text-[10px] uppercase font-bold text-muted-foreground/70 bg-secondary px-1.5 py-0.5 rounded border">
            Ad
          </span>
        </div>
        <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {{ t('ad.miaomint.desc') }}
        </p>
      </div>
    </Card>
  </a>
</template>
