<template>
  <section class="modal-payment-success">
    <img src="@/assets/images/layouts/header/logo-small-blue.svg" alt="logo" class="logo">
    <div class="success-image">
      <img src="@/assets/images/views/payment/purchase-success.svg" alt="" class="success-image__icon" />
    </div>
    <div class="success-content">
      <h4 class="content-title">Thanks for your purchase</h4>
      <p class="content-description">Your payment was successful. We just sent you a link to{{ modalData }}.
        Click on the link to verify your email and access your Traveler Hub.</p>
    </div>
    <div class="success-actions">
      <element-button
          :text="'Done'"
          @click="closeModalHandler"
          :modifiers="['important']"
      />
    </div>
  </section>
</template>

<script>
import { useRouter } from 'vue-router'
import { useModalsStore } from '../../stores/Modals'
import { computed } from 'vue'
import Button from "../elements/Button.vue";

export default {
  name: "ProfileCreated",
  components: {
    'element-button': Button
  },
  setup() {
    const router = useRouter()
    const ModalsStore = useModalsStore()
    const modalData = computed(() => {
      return ModalsStore.getModalData
    })

    function closeModalHandler() {
      window.location.href =
          window.location.protocol + '//' + window.location.host + `/customers`
      ModalsStore.updateModal('')
    }

    return {
      modalData,
      closeModalHandler
    }
  }
}
</script>

<style scoped>

</style>