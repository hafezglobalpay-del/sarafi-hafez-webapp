<template>
  <div class="mb-8">
    <label class="block text-lg font-medium text-gray-700 mb-4 rtl:text-right">
      {{ $t('amountToConvert') }}
    </label>
    <InputGroup>
      <InputGroupAddon>
        <FlagIcon 
          :flag="currency?.flag || 'circle-flags:xx'" 
          size="1.2em" 
          class="mx-2" 
        />
        <span class="text-base font-medium">{{ currency?.symbol }}</span>
      </InputGroupAddon>
      <input 
        :value="modelValue" 
        type="number"
        min="0" 
        class="p-inputtext p-component w-full"
        :style="inputStyles"
        @input="handleInput"
      />
    </InputGroup>
  </div>
</template>

<script setup>
const { locale } = useI18n()

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  currency: {
    type: Object,
    default: null
  },
})

const emit = defineEmits(['update:modelValue', 'input'])

const inputStyles = computed(() => ({
  padding: '0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '1rem',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  textAlign: locale.value === 'fa' ? 'right' : 'left'
}))

const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('input', event)
}
</script>
