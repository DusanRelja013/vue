<template>
  <section class="secure-payment-wrapper">
    <div class="payment-back" @click="goBackHandler">
      <img src="@/assets/images/shared/arrow-left.svg" alt="" class="payment-back-image" />
      <h4 class="payment-back-title">Back</h4>
    </div>
    <section class="payment-steps">
      <div class="step" :class="{ 'step-active': paymentStep === 1, 'step-completed': paymentStep === 2}">
        <div class="step-item">
          1.
        </div>
        <h4 class="step-title">Personal details</h4>
      </div>
      <img src="@/assets/images/views/payment/arrow-right.svg" alt="arrow" class="step-icon">
      <div class="step" :class="{'step-active': paymentStep === 2}">
        <div class="step-item">
          2.
        </div>
        <h4 class="step-title">Payment details</h4>
      </div>
    </section>
    <PaymentStep1 v-if="paymentStep === 1" @activeStep="updateStepHandler" />
    <PaymentStep2 v-if="paymentStep === 2" @activeStep="updateStepHandler" :user-data="userData" />
    <section class="secure-payment-stripe">
      <img src="@/assets/images/views/payment/stripe.png" alt="stripe" class="stripe-image">
      <p class="stripe-text">
        Take payment via Stripe's secure system. A PCI-certified auditor has audited Stripe.
        We’re a certified PCI Service Provider Level 1. This is the most stringent level of certification available in the payments industry.
        To accomplish this, we use the best-in-class security tools and practices to maintain a high level of security at Stripe.
      </p>
    </section>
  </section>
</template>

<script>
import { ref } from 'vue'
import PaymentStep1 from './components/PaymentStep1.vue'
import PaymentStep2 from './components/PaymentStep2.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useDeviceStore } from '../../../stores/Device'
import { usePaymentStore } from '../../../stores/Payment'

export default {
  name: 'SecurePayment',
  components: {
    PaymentStep1,
    PaymentStep2
  },
  setup() {
    const paymentStep = ref(1)
    const userData = ref(null)
    const router = useRouter()
    const DeviceStore = useDeviceStore()
    const PaymentStore = usePaymentStore()

    const isMobile = computed(() => {
      return DeviceStore.getIsMobile
    })

    function updateStepHandler(activeStep) {
      paymentStep.value = activeStep.step
      if (activeStep.user) {
        userData.value = activeStep.user
      }
    }

    function goBackHandler() {
      if (isMobile.value) {
        PaymentStore.updateActiveStep(1)
        PaymentStore.updateFirstStepValid(false)
        PaymentStore.updateFirstStepSubmit(false)
        PaymentStore.updateSecondStepValid(false)
        PaymentStore.updateSecondStepSubmit(false)
      }
      router.push({ name: 'cart' })
    }

    return { paymentStep, userData, updateStepHandler, goBackHandler }
  }
}
</script>

<style scoped></style>
