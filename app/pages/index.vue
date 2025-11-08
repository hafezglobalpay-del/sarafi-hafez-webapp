<template>
  <div class="min-h-screen p-4 flex items-center justify-center">
    <Card class="w-full max-w-2xl mx-auto shadow-lg">
      <template #content>
        <div class="p-6 md:p-8">
          <CurrencyPairDisplay 
            :base-currency="selectedCurrencyData?.base_currency"
            :quote-currency="selectedCurrencyData?.quote_currency"
          />

          <CurrencyDropdown 
            v-model:selected-currency="selectedCurrencyToBuy"
            :currencies="currencies"
          />

          <div class="mb-6">
            <PriceCard 
              :quote-currency="selectedCurrencyData?.quote_currency"
              :base-currency="selectedCurrencyData?.base_currency"
              :price="selectedCurrencyData?.buy_price"
             
            />
          </div>

          <AmountInput 
            v-model="amountToConvert"
            :currency="selectedCurrencyData?.base_currency"
          />

          <TotalPayable 
            :amount="calculatedAmount"
            :currency="selectedCurrencyData?.quote_currency"
            :is-loading="isLoadingCalculation"
          />

          <div v-if="isLoggedIn && !isUserVerified" class="mb-6">
            <Card class="bg-yellow-50 border-yellow-200" style="background-color: #fefce8;">
              <template #content>
                <div class="p-4">
                  <div class="flex items-center gap-3 mb-3">
                    <i class="mdi mdi-alert text-yellow-600 text-xl"></i>
                    <h3 class="text-lg font-semibold text-yellow-800">
                      {{ $t('verificationRequired') }}
                    </h3>
                  </div>
                  <p class="text-yellow-700 mb-4">
                    {{ $t('verificationNotice') }}
                  </p>
                  <Button 
                    v-if="verificationUrl"
                    :label="$t('verifyNow')"
                    severity="warning"
                    class="w-full"
                    @click="openVerificationUrl"
                  />
                </div>
              </template>
            </Card>
          </div>

          <Button 
            v-if="!isLoggedIn || isUserVerified"
            :label="isCreatingInvoice ? $t('creatingInvoice') : (!isLoggedIn ? $t('loginFirst') : $t('pay'))" 
            severity="primary"
            class="w-full py-4 text-xl font-semibold"
            :loading="isCreatingInvoice"
            :disabled="isCreatingInvoice"
            @click="handlePayNow"
          />
        </div>
      </template>
    </Card>

    <AuthDialog 
      v-model:visible="showAuthDialog"
      :reset-password-params="resetPasswordParams"
      v-model:show-reset-password="showResetPasswordDialog"
      @success="handleAuthSuccess"
    />
    <RecipientDialog 
      v-model:visible="showRecipientDialog"
      @success="(recipientData) => handleRecipientSuccess(recipientData, selectedCurrencyData, amountToConvert)"
    />
  </div>
</template>

<script setup>
const { t, locale, setLocale } = useI18n()
const router = useRouter()
const route = useRoute()

const {
  selectedCurrencyToBuy,
  amountToConvert,
  calculatedAmount,
  isLoadingCalculation,
  currencies,
  selectedCurrencyData,
  fetchCurrencyPairs
} = useCurrencyExchange()

const {
  showAuthDialog,
  showRecipientDialog,
  isCreatingInvoice,
  isUserVerified,
  verificationUrl,
  handlePayNow,
  handleAuthSuccess,
  handleRecipientSuccess
} = usePaymentFlow()

const { isLoggedIn } = useAuth()

const resetPasswordParams = computed(() => {
  if (typeof window === 'undefined') return null
  
  const query = route.query
  if (query.action === 'reset-password' && query.token && query.email) {
    return {
      token: String(query.token),
      email: String(query.email),
      lang: String(query.lang || locale.value)
    }
  }
  return null
})

const showResetPasswordDialog = ref(false)

watch(resetPasswordParams, (newVal) => {
  if (newVal && newVal.token && newVal.email) {
    showResetPasswordDialog.value = true
  } else {
    showResetPasswordDialog.value = false
  }
}, { immediate: true, deep: true })

watch(() => route.query, (newQuery) => {
  if (newQuery.action === 'reset-password' && newQuery.token && newQuery.email) {
    showResetPasswordDialog.value = true
    
    if (newQuery.lang && (newQuery.lang === 'en' || newQuery.lang === 'fa')) {
      setLocale(newQuery.lang)
    }
  }
}, { immediate: true })

watch(() => route.query.lang, (newLang) => {
  if (newLang && (newLang === 'en' || newLang === 'fa') && locale.value !== newLang) {
    setLocale(newLang)
  }
}, { immediate: true })

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  keywords: () => t('meta.keywords'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: locale.value,
    dir: locale.value === 'fa' ? 'rtl' : 'ltr'
  }
})

const openVerificationUrl = () => {
  if (import.meta.client && verificationUrl.value) {
    window.open(verificationUrl.value, '_blank')
  }
}

onMounted(() => {
  fetchCurrencyPairs()
  
  nextTick(() => {
    const query = route.query
    if (query.action === 'reset-password' && query.token && query.email) {
      showResetPasswordDialog.value = true
      
      if (query.lang && (query.lang === 'en' || query.lang === 'fa')) {
        setLocale(query.lang)
      }
    }
    
    if (query.lang && (query.lang === 'en' || query.lang === 'fa') && locale.value !== query.lang) {
      setLocale(query.lang)
    }
  })
})
</script>

<style scoped>
.p-card .p-card-content {
  padding: 0;
}
</style>
