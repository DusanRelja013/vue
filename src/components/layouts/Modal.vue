<template>
  <section class="base-modal">
    <div class="base-modal__mask"></div>
    <div class="base-modal__container">
      <slot />
    </div>
  </section>
</template>

<script lang="ts">
import { useModalsStore } from '@/stores/Modals'
import {onMounted, onUnmounted} from "vue";

export default {
  name: 'Modal',
  setup() {
    const ModalsStore = useModalsStore()

    onMounted(() => {
      document.body.classList.add('lang-index')
    })

    onUnmounted(() => {
      document.body.classList.remove('lang-index')
    })

    function closeModalHandler() {
      ModalsStore.updateModal('')
    }

    return {
      closeModalHandler
    }

  }
}
</script>
