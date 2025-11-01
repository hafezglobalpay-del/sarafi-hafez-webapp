<template>
  <div class="language-switcher flex gap-1">
    <NuxtLink 
      v-for="availableLocale in availableLocales" 
      :key="availableLocale.code"
      :to="switchLocalePath(availableLocale.code)"
      class="px-2 py-1 rounded text-sm font-medium transition-all duration-200"
      
    >
    <div class="flex items-center">   
      <FlagIcon 
        :flag="availableLocale.code === 'en' ? 'circle-flags:us' : 'circle-flags:ir'" 
        size="1em" 
        class="mx-1" 
      />
      <span class="hidden sm:inline">{{ availableLocale.name }}</span>
    </div>
    </NuxtLink>
  </div>
</template>

<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => locales.value)

</script>

<style scoped>
.language-switcher {
  direction: ltr;
}

.language-switcher a {
  text-decoration: none;
}
</style>
