<template>
  <Icon 
    :icon="flag" 
    :class="iconClass"
    :style="{ fontSize: size }"
  />
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  flag: String,
  size: {
    type: [String, Number],
    default: '1.5em'
  },
  class: {
    type: String,
    default: ''
  }
})

const flagIconName = computed(() => {
  if (!props.countryCode) return 'circle-flags:xx'
  
  const code = props.countryCode.toLowerCase().trim()
  
  if (code.length !== 2) {
    return 'circle-flags:xx'
  }
  
  return `circle-flags:${code}`
})

const iconClass = computed(() => {
  return props.class || ''
})
</script>
