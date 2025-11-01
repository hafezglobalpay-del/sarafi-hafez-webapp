interface Recipient {
  id: string
  name: string
  family: string
  email: string
  mobile: string
  occupation: string
  national_code: string
  address: string
  bank_name: string
  bank_account_number: string
  user_id?: number
}

interface RecipientResponse {
  is_success: boolean
  status: string
  message: string
  errors: any
  entity: Recipient | Recipient[]
}

export const useRecipients = () => {
  const { $recipientApi } = useNuxtApp()
  const { t } = useI18n()
  const toast = useToast()
  const { isLoggedIn } = useAuth()

  const recipients = ref<Recipient[]>([])
  const isLoadingRecipients = ref(false)
  const isCreatingRecipient = ref(false)

  const fetchRecipients = async () => {
    if (!isLoggedIn.value) {
      console.warn('User not logged in, cannot fetch recipients')
      return
    }

    try {
      isLoadingRecipients.value = true
      const { data, error } = await $recipientApi.getRecipients()
      
      if (error.value) {
        console.error('Error fetching recipients:', error.value)
        recipients.value = []
        return
      }

      const response = data.value as RecipientResponse
      
      if (response?.is_success) {
        recipients.value = Array.isArray(response.entity) ? response.entity : [response.entity]
      } else {
        console.error('Error fetching recipients:', response?.message)
        recipients.value = []
        toast.add({
          severity: 'warn',
          summary: t('errors.connectionError'),
          detail: response?.message || t('errors.pleaseTryAgain'),
          life: 3000
        })
      }
    } catch (error) {
      console.error('Error fetching recipients:', error)
      recipients.value = []
    } finally {
      isLoadingRecipients.value = false
    }
  }

  const createRecipient = async (recipientData: Omit<Recipient, 'id'>) => {
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
      isCreatingRecipient.value = true
      const { data, error } = await $recipientApi.createRecipient(recipientData)
      
      if (error.value) {
        console.error('Recipient creation error:', error.value)
        return { success: false, error: error.value instanceof Error ? error.value.message : 'Unknown error' }
      }

      const response = data.value as RecipientResponse
      
      if (response?.is_success) {
        const newRecipient = Array.isArray(response.entity) ? response.entity[0] : response.entity
        if (newRecipient) {
          recipients.value.push(newRecipient)
        }
        toast.add({
          severity: 'success',
          summary: t('recipient.recipientAdded'),
          detail: t('recipient.recipientAddedMessage'),
          life: 3000
        })
        return { success: true, data: newRecipient }
      } else {
        toast.add({
          severity: 'error',
          summary: t('errors.connectionError'),
          detail: response?.message || t('errors.unknownError'),
          life: 5000
        })
        return { success: false, error: response?.message || 'Recipient creation failed' }
      }
    } catch (error) {
      console.error('Recipient creation error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    } finally {
      isCreatingRecipient.value = false
    }
  }

  const hasRecipients = computed(() => recipients.value.length > 0)

  return {
    recipients: readonly(recipients),
    isLoadingRecipients: readonly(isLoadingRecipients),
    isCreatingRecipient: readonly(isCreatingRecipient),
    hasRecipients,
    fetchRecipients,
    createRecipient
  }
}
