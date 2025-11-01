export const usePaymentFlow = () => {
  const showAuthDialog = ref(false)
  const showRecipientDialog = ref(false)
  const { createInvoice, isCreatingInvoice } = useInvoice()
  const { user } = useAuth()

  const isUserVerified = computed(() => {
    return user.value?.verified === true
  })

  const verificationUrl = computed(() => {
    return user.value?.verification?.verification_url || ''
  })

  const handlePayNow = () => {
    const { isLoggedIn } = useAuth()
    
    if (!isLoggedIn.value) {
      showAuthDialog.value = true
    } else if (!isUserVerified.value) {
      if (verificationUrl.value) {
        window.open(verificationUrl.value, '_blank')
      }
    } else {
      showRecipientDialog.value = true
    }
  }

  const handleAuthSuccess = () => {
    showAuthDialog.value = false
    showRecipientDialog.value = true
  }

  const handleRecipientSuccess = async (recipientData: any, currencyData: any, amount: number) => {
    showRecipientDialog.value = false
    await createInvoiceForPayment(recipientData, currencyData, amount)
  }

  const createInvoiceForPayment = async (recipientData: any, currencyData: any, amount: number) => {
    if (!currencyData || !amount) {
      console.error('Missing currency or amount data')
      return
    }

    const invoiceData = {
      receiver_user_id: recipientData?.id || '',
      currency_pair_id: currencyData?.id || '',
      amount: amount
    }

    const result = await createInvoice(invoiceData)
    return result
  }

  return {
    showAuthDialog,
    showRecipientDialog,
    isCreatingInvoice,
    isUserVerified,
    verificationUrl,
    handlePayNow,
    handleAuthSuccess,
    handleRecipientSuccess,
    createInvoiceForPayment
  }
}
