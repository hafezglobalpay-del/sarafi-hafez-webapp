<template>
 
  <header class="bg-surface-0 shadow-sm">
    <div class="w-full px-6 md:px-12 lg:px-16">
    <Toolbar class="py-3 md:py-4 border-none">
      <template #start>
        <div class="flex items-center gap-2 md:gap-3">
          <img 
            src="/logo/hafez-logo.png" 
            alt="Hafez Exchange"
            class="h-6 md:h-8 w-auto cursor-pointer hover:scale-105 transition-transform"
            @click="$router.push('/')"
          />
          <div >
            <LanguageSwitcher />
          </div>
        </div>
      </template>
      
      <template #end>
          <UserProfile v-if="isLoggedIn" />
          <div v-else>
            <Button 
              :label="$t('auth.login')" 
              severity="primary" 
              rounded 
              class="px-5"
              size="small"
              @click="showAuthDialog = true"
            />
          </div>
      </template>
    </Toolbar>

    <AuthDialog 
      v-model:visible="showAuthDialog"
      @success="handleAuthSuccess"
    />
    </div>
  </header>
  
</template>

<script setup>
const emit = defineEmits(['auth-success'])

const { isLoggedIn } = useAuth()

const showAuthDialog = ref(false)

function handleAuthSuccess() {
  // Auth success is handled in the dialog component
  showAuthDialog.value = false
  // Emit event to parent to open recipient dialog
  emit('auth-success')
}
</script>

<style scoped>
.p-toolbar {
  border: none !important;
  background: transparent !important;
}
</style>
