<template>
  <section class="payment-failed">
    <div class="payment-failed-logo">
      <img src="@/assets/images/modals/payment/card-remove.svg" alt="Payment failed" class="icon">
    </div>
    <div class="payment-failed-content">
      <h4 class="content-title">Your payment failed</h4>
      <p class="content-description">
        We were unable to process your payment.
      </p>
    </div>
    <div class="payment-failed-actions">
      <element-button
        :text="'Try again'"
        :modifiers="['important']"
        @click="closeModalHandler"
      />
    </div>
  </section>
</template>

<script lang="ts">
import Button from "../elements/Button.vue";
import {useModalsStore} from "@/stores/Modals";

export default {
  name: 'PaymentFailed',
  components: {
    'element-button': Button
  },
  setup() {
    const ModalsStore = useModalsStore()

    function closeModalHandler() {
      ModalsStore.updateModal('')
    }

    return {
      closeModalHandler
    }

  }
}
</script>

<style scoped></style>