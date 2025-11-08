<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    modal 
    :header="dialogTitle"
    :style="{ width: '450px' }"
    class="p-0"
  >
    <template #default>
      <div class="p-4 pt-0 relative">
        <div v-if="activeTab === 'login'" class="space-y-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="login-email" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('auth.emailPhone') }}
              </label>
              <InputText
                id="login-email"
                v-model="loginForm.email"
                type="text"
                :placeholder="$t('auth.emailPhonePlaceholder')"
                class="w-full"
                :class="{ 'p-invalid': loginErrors.email }"
                autocomplete="email"
                required
              />
              <small v-if="loginErrors.email" class="p-error mt-1 block">{{ loginErrors.email }}</small>
            </div>

            <div>
              <label for="login-password" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('auth.password') }}
              </label>
              <div class="relative">
                <InputText
                  id="login-password"
                  v-model="loginForm.password"
                  :type="showLoginPassword ? 'text' : 'password'"
                  :placeholder="$t('auth.passwordPlaceholder')"
                  class="w-full pr-10 rtl:pr-0 rtl:pl-10"
                  :class="{ 'p-invalid': loginErrors.password }"
                  autocomplete="current-password"
                  required
                />
                <button
                  type="button"
                  @click="showLoginPassword = !showLoginPassword"
                  class="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i :class="showLoginPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'" class="text-sm"></i>
                </button>
              </div>
              <small v-if="loginErrors.password" class="p-error mt-1 block">{{ loginErrors.password }}</small>
            </div>

            <div>
              <Button
                type="submit"
                :label="$t('auth.login')"
                severity="primary"
                class="w-full py-3"
                :loading="isLoading"
                :disabled="isLoading"
              />
            </div>
            <div class="mb-4">
              <div class="flex justify-end mb-2">
                <button
                  @click="showForgotPasswordDialog = true"
                  class="text-primary hover:text-primary-dark font-medium underline text-sm"
                >
                  {{ $t('auth.forgotPassword') }}
                </button>
              </div>
              <Divider />
              <div class="text-center mt-2">
                <p class="text-gray-600 text-sm">
                  {{ $t('auth.noAccount') }}
                  <button
                    @click="activeTab = 'register'"
                    class="text-primary hover:text-primary-dark font-medium underline ml-1"
                  >
                    {{ $t('auth.registerHere') }}
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>

        <div v-if="activeTab === 'register'" class="space-y-6">
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="register-name" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('auth.firstName') }}
                </label>
                <InputText
                  id="register-name"
                  v-model="registerForm.name"
                  type="text"
                  :placeholder="$t('auth.firstNamePlaceholder')"
                  class="w-full"
                  :class="{ 'p-invalid': registerErrors.name }"
                  autocomplete="given-name"
                  required
                />
                <small v-if="registerErrors.name" class="p-error mt-1 block">{{ registerErrors.name }}</small>
              </div>

              <div>
                <label for="register-family" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('auth.lastName') }}
                </label>
                <InputText
                  id="register-family"
                  v-model="registerForm.family"
                  type="text"
                  :placeholder="$t('auth.lastNamePlaceholder')"
                  class="w-full"
                  :class="{ 'p-invalid': registerErrors.family }"
                  autocomplete="family-name"
                  required
                />
                <small v-if="registerErrors.family" class="p-error mt-1 block">{{ registerErrors.family }}</small>
              </div>
            </div>

            <div>
              <label for="register-email" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('auth.email') }}
              </label>
              <InputText
                id="register-email"
                v-model="registerForm.email"
                type="email"
                :placeholder="$t('auth.emailPlaceholder')"
                class="w-full"
                :class="{ 'p-invalid': registerErrors.email }"
                autocomplete="email"
                required
              />
              <small v-if="registerErrors.email" class="p-error mt-1 block">{{ registerErrors.email }}</small>
            </div>

            <div>
              <label for="register-mobile" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('auth.mobile') }}
              </label>
              <InputText
                id="register-mobile"
                v-model="registerForm.mobile"
                type="tel"
                :placeholder="$t('auth.mobilePlaceholder')"
                class="w-full"
                :class="{ 'p-invalid': registerErrors.mobile }"
                autocomplete="tel"
                required
              />
              <small v-if="registerErrors.mobile" class="p-error mt-1 block">{{ registerErrors.mobile }}</small>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="register-password" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('auth.password') }}
                </label>
                <div class="relative">
                  <InputText
                    id="register-password"
                    v-model="registerForm.password"
                    :type="showRegisterPassword ? 'text' : 'password'"
                    :placeholder="$t('auth.passwordPlaceholder')"
                    class="w-full pr-10 rtl:pr-0 rtl:pl-10"
                    :class="{ 'p-invalid': registerErrors.password }"
                    autocomplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    @click="showRegisterPassword = !showRegisterPassword"
                    class="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i :class="showRegisterPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'" class="text-sm"></i>
                  </button>
                </div>
                <small v-if="registerErrors.password" class="p-error mt-1 block">{{ registerErrors.password }}</small>
              </div>

              <div>
                <label for="register-confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('auth.confirmPassword') }}
                </label>
                <div class="relative">
                  <InputText
                    id="register-confirmPassword"
                    v-model="registerForm.password_confirmation"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :placeholder="$t('auth.confirmPasswordPlaceholder')"
                    class="w-full pr-10 rtl:pr-0 rtl:pl-10"
                    :class="{ 'p-invalid': registerErrors.password_confirmation }"
                    autocomplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i :class="showConfirmPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'" class="text-sm"></i>
                  </button>
                </div>
                <small v-if="registerErrors.password_confirmation" class="p-error mt-1 block">{{ registerErrors.password_confirmation }}</small>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                :label="$t('auth.register')"
                severity="primary"
                class="w-full py-3"
                :loading="isLoading"
                :disabled="isLoading"
              />
            </div>
            <div class="text-center mb-4">
              <p class="text-gray-600 text-sm">
                {{ $t('auth.haveAccount') }}
                <button
                  @click="activeTab = 'login'"
                  class="text-primary hover:text-primary-dark font-medium underline ml-1"
                >
                  {{ $t('auth.loginHere') }}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </template>
  </Dialog>

  <!-- Forgot Password Dialog -->
  <Dialog 
    :visible="showForgotPasswordDialog" 
    @update:visible="showForgotPasswordDialog = $event"
    modal 
    :header="$t('auth.confirm')"
    :style="{ width: '450px' }"
    class="p-0"
  >
    <template #default>
      <div class="p-4 pt-0 relative">
        <form @submit.prevent="handleForgotPassword" class="space-y-4">
          <div>
            <label for="forgot-password-email" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.email') }}
            </label>
            <InputText
              id="forgot-password-email"
              v-model="forgotPasswordForm.email"
              type="email"
              :placeholder="$t('auth.forgotPasswordEmailPlaceholder')"
              class="w-full"
              :class="{ 'p-invalid': forgotPasswordErrors.email }"
              autocomplete="email"
              required
            />
            <small v-if="forgotPasswordErrors.email" class="p-error mt-1 block">{{ forgotPasswordErrors.email }}</small>
          </div>

          <div class="flex gap-2">
            <Button
              type="button"
              :label="$t('recipient.cancel')"
              severity="secondary"
              class="flex-1 py-3"
              @click="showForgotPasswordDialog = false"
              :disabled="isForgotPasswordLoading"
            />
            <Button
              type="submit"
              :label="isForgotPasswordLoading ? '' : $t('auth.confirm')"
              severity="primary"
              class="flex-1 py-3"
              :loading="isForgotPasswordLoading"
              :disabled="isForgotPasswordLoading"
            />
          </div>
        </form>
      </div>
    </template>
  </Dialog>

  <!-- Reset Password Dialog -->
  <Dialog 
    :visible="showResetPasswordDialog" 
    @update:visible="showResetPasswordDialog = $event"
    modal 
    :header="$t('auth.confirm')"
    :style="{ width: '450px' }"
    class="p-0"
  >
    <template #default>
      <div class="p-4 pt-0 relative">
        <form @submit.prevent="handleResetPassword" class="space-y-4">
          <div>
            <label for="reset-password-new" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.newPassword') }}
            </label>
            <div class="relative">
              <InputText
                id="reset-password-new"
                v-model="resetPasswordForm.password"
                :type="showResetPassword ? 'text' : 'password'"
                :placeholder="$t('auth.newPasswordPlaceholder')"
                class="w-full pr-10 rtl:pr-0 rtl:pl-10"
                :class="{ 'p-invalid': resetPasswordErrors.password }"
                autocomplete="new-password"
                required
              />
              <button
                type="button"
                @click="showResetPassword = !showResetPassword"
                class="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i :class="showResetPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'" class="text-sm"></i>
              </button>
            </div>
            <small v-if="resetPasswordErrors.password" class="p-error mt-1 block">{{ resetPasswordErrors.password }}</small>
          </div>

          <div>
            <label for="reset-password-confirm" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.confirmNewPassword') }}
            </label>
            <div class="relative">
              <InputText
                id="reset-password-confirm"
                v-model="resetPasswordForm.password_confirmation"
                :type="showResetConfirmPassword ? 'text' : 'password'"
                :placeholder="$t('auth.confirmNewPasswordPlaceholder')"
                class="w-full pr-10 rtl:pr-0 rtl:pl-10"
                :class="{ 'p-invalid': resetPasswordErrors.password_confirmation }"
                autocomplete="new-password"
                required
              />
              <button
                type="button"
                @click="showResetConfirmPassword = !showResetConfirmPassword"
                class="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i :class="showResetConfirmPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'" class="text-sm"></i>
              </button>
            </div>
            <small v-if="resetPasswordErrors.password_confirmation" class="p-error mt-1 block">{{ resetPasswordErrors.password_confirmation }}</small>
          </div>

          <div class="flex gap-2">
            <Button
              type="button"
              :label="$t('recipient.cancel')"
              severity="secondary"
              class="flex-1 py-3"
              @click="showResetPasswordDialog = false"
              :disabled="isResetPasswordLoading"
            />
            <Button
              type="submit"
              :label="isResetPasswordLoading ? '' : $t('auth.confirm')"
              severity="primary"
              class="flex-1 py-3"
              :loading="isResetPasswordLoading"
              :disabled="isResetPasswordLoading"
            />
          </div>
        </form>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
