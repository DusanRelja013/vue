<template>
  <section class="total-payment">
    <div class="payment-header" :class="{ 'hide-payment': !showPayment }">
      <h4 class="payment-header-title">Order summary</h4>
    </div>
    <div class="total-payment-items" :class="{ 'hide-payment': !showPayment }">
      <div v-for="(item, index) in cartItems" class="total-payment-item" :key="index">
        <div class="item-image-wrapper">
          <img
              v-if="item.RunwayId"
              src="@/assets/images/views/landing/travel-card/service.png"
              alt="service"
              class="item-image"
          />
          <img
              v-if="!item.RunwayId && item.image"
              :src="item.image"
              alt="service"
              class="item-image"
          />
          <img
              v-if="!item.RunwayId && !item.image"
              src="@/assets/images/views/landing/travel-card/no-image.png"
              alt="service"
              class="item-image"
          />
        </div>
        <div class="item-content">
          <div class="content-title">
            <h2 class="content-title__service">
              {{ item.RunwayId ? item.Name : item.name }}
            </h2>
            <h2 v-if="item.RunwayId" class="content-title__destination">
              {{ getDestinationName(item) }}
            </h2>
          </div>
          <div v-if="item.RunwayId" class="content-description">
            <p class="content-description__item">
              Nationality - {{ getNationalityName(item) }}
            </p>
            <p class="content-description__item">
              {{ item.Name }}
            </p>
            <p class="content-description__item">
              {{ item.EntryName }}
            </p>
            <p class="content-description__item">
              {{ item.ProcessingSpeedDesc }}
            </p>
          </div>
          <div class="content-total">
            <p class="content-total__quantity">
              Quantity {{ getQuantity(item) }}
            </p>
            <p class="content-total__price">
              {{
                item.RunwayId ? item.CurrencyCode : item.currencyCode
              }}
              {{
                item.RunwayId
                    ? item.TotalFeeWithVAT * item.Quantity
                    : item.totalAmountWithTax * item.quantity
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="total-payment-header" :class="{ 'hide-payment': !showPayment }">
      <h2 class="header-title">Total for payment ({{ cartItems.length }})</h2>
      <h2 v-if="cartSummary" class="header-price">{{ selectedCurrency }} {{ cartSummary?.totalAmount }}</h2>
      <h2 v-if="!cartSummary && totalAmount" class="header-price">{{ selectedCurrency }} {{ totalAmount }}</h2>
    </div>
    <div class="total-payment-footer">
      <img
        src="@/assets/images/views/payment/arrow-up.svg"
        alt="arrow up"
        class="arrow"
        :class="{ 'arrow-down': showPayment }"
        @click="togglePaymentHandler"
      />
      <div class="footer-content">
        <h4 class="footer-content--title">Total</h4>
        <p class="footer-content--price">{{ selectedCurrency }} {{ totalAmount }}</p>
      </div>
      <element-button
        v-if="activeStep === 1"
        :disabled="!firstStepValid"
        :animation="animationStep1"
        :text="'Next'"
        :modifiers="['important']"
        @click="submitStepHandler(1)"
      />
      <element-button
        v-if="activeStep === 2"
        :disabled="!secondStepValid"
        :animation="animationStep2"
        :text="'Pay'"
        :modifiers="['important']"
        @click="submitStepHandler(2)"
      />
    </div>
  </section>
</template>

<script>
import {ref, watch} from "vue";
import Button from '../../elements/Button.vue'
import {computed} from "vue";
import { useCartStore } from "../../../stores/Cart";
import { useApplicationStore } from "../../../stores/Application";
import {usePaymentStore} from "../../../stores/Payment";
import { useDeviceStore } from "../../../stores/Device";

export default {
  name: 'TotalPayment',
  components: {
    'element-button': Button
  },
  setup() {
    const ApplicationStore = useApplicationStore()
    const showPayment = ref(false)
    const animationStep1 = ref(false)
    const animationStep2 = ref(false)
    const CartStore = useCartStore()
    const PaymentStore = usePaymentStore()
    const DeviceStore = useDeviceStore()

    const firstStepValid = computed(() => {
      return PaymentStore.getFirstStepValid
    })

    const secondStepValid = computed(() => {
      return PaymentStore.getSecondStepValid
    })

    const activeStep = computed(() => {
      return PaymentStore.getActiveStep
    })

    const cartItems = computed(() => {
      return CartStore.getCartItems
    })

    const cartSummary = computed(() => {
      return CartStore.getCartSummary
    })

    const totalAmount = computed(() => {
      return CartStore.getTotalAmount
    })

    const countries = computed(() => {
      return ApplicationStore.getCountries
    })

    const selectedCurrency = computed(() => {
      return ApplicationStore.getSelectedCurrency
    })

    const isMobile = computed(() => {
      return DeviceStore.getIsMobile
    })

    const paymentFinished = computed(() => {
      return PaymentStore.getPaymentFinished
    })

    function togglePaymentHandler() {
      showPayment.value = !showPayment.value
    }

    function getDestinationName(card) {
      for (let i = 0; i < countries.value.length; i++) {
        if (countries.value[i].cid == card.Destination) {
          return countries.value[i].name
        }
      }
    }

    function getNationalityName(card) {
      for (let i = 0; i < countries.value.length; i++) {
        if (countries.value[i].cid == card.Nationality) {
          return countries.value[i].name
        }
      }
    }

    function getQuantity(card) {
      if (card.RunwayId) {
        return card.Quantity
      }
      if (!card.RunwayId) {
        return card.quantity
      }
    }

    function submitStepHandler(step) {
      if (step === 1) {
        animationStep1.value = true
        PaymentStore.updateFirstStepSubmit(true)
      }
      if (step === 2) {
        animationStep2.value = true
        PaymentStore.updateSecondStepSubmit(true)
      }
    }

    watch(activeStep, () => {
      if (isMobile.value && activeStep.value === 2) {
        animationStep1.value = false
      }
      if (isMobile.value && paymentFinished.value) {
        animationStep2.value = false
      }
    })

    return {
      showPayment,
      cartItems,
      cartSummary,
      totalAmount,
      selectedCurrency,
      firstStepValid,
      activeStep,
      secondStepValid,
      animationStep1,
      animationStep2,
      togglePaymentHandler,
      getDestinationName,
      getNationalityName,
      getQuantity,
      submitStepHandler
    }
  }
}
</script>

<style scoped>

</style>
