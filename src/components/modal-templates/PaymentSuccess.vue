<template>
  <section class="modal-payment-success">
    <img src="@/assets/images/layouts/header/logo-small-blue.svg" alt="logo" class="logo">
    <div class="success-image">
      <img src="@/assets/images/views/payment/purchase-success.svg" alt="" class="success-image__icon" />
    </div>
    <div class="success-content">
      <h4 class="content-title">Thanks for your purchase</h4>
      <p class="content-description">Your payment was successful. You will be redirected to complete your applications.</p>
    </div>
    <div class="success-actions">
      <element-button
        v-if="true"
        :text="'Continue to Traveler Hub'"
        @click="closeModalHandler"
        :modifiers="['important']"
      />
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { useModalsStore } from '../../stores/Modals'
import Button from '../elements/Button.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'PaymentSuccess',
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
      window.location.href = window.location.protocol + "//" + window.location.host + '/customers'
      ModalsStore.updateModal('')
    }

    setTimeout(() => {
      window.location.href = window.location.protocol + "//" + window.location.host + '/customers'
      ModalsStore.updateModal('')
    }, 4000)

    return {
      modalData,
      closeModalHandler
    }
  }
}
</script>

<style scoped>

</style>