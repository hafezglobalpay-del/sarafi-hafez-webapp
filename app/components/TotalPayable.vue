<template>
  <Card class="border-gray-200 mb-8" style="background-color: #e9e9e9;">
    <template #content>
      <div class="p-3 md:p-2">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-2">
          <span class="text-sm sm:text-base font-medium text-gray-700 text-center sm:text-right">
            {{ $t('totalPayable') }}
          </span>
          <div class="flex items-center">
            <FlagIcon 
              :flag="currency?.flag || 'circle-flags:xx'" 
              size="1.2em" 
              class="mx-2" 
            />
            <span v-if="isLoading" class="font-bold text-lg sm:text-xl text-gray-500">
              {{ $t('calculating') }}
            </span>
            <span v-else-if="amount" class="font-bold text-lg sm:text-xl break-all">
              {{ Number(amount).toLocaleString() }} {{ currency?.symbol }}
            </span>
            <span v-else class="font-bold text-lg sm:text-xl text-gray-500">
              {{ $t('enterAmount') }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
defineProps({
  amount: {
    type: [String, Number],
    default: null
  },
  currency: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})
</script>
