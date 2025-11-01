<template>
  <div class="mb-8">
    <label class="block text-lg font-medium text-gray-700 mb-4 rtl:text-right">
      {{ $t('selectCurrency') }}
    </label>
    <Dropdown 
      :modelValue="selectedCurrency" 
      :options="currencies" 
      optionLabel="label"
      optionValue="code"
      :placeholder="$t('placeholders.selectCurrency')"
      class="w-full"
      @update:modelValue="$emit('update:selectedCurrency', $event)"
    >
      <template #value="slotProps">
        <CurrencyOption :currency="getCurrencyByCode(slotProps.value)" />
      </template>
      <template #option="slotProps">
        <CurrencyOption :currency="slotProps.option.data" />
      </template>
    </Dropdown>
  </div>
</template>

<script setup>
const props = defineProps({
  currencies: {
    type: Array,
    default: () => []
  },
  selectedCurrency: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:selectedCurrency'])

const getCurrencyByCode = (code) => {
  return props.currencies.find(c => c.code === code)?.data || null
}
</script>
