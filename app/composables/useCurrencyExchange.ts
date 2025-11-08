export const useCurrencyExchange = () => {
  const { $useApiFetch } = useNuxtApp()
  const { t } = useI18n()
  const toast = useToast()

  const exchangeRatesData = ref<any[]>([])
  const selectedCurrencyToBuy = ref<string | null>(null)
  const amountToConvert = ref<number>(1)
  const calculatedAmount = ref<number | null>(null)
  const isLoadingCalculation = ref<boolean>(false)
  
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const currencies = computed(() => {
    if (!exchangeRatesData.value || !Array.isArray(exchangeRatesData.value)) {
      return []
    }
    
    return exchangeRatesData.value.map((item: any) => ({
      code: item.title,
      label: item.title,
      data: item
    }))
  })

  const selectedCurrencyData = computed(() => {
    const currency = currencies.value.find(c => c.code === selectedCurrencyToBuy.value)
    return currency?.data || null
  })

  const fetchCurrencyPairs = async () => {
    try {
      const response = await $useApiFetch('/customer/currency-pairs')
      
      if (response.error.value) {
        console.error('Error fetching currency pairs:', response.error.value)
        exchangeRatesData.value = []
        return
      }

      const responseData = response.data.value
      
      if (responseData?.entity?.data) {
        exchangeRatesData.value = responseData.entity.data
      } else if (responseData?.data) {
        exchangeRatesData.value = responseData.data
      } else {
        exchangeRatesData.value = responseData
      }
    } catch (error) {
      console.error('Error fetching currency pairs:', error)
      exchangeRatesData.value = []
    }
  }

  const calculateAmount = async (amount?: number, showLoading: boolean = true) => {
    const amountValue = amount || amountToConvert.value
    
    if (!amountValue || !selectedCurrencyData.value?.id || amountValue <= 0) {
      calculatedAmount.value = null
      if (showLoading) {
        isLoadingCalculation.value = false
      }
      return
    }

    try {
      if (showLoading) {
        isLoadingCalculation.value = true
      }
      
      const response = await $useApiFetch('/customer/currency-pairs/calculate-amount', {
        method: 'POST',
        body: {
          amount: parseFloat(String(amountValue)),
          currency_pair_id: String(selectedCurrencyData.value?.id || '')
        }
      })

      if (response.error.value) {
        console.error('Error calculating amount:', response.error.value)
        calculatedAmount.value = null
      } else {
        const responseData = response.data.value
        if (responseData?.entity) {
          calculatedAmount.value = responseData.entity
        } else if (responseData) {
          calculatedAmount.value = responseData
        }
      }
    } catch (error) {
      console.error('Error calculating amount:', error)
      calculatedAmount.value = null
    } finally {
      if (showLoading) {
        isLoadingCalculation.value = false
      }
    }
  }

  const refreshCalculation = async () => {
    if (amountToConvert.value > 0 && selectedCurrencyData.value?.id) {
      await calculateAmount(undefined, false)
    }
  }

  watch(currencies, (newCurrencies) => {
    if (newCurrencies.length > 0 && !selectedCurrencyToBuy.value) {
      selectedCurrencyToBuy.value = newCurrencies[0]?.code || null
    }
  }, { immediate: true })

  watch(amountToConvert, (newValue, oldValue) => {
    if (newValue < 0) {
      amountToConvert.value = 0
      return
    }
    
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    if (newValue > 0 && newValue !== oldValue && selectedCurrencyData.value?.id) {
      isLoadingCalculation.value = true
      
      debounceTimer = setTimeout(() => {
        calculateAmount(undefined, true)
      }, 500)
    } else if (newValue === 0 || !newValue) {
      calculatedAmount.value = null
      isLoadingCalculation.value = false
    }
  })

  watch(selectedCurrencyToBuy, () => {
    if (amountToConvert.value > 0) {
      calculateAmount()
    }
  })

  let autoRefreshInterval: ReturnType<typeof setInterval> | null = null

  const startAutoRefresh = () => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval)
    }
    
    autoRefreshInterval = setInterval(() => {
      refreshCalculation()
    }, 10000)
  }

  const stopAutoRefresh = () => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval)
      autoRefreshInterval = null
    }
  }

  onMounted(() => {
    startAutoRefresh()
  })

  onUnmounted(() => {
    stopAutoRefresh()
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  })

  return {
    exchangeRatesData: readonly(exchangeRatesData),
    selectedCurrencyToBuy,
    amountToConvert,
    calculatedAmount: readonly(calculatedAmount),
    isLoadingCalculation: readonly(isLoadingCalculation),
    currencies,
    selectedCurrencyData,
    fetchCurrencyPairs,
    calculateAmount,
    refreshCalculation,
    startAutoRefresh,
    stopAutoRefresh
  }
}
