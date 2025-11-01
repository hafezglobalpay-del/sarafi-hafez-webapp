interface InvoiceData {
  receiver_user_id: number
  currency_pair_id: string
  amount: number
}

interface InvoiceResponse {
  is_success: boolean
  status: string
  message: string
  errors: any
  entity: {
    id: string
    invoice_number: string
    amount: number
    currency_pair_id: string
    receiver_user_id: number
    receiver_data: any
    status: string
    created_at: string
    updated_at: string
  }
}

export const useInvoice = () => {
  const { $invoiceApi } = useNuxtApp()
  const { t } = useI18n()
  const toast = useToast()
  const { isLoggedIn } = useAuth()

  const isCreatingInvoice = ref(false)
  const createdInvoice = ref<InvoiceResponse['entity'] | null>(null)

  const createInvoice = async (invoiceData: InvoiceData) => {
    if (!isLoggedIn.value) {
      toast.add({
        severity: 'error',
        summary: t('errors.authenticationRequired'),
        detail: t('errors.pleaseLoginFirst'),
        life: 5000
      })
      return { success: false, error: 'Authentication required' }
    }

    try {
      isCreatingInvoice.value = true
      const { data, error, status } = await $invoiceApi.createInvoice(invoiceData)
      
      const response = data.value as InvoiceResponse | any
      
      if (response?._isHtmlError) {
        console.error('Backend returned HTML instead of JSON')
        toast.add({
          severity: 'error',
          summary: t('errors.serverError'),
          detail: response.message || t('errors.pleaseTryAgain'),
          life: 7000
        })
        return { success: false, error: response.message, errors: response.errors }
      }
      
      if (response && response.is_success === false) {
        console.error('Invoice creation failed:', response)
        
        const errorMessage = response.message || t('errors.validationError')
        const errorDetails = response.errors 
          ? Object.values(response.errors).flat().join(', ') 
          : t('errors.pleaseTryAgain')
        
        toast.add({
          severity: 'error',
          summary: errorMessage,
          detail: errorDetails,
          life: 5000
        })
        return { success: false, error: errorMessage, errors: response.errors }
      }
      
      if (error.value) {
        console.error('Invoice creation error:', error.value)
        
        if (response && typeof response === 'object') {
          if (response.message || response.errors) {
            const errorMessage = response.message || t('errors.validationError')
            const errorDetails = response.errors 
              ? Object.values(response.errors).flat().join(', ') 
              : t('errors.pleaseTryAgain')
            
            toast.add({
              severity: 'error',
              summary: errorMessage,
              detail: errorDetails,
              life: 5000
            })
            return { success: false, error: errorMessage, errors: response.errors }
          }
        }
        
        toast.add({
          severity: 'error',
          summary: t('errors.connectionError'),
          detail: t('errors.pleaseTryAgain'),
          life: 5000
        })
        return { success: false, error: error.value instanceof Error ? error.value.message : 'Unknown error' }
      }

      if (response?.is_success) {
        createdInvoice.value = response.entity
        toast.add({
          severity: 'success',
          summary: t('success.invoiceCreated'),
          detail: t('success.invoiceCreatedDetail'),
          life: 5000
        })
        return { success: true, data: response.entity }
      } else {
        toast.add({
          severity: 'error',
          summary: t('errors.invoiceCreationFailed'),
          detail: response?.message || t('errors.unknownError'),
          life: 5000
        })
        return { success: false, error: response?.message || 'Invoice creation failed' }
      }
    } catch (error) {
      console.error('Invoice creation error:', error)
      toast.add({
        severity: 'error',
        summary: t('errors.connectionError'),
        detail: t('errors.pleaseTryAgain'),
        life: 5000
      })
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    } finally {
      isCreatingInvoice.value = false
    }
  }

  const clearCreatedInvoice = () => {
    createdInvoice.value = null
  }

  return {
    isCreatingInvoice: readonly(isCreatingInvoice),
    createdInvoice: readonly(createdInvoice),
    createInvoice,
    clearCreatedInvoice
  }
}