const { t, locale } = useI18n()
const toast = useToast()
const router = useRouter()
const { $authApi, $showSuccessToast } = useNuxtApp()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  resetPasswordParams: {
    type: Object,
    default: null
  },
  showResetPassword: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'update:showResetPassword', 'success'])

const activeTab = ref('login')
const isLoading = ref(false)

const dialogTitle = computed(() => {
  return activeTab.value === 'login' ? t('auth.login') : t('auth.register')
})
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)
const showForgotPasswordDialog = ref(false)
const isForgotPasswordLoading = ref(false)
const showResetPasswordDialog = computed({
  get: () => props.showResetPassword,
  set: (value) => emit('update:showResetPassword', value)
})
const isResetPasswordLoading = ref(false)
const showResetPassword = ref(false)
const showResetConfirmPassword = ref(false)

const loginForm = ref({
  email: '',
  password: ''
})

const loginErrors = ref({})

const registerForm = ref({
  name: '',
  family: '',
  email: '',
  mobile: '',
  password: '',
  password_confirmation: ''
})

const registerErrors = ref({})

const forgotPasswordForm = ref({
  email: ''
})

const forgotPasswordErrors = ref({})

const resetPasswordForm = ref({
  password: '',
  password_confirmation: ''
})

const resetPasswordErrors = ref({})

