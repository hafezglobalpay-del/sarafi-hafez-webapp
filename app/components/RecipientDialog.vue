<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)" 
    modal 
    :header="$t('recipient.selectRecipient')"
    :style="{ width: '600px' }"
    class="p-0"
  >
    <template #default>
      <div class="p-4 pt-0 relative">
        <div class="space-y-6">
          <div v-if="isLoadingRecipients" class="text-center py-8">
            <i class="mdi mdi-loading mdi-spin text-2xl text-primary mb-2"></i>
            <p class="text-gray-600">{{ $t('loading') }}</p>
          </div>

          <div v-else-if="hasRecipients && !showNewRecipientForm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t('recipient.selectRecipient') }}
              </h3>

              <Button :label="$t('recipient.addNewRecipient')" severity="secondary" icon="mdi mdi-account-plus" rounded
                size="small" @click="showNewRecipientForm = true" />
            </div>

            <div class="space-y-2 max-h-60 overflow-y-auto">
              <div v-for="recipient in recipients" :key="recipient.id"
                class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                :class="{ 'border-primary bg-primary/5': selectedRecipient?.id === recipient.id }"
                @click="selectRecipient(recipient)">
                <RadioButton v-model="selectedRecipientId" :value="recipient.id" class="mr-3" />
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-gray-900 font-medium">
                        {{ recipient.name }} {{ recipient.family }}
                      </p>
                      <p class="text-gray-600 text-sm">{{ recipient.email }}</p>
                      <p class="text-gray-500 text-xs">{{ recipient.mobile }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="!hasRecipients && !showNewRecipientForm" class="text-center py-8">
            <i class="mdi mdi-account-plus text-4xl text-gray-400 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ $t('recipient.noRecipients') }}
            </h3>
            <p class="text-gray-600 mb-4">{{ $t('recipient.addFirstRecipient') }}</p>
            <Button :label="$t('recipient.addNewRecipient')" severity="primary" @click="showNewRecipientForm = true" />
          </div>

          <div v-if="showNewRecipientForm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t('recipient.recipientInformation') }}
              </h3>
            </div>

            <form @submit.prevent="handleCreateRecipient" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('recipient.firstName') }} *
                  </label>
                  <InputText v-model="newRecipient.name" :placeholder="$t('recipient.firstNamePlaceholder')"
                    class="w-full" :class="{ 'p-invalid': errors.name }" />
                  <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('recipient.lastName') }} *
                  </label>
                  <InputText v-model="newRecipient.family" :placeholder="$t('recipient.lastNamePlaceholder')"
                    class="w-full" :class="{ 'p-invalid': errors.family }" />
                  <small v-if="errors.family" class="text-red-500">{{ errors.family }}</small>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ $t('recipient.email') }} *
                </label>
                <InputText v-model="newRecipient.email" type="email" :placeholder="$t('recipient.emailPlaceholder')"
                  class="w-full" :class="{ 'p-invalid': errors.email }" />
                <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ $t('recipient.mobile') }} *
                </label>
                <InputText v-model="newRecipient.mobile" :placeholder="$t('recipient.mobilePlaceholder')" class="w-full"
                  :class="{ 'p-invalid': errors.mobile }" />
                <small v-if="errors.mobile" class="text-red-500">{{ errors.mobile }}</small>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ $t('recipient.occupation') }} *
                </label>
                <InputText v-model="newRecipient.occupation" :placeholder="$t('recipient.occupationPlaceholder')"
                  class="w-full" :class="{ 'p-invalid': errors.occupation }" />
                <small v-if="errors.occupation" class="text-red-500">{{ errors.occupation }}</small>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ $t('recipient.nationalCode') }} *
                </label>
                <InputText v-model="newRecipient.national_code" :placeholder="$t('recipient.nationalCodePlaceholder')"
                  class="w-full" :class="{ 'p-invalid': errors.national_code }" />
                <small v-if="errors.national_code" class="text-red-500">{{ errors.national_code }}</small>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ $t('recipient.address') }} *
                </label>
                <Textarea v-model="newRecipient.address" :placeholder="$t('recipient.addressPlaceholder')"
                  class="w-full" rows="3" :class="{ 'p-invalid': errors.address }" />
                <small v-if="errors.address" class="text-red-500">{{ errors.address }}</small>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('recipient.bankName') }} *
                  </label>
                  <InputText v-model="newRecipient.bank_name" :placeholder="$t('recipient.bankNamePlaceholder')"
                    class="w-full" :class="{ 'p-invalid': errors.bank_name }" />
                  <small v-if="errors.bank_name" class="text-red-500">{{ errors.bank_name }}</small>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('recipient.bankAccountNumber') }} *
                  </label>
                  <InputText v-model="newRecipient.bank_account_number"
                    :placeholder="$t('recipient.bankAccountNumberPlaceholder')" class="w-full"
                    :class="{ 'p-invalid': errors.bank_account_number }" />
                  <small v-if="errors.bank_account_number" class="text-red-500">{{ errors.bank_account_number }}</small>
                </div>
              </div>

              <div class="flex space-x-3 pt-4">
                <Button :label="$t('recipient.cancel')" severity="secondary" class="flex-1"
                  @click="showNewRecipientForm = false" />
                <Button :label="isCreatingRecipient ? $t('creating') : $t('recipient.addRecipient')" severity="primary"
                  class="flex-1" :loading="isCreatingRecipient" :disabled="isCreatingRecipient" type="submit" />
              </div>
            </form>
          </div>

          <div v-if="selectedRecipient && !showNewRecipientForm">
            <Button :label="$t('recipient.saveAndContinue')" severity="primary"
              class="w-full py-3 text-lg font-semibold" @click="handleSaveAndContinue" />
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'success'])

