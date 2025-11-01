<template>
  <div 
    class="min-h-screen flex flex-col font-iran"
    :dir="locale === 'fa' ? 'rtl' : 'ltr'"
    :class="{ 'rtl': locale === 'fa' }"
  >
    <AppHeader @auth-success="handleAuthSuccess" />
    <main class="flex-1 p-4 bg-gray-50">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
const { locale } = useI18n()

const handleAuthSuccess = () => {
  // Auth success is handled directly in the payment flow
}
</script>


