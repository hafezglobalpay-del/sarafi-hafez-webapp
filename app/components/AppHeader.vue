<template>
 <v-container>
  <header class="bg-surface-0 shadow-sm">
    <Toolbar class="px-4 md:px-9 py-3 md:py-4">
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
  </header>
  </v-container>
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
</style>