const validateLoginForm = () => {
  loginErrors.value = {}
  
  if (!loginForm.value.email) {
    loginErrors.value.email = t('validation.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.value.email) && !/^09\d{9}$/.test(loginForm.value.email)) {
    loginErrors.value.email = t('validation.emailInvalid')
  }
  
  if (!loginForm.value.password) {
    loginErrors.value.password = t('validation.passwordRequired')
  } else if (loginForm.value.password.length < 6) {
    loginErrors.value.password = t('validation.passwordMinLength')
  }
  
  return Object.keys(loginErrors.value).length === 0
}

const validateRegisterForm = () => {
  registerErrors.value = {}
  
  if (!registerForm.value.name) {
    registerErrors.value.name = t('validation.firstNameRequired')
  }
  
  if (!registerForm.value.family) {
    registerErrors.value.family = t('validation.lastNameRequired')
  }
  
  if (!registerForm.value.email) {
    registerErrors.value.email = t('validation.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.value.email)) {
    registerErrors.value.email = t('validation.emailInvalid')
  }
  
  if (!registerForm.value.mobile) {
    registerErrors.value.mobile = t('validation.mobileRequired')
  } else if (!/^\+?[1-9]\d{1,14}$/.test(registerForm.value.mobile)) {
    registerErrors.value.mobile = t('validation.mobileInvalid')
  }
  
  if (!registerForm.value.password) {
    registerErrors.value.password = t('validation.passwordRequired')
  } else if (registerForm.value.password.length < 6) {
    registerErrors.value.password = t('validation.passwordMinLength')
  }
  
  if (!registerForm.value.password_confirmation) {
    registerErrors.value.password_confirmation = t('validation.passwordRequired')
  } else if (registerForm.value.password !== registerForm.value.password_confirmation) {
    registerErrors.value.password_confirmation = t('validation.passwordMatch')
  }

  return Object.keys(registerErrors.value).length === 0
}

const validateForgotPasswordForm = () => {
  forgotPasswordErrors.value = {}
  
  if (!forgotPasswordForm.value.email) {
    forgotPasswordErrors.value.email = t('validation.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordForm.value.email)) {
    forgotPasswordErrors.value.email = t('validation.emailInvalid')
  }
  
  return Object.keys(forgotPasswordErrors.value).length === 0
}

const validateResetPasswordForm = () => {
  resetPasswordErrors.value = {}
  
  if (!resetPasswordForm.value.password) {
    resetPasswordErrors.value.password = t('validation.passwordRequired')
  } else if (resetPasswordForm.value.password.length < 6) {
    resetPasswordErrors.value.password = t('validation.passwordMinLength')
  }
  
  if (!resetPasswordForm.value.password_confirmation) {
    resetPasswordErrors.value.password_confirmation = t('validation.passwordRequired')
  } else if (resetPasswordForm.value.password !== resetPasswordForm.value.password_confirmation) {
    resetPasswordErrors.value.password_confirmation = t('validation.passwordMatch')
  }
  
  return Object.keys(resetPasswordErrors.value).length === 0
}

const handleLogin = async () => {
  if (!validateLoginForm()) {
    return
  }
  
  isLoading.value = true
  
  try {
    const { login } = useAuth()
    const result = await login(loginForm.value)
    
    if (result.success) {
      // Success toast is shown by useAuth composable
      emit('success')
      emit('update:visible', false)
    }
    // Error toasts are automatically shown by the API plugin
    
  } catch (error) {
    console.error('Login error:', error)
    // Error toasts are automatically shown by the API plugin
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  if (!validateRegisterForm()) {
    return
  }
  
  isLoading.value = true
  
  try {
    const { register } = useAuth()
    const result = await register(registerForm.value)
    
    if (result.success) {
      // Success toast is shown by useAuth composable
      // User will be redirected to verification URL automatically
      emit('success')
      emit('update:visible', false)
    }
    // Error toasts are automatically shown by the API plugin
    
  } catch (error) {
    console.error('Registration error:', error)
    // Error toasts are automatically shown by the API plugin
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = async () => {
  if (!validateForgotPasswordForm()) {
    return
  }
  
  isForgotPasswordLoading.value = true
  
  try {
    const { data, error } = await $authApi.forgotPassword({
      email: forgotPasswordForm.value.email,
      lang: locale.value
    })
    
    if (error.value) {
      console.error('Forgot password error:', error.value)
      // Error toasts are automatically shown by the API plugin
      return
    }
    
    const response = data.value
    
    if (response?.is_success) {
      if ($showSuccessToast) {
        $showSuccessToast(t('auth.forgotPasswordSuccess'), t('auth.forgotPasswordSuccessTitle'))
      }
      showForgotPasswordDialog.value = false
      forgotPasswordForm.value = { email: '' }
      forgotPasswordErrors.value = {}
    }
    // Error toasts are automatically shown by the API plugin
    
  } catch (error) {
    console.error('Forgot password error:', error)
    // Error toasts are automatically shown by the API plugin
  } finally {
    isForgotPasswordLoading.value = false
  }
}

const handleResetPassword = async () => {
  if (!validateResetPasswordForm()) {
    return
  }
  
  if (!props.resetPasswordParams) {
    console.error('Reset password parameters are missing')
    return
  }
  
  isResetPasswordLoading.value = true
  
  try {
    const { data, error } = await $authApi.resetPassword({
      token: props.resetPasswordParams.token,
      email: props.resetPasswordParams.email,
      lang: locale.value,
      password: resetPasswordForm.value.password,
      password_confirmation: resetPasswordForm.value.password_confirmation
    })
    
    if (error.value) {
      console.error('Reset password error:', error.value)
      // Error toasts are automatically shown by the API plugin
      return
    }
    
    const response = data.value
    
    if (response?.is_success) {
      if ($showSuccessToast) {
        $showSuccessToast(t('auth.resetPasswordSuccess'), t('auth.resetPasswordSuccessTitle'))
      }
      
      showResetPasswordDialog.value = false
      resetPasswordForm.value = { password: '', password_confirmation: '' }
      resetPasswordErrors.value = {}
      
      if (router) {
        router.replace({ query: {} })
      }
      
      nextTick(() => {
        setTimeout(() => {
          emit('update:visible', true)
          activeTab.value = 'login'
        }, 300)
      })
    }
    // Error toasts are automatically shown by the API plugin
    
  } catch (error) {
    console.error('Reset password error:', error)
    // Error toasts are automatically shown by the API plugin
  } finally {
    isResetPasswordLoading.value = false
  }
}

watch(() => props.resetPasswordParams, (newVal) => {
  if (newVal && newVal.token && newVal.email) {
    showResetPasswordDialog.value = true
  }
}, { immediate: true, deep: true })

watch(() => props.showResetPassword, (newVal) => {
  if (newVal) {
    showResetPasswordDialog.value = true
  }
}, { immediate: true })

watch(() => showResetPasswordDialog.value, (newVal) => {
  if (newVal) {
    resetPasswordForm.value = { password: '', password_confirmation: '' }
    resetPasswordErrors.value = {}
  }
})

watch(() => props.visible, (newVal) => {
  if (newVal) {
    loginForm.value = { email: '', password: '' }
    registerForm.value = {
      name: '',
      family: '',
      email: '',
      mobile: '',
      password: '',
      password_confirmation: ''
    }
    loginErrors.value = {}
    registerErrors.value = {}
    activeTab.value = 'login'
  }
})

watch(() => showForgotPasswordDialog, (newVal) => {
  if (newVal) {
    forgotPasswordForm.value = { email: '' }
    forgotPasswordErrors.value = {}
  }
})
</script>

<style scoped>
.p-dialog .p-dialog-content {
  padding: 0;
}
</style>
