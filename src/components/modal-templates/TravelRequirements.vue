<template>
  <section class="modal-travel-requirements">
    <img
      src="@/assets/images/shared/close.svg"
      alt="Close"
      class="requirements-close"
      @click="closeModalHandler"
    />
    <div
      class="requirements-status"
      :class="{
        restricted: modalData.status === 'restricted',
        allowed: modalData.status === 'allowed',
        forbidden: modalData.status === 'forbidden'
      }"
    >
      {{ modalData?.status }}
    </div>
    <h2 class="requirements-title">Travel requirements</h2>
    <p class="requirements-description">
      {{ modalData?.details}}
    </p>
    <p class="requirements-description">
      {{ modalData?.summary}}
    </p>
  </section>
</template>

<script>
import { computed } from 'vue'
import { useModalsStore } from '../../stores/Modals'

export default {
  name: 'TravelRequirements',
  setup() {
    const ModalsStore = useModalsStore()
    const modalData = computed(() => {
      return ModalsStore.getModalData
    })

    function closeModalHandler() {
      return ModalsStore.updateModal('')
    }

    return { modalData, closeModalHandler }
  }
}
</script>

<style scoped>

</style>