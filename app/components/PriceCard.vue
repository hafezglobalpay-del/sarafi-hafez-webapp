<template>
  <Card class="border-2 box-shadow-none" style="border-color: #1E40AF;">
    <template #content>
      <div class="p-4">
        <div class="flex items-center justify-center mb-3">
          <FlagIcon 
            :flag="currency?.flag || 'circle-flags:xx'" 
            size="1.2em" 
            class="mx-2 flex-shrink-0" 
          />
          <span class="text-sm font-medium text-secondary text-center leading-tight">
            {{ $t(labelKey) }} {{ currency?.name }}
          </span>
        </div>
        <div class="text-center">
          <div class="text-2xl md:text-3xl font-bold text-secondary break-all">
            {{ formattedPrice }}
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
const props = defineProps({
  currency: {
    type: Object,
    default: null
  },
  price: {
    type: [String, Number],
    default: null
  },
  labelKey: {
    type: String,
    required: true
  }
})

const formattedPrice = computed(() => {
  return props.price ? Number(props.price).toLocaleString() : ''
})
</script>
