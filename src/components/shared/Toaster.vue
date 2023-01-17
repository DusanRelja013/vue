<template>
  <section v-if="showToaster" class="toaster">
    <h4 class="toaster-title">{{ toaster.message }}</h4>
    <div class="toaster-icon">
      <img src="@/assets/images/shared/ok-green.svg" alt="ok">
    </div>
  </section>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useToasterStore } from '../../stores/Toaster'

export default {
  name: 'Toaster',
  setup() {
    const showToaster = ref(false)
    const StoreToaster = useToasterStore()

    const toaster = computed(() => {
      return StoreToaster.getToasterData;
    })

    watch(toaster, () => {
      showToaster.value = true
      setTimeout(() => {
        showToaster.value = false
      }, toaster.value.duration)
    })

    function closeToasterHandler() {
      showToaster.value = false
    }

    return {
      showToaster,
      toaster,
      closeToasterHandler
    }
  }
}
</script>

<style scoped>

</style>