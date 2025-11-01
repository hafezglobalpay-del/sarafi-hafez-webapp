<template>
  <div class="flex items-center gap-3">
     <Button
      text
      rounded
      @click="toggleMenu"
    >
    <div class="flex items-center gap-2">
      <Avatar :label="userInitials" class="mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
      <div class="hidden md:block">
        <div class="text-sm font-medium text-gray-900">
          {{ user.name }} {{ user.family }}
        </div>
        <div class="text-xs text-gray-500">
          {{ user.email }}
        </div>
      </div>
    </div>
    </Button>

    <Menu ref="menu" :model="menuItems" :popup="true">
      <template #item="{ item }">
        <div v-if="item.label === 'verification-info'" class="p-3 bg-gray-50 border-b border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-gray-900">{{ $t('profile.verificationInfo') }}</h3>
            <i :class="getVerificationIcon()" class="text-lg"></i>
          </div>
          
          <div class="space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-600">{{ $t('profile.verificationStatusText') }}:</span>
              <span :class="getStatusTextColor()" class="font-medium">{{ getVerificationStatusText() }}</span>
            </div>
            
            <div v-if="user.verification.verification_level" class="flex justify-between">
              <span class="text-gray-600">{{ $t('profile.verificationLevel') }}:</span>
              <span class="text-gray-900 font-medium">{{ user.verification.verification_level }}</span>
            </div>
          </div>
          
          <div v-if="needsVerification" class="mt-3">
            <Button
              :label="$t('profile.completeVerification')"
              icon="mdi mdi-shield-check"
              severity="primary"
              size="small"
              class="w-full"
              @click="handleVerificationRedirect"
            />
          </div>
        </div>
        <div v-else class="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
          <i :class="item.icon" class="mr-3 text-gray-600"></i>
          <span class="text-gray-900">{{ item.label }}</span>
        </div>
      </template>
    </Menu>

    <Button 
      :label="$t('logout')" 
      icon="mdi mdi-logout" 
      severity="primary" 
      class="px-3 md:px-6" 
      rounded 
      size="small"
      @click="handleLogout"
    />
  </div>
</template>

<script setup>
const { t } = useI18n()
const { user, logout } = useAuth()

const menu = ref()

const userInitials = computed(() => {
  const firstName = user.value.name || ''
  const lastName = user.value.family || ''
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U'
})

const menuItems = computed(() => {
  const items = []

  // Add verification info section if verification data exists
  if (user.value.verification) {
    items.push({
      label: 'verification-info',
      template: true,
      disabled: false
    })
  }

  return items
})

// Helper function to get verification icon based on status
const getVerificationIcon = () => {
  const status = user.value.verification?.status?.toLowerCase()
  if (status === 'approved') {
    return 'mdi mdi-check-circle text-green-500'
  } else if (status === 'pending') {
    return 'mdi mdi-clock text-orange-500'
  } else if (status === 'rejected') {
    return 'mdi mdi-close-circle text-red-500'
  } else {
    return 'mdi mdi-alert-circle text-orange-500'
  }
}

// Helper function to get verification status text
const getVerificationStatusText = () => {
  const status = user.value.verification?.status?.toLowerCase()
  switch (status) {
    case 'approved':
      return t('profile.verificationApproved')
    case 'pending':
      return t('profile.verificationPending')
    case 'rejected':
      return t('profile.verificationRejected')
    default:
      return t('profile.verificationNotStarted')
  }
}

// Helper function to check if verification is needed
const needsVerification = computed(() => {
  const status = user.value.verification?.status?.toLowerCase()
  return status !== 'approved' && status !== 'APPROVED'
})

// Function to handle verification redirect
const handleVerificationRedirect = () => {
  const verificationUrl = user.value.verification?.verification_url
  if (verificationUrl) {
    window.open(verificationUrl, '_blank')
  }
}

// Helper function to get status text color
const getStatusTextColor = () => {
  const status = user.value.verification?.status?.toLowerCase()
  switch (status) {
    case 'approved':
      return 'text-green-600'
    case 'pending':
      return 'text-orange-600'
    case 'rejected':
      return 'text-red-600'
    default:
      return 'text-orange-600'
  }
}

const toggleMenu = (event) => {
  menu.value.toggle(event)
}

const handleLogout = () => {
  logout()
}
</script>

<style scoped>
:deep(.p-menu) {
  min-width: 200px;
}
</style>
