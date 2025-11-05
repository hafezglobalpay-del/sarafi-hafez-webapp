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
              label-key="Buy Price"
            />
          </div>

          <AmountInput 
            v-model="amountToConvert"
            :currency="selectedCurrencyData?.base_currency"
            @input="handleAmountInput"
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
      @success="handleAuthSuccess"
    />
    <RecipientDialog 
      v-model:visible="showRecipientDialog"
      @success="(recipientData) => handleRecipientSuccess(recipientData, selectedCurrencyData, amountToConvert)"
    />
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
const router = useRouter()

const {
  selectedCurrencyToBuy,
  amountToConvert,
  calculatedAmount,
  isLoadingCalculation,
  currencies,
  selectedCurrencyData,
  fetchCurrencyPairs,
  handleAmountInput
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
})
</script>

<style scoped>
.p-card .p-card-content {
  padding: 0;
}
</style>
