<template>
  <section class="payment">
    <SecurePayment />
    <TotalPayment />
  </section>
</template>

<script>
import TotalPayment from '../components/views/payment/TotalPayment.vue'
import SecurePayment from '../components/views/payment/SecurePayment.vue'
export default {
  name: 'Payment',
  components: {
    TotalPayment,
    SecurePayment
  }
}
</script>

<style scoped>

</style>