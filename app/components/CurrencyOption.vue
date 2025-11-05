<template>
  <div class="flex items-center">
    <div class="flex items-center relative mr-3">
      <FlagIcon 
        :flag="currency?.base_currency?.flag" 
        size="1.2em" 
        class="relative z-10 border-2 border-white rounded-full shadow-sm" 
      />
      <FlagIcon 
        :flag="currency?.quote_currency?.flag" 
        size="1.2em" 
        class="relative -ml-2 z-20 border-2 border-white rounded-full shadow-sm" 
      />
    </div>
    <span>{{ currency?.title || '—' }}</span>
  </div>
</template>

<script setup>
defineProps({
  currency: {
    type: Object,
    default: null
  }
})
</script>