// Composables
const {
  recipients,
  isLoadingRecipients,
  isCreatingRecipient,
  hasRecipients,
  fetchRecipients,
  createRecipient
} = useRecipients()

// State
const selectedRecipient = ref(null)
const selectedRecipientId = ref(null)
const showNewRecipientForm = ref(false)
const newRecipient = ref({
  name: '',
  family: '',
  email: '',
  mobile: '',
  occupation: '',
  national_code: '',
  address: '',
  bank_name: '',
  bank_account_number: ''
})
const errors = ref({})


// Methods
const selectRecipient = (recipient) => {
  selectedRecipient.value = recipient
  selectedRecipientId.value = recipient.id
}

const validateForm = () => {
  errors.value = {}

  if (!newRecipient.value.name.trim()) {
    errors.value.name = t('recipient.firstNameRequired')
  }

  if (!newRecipient.value.family.trim()) {
    errors.value.family = t('recipient.lastNameRequired')
  }

  if (!newRecipient.value.email.trim()) {
    errors.value.email = t('validation.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newRecipient.value.email)) {
    errors.value.email = t('validation.emailInvalid')
  }

  if (!newRecipient.value.mobile.trim()) {
    errors.value.mobile = t('validation.mobileRequired')
  }

  if (!newRecipient.value.occupation.trim()) {
    errors.value.occupation = t('validation.occupationRequired')
  }

  if (!newRecipient.value.national_code.trim()) {
    errors.value.national_code = t('validation.nationalCodeRequired')
  } else if (!/^\d{10}$/.test(newRecipient.value.national_code)) {
    errors.value.national_code = t('validation.nationalCodeInvalid')
  }

  if (!newRecipient.value.address.trim()) {
    errors.value.address = t('validation.addressRequired')
  }

  if (!newRecipient.value.bank_name.trim()) {
    errors.value.bank_name = t('validation.bankRequired')
  }

  if (!newRecipient.value.bank_account_number.trim()) {
    errors.value.bank_account_number = t('validation.bankAccountRequired')
  }

  return Object.keys(errors.value).length === 0
}

const handleCreateRecipient = async () => {
  if (!validateForm()) {
    return
  }

  const result = await createRecipient(newRecipient.value)

  if (result.success) {
    selectedRecipient.value = result.data
    selectedRecipientId.value = result.data.id
    showNewRecipientForm.value = false
    newRecipient.value = {
      name: '',
      family: '',
      email: '',
      mobile: '',
      occupation: '',
      national_code: '',
      address: '',
      bank_name: '',
      bank_account_number: ''
    }
    errors.value = {}
  }
}

const handleSaveAndContinue = () => {
  if (selectedRecipient.value) {
    emit('success', selectedRecipient.value)
    emit('update:visible', false)
  }
}

// Watchers
watch(() => props.visible, (newVal) => {
  if (newVal) {
    selectedRecipient.value = null
    selectedRecipientId.value = null
    showNewRecipientForm.value = false
    newRecipient.value = {
      name: '',
      family: '',
      email: '',
      mobile: '',
      occupation: '',
      national_code: '',
      address: '',
      bank_name: '',
      bank_account_number: ''
    }
    errors.value = {}
    fetchRecipients()
  }
})
</script>

<style scoped>
.p-dialog .p-dialog-content {
  padding: 0;
}
</style>
