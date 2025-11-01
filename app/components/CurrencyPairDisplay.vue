<template>
  <div class="flex items-center justify-center mb-8">
    <FlagIcon 
      :flag="baseCurrency?.flag || 'circle-flags:xx'" 
      size="4em" 
      class="mx-2" 
    />
    <span class="text-secondary text-2xl mx-3 rtl:rotate-180">→</span>
    <FlagIcon 
      :flag="quoteCurrency?.flag || 'circle-flags:xx'" 
      size="4em" 
      class="mx-2" 
    />
  </div>
</template>

<script setup>
defineProps({
  baseCurrency: {
    type: Object,
    default: null
  },
  quoteCurrency: {
    type: Object,
    default: null
  }
})
</script>
