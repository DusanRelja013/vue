<template>
  <section class="secure-payment">
    <div class="secure-payment__header">
      <div class="header-item">
        <h1 class="item-title">Enter your payment details</h1>
      </div>
      <img
        src="@/assets/images/views/payment/payment-details.svg"
        alt=""
        class="header-icon"
      />
    </div>
    <div class="secure-payment__content">
      <form id="payment-form">
        <div class="content-options">
          <h4 class="content-options-title">Credit card</h4>
          <div id="payment-element"></div>
        </div>
        <element-checkbox @getValue="updateTermsHandler">
          <template v-slot:checkbox-label>
            <p class="mass-market-checkbox__label">
              By using our site, you acknowledge and confirm that you have read,
              understood and agree to be bound by our
              <router-link :to="{ name: 'terms' }" target="_blank"
                >Terms & Conditions</router-link
              >.
            </p>
          </template>
        </element-checkbox>
        <element-button
          v-if="!isMobile"
          :text="'Pay'"
          :modifiers="['important']"
          :disabled="!termsAccept"
          :animation="animation"
          @click="createOrderHandler"
        />
      </form>
      <div class="content-description">
        <img
          src="@/assets/images/views/payment/lock.svg"
          alt="lock"
          class="content-description__icon"
        />
        <p class="content-description__text">
          This is a secure credit card payment
        </p>
      </div>
      <div class="go-back" @click="goBackHandler">
        <img
          src="@/assets/images/shared/back.svg"
          alt=""
          class="go-back--icon"
        />
        <h4 class="go-back--title">Back</h4>
      </div>
    </div>
  </section>
</template>

<script>
import Button from '../../../elements/Button.vue'
import { computed, onMounted, ref, watch } from 'vue'
import ApplicationService from '../../../../services/ApplicationService'
import { useModalsStore } from '../../../../stores/Modals'
import { useCartStore } from '../../../../stores/Cart'
import { useDeviceStore } from '../../../../stores/Device'
import Checkbox from '../../../elements/Checkbox.vue'
import { usePaymentStore } from '../../../../stores/Payment'

export default {
  name: 'PaymentStep2',
  components: {
    'element-button': Button,
    'element-checkbox': Checkbox
  },
  props: {
    userData: {
      type: Object,
      default: null,
      deep: true
    }
  },
  setup(props, context) {
    const ModalsStore = useModalsStore()
    const CartStore = useCartStore()
    const card = ref(null)
    const officeId = ref('')
    const animation = ref(false)
    const modalType = ref('PaymentSuccess')
    const termsAccept = ref(false)
    const DeviceStore = useDeviceStore()
    const PaymentStore = usePaymentStore()

    const cartItems = computed(() => {
      return CartStore.getCartItems
    })

    const isMobile = computed(() => {
      return DeviceStore.getIsMobile
    })

    const paymentStepSelected = computed(() => {
      return PaymentStore.getSecondStepSubmit
    })

    function updateTermsHandler(value) {
      termsAccept.value = value
      if (isMobile.value && termsAccept.value) {
        PaymentStore.updateSecondStepValid(true)
      } else {
        PaymentStore.updateSecondStepValid(false)
      }
    }

    ApplicationService.checkUserProfile(props.userData.email)
      .then((response) => {
        if (response) {
          modalType.value = 'PaymentSuccess'
        }
      })
      .catch((error) => {
        modalType.value = 'ProfileCreated'
      })

    if (localStorage.getItem('office_id')) {
      officeId.value = localStorage.getItem('office_id').toString()
    }

    let paymentElement = undefined
    let stripe = window.Stripe(props.userData?.publicKey),
      elements = stripe.elements({
        clientSecret: props.userData?.clientSecret
      })

    onMounted(() => {
      paymentElement = elements.create('payment')
      paymentElement.mount('#payment-element')
    })

    async function createOrderHandler() {
      const customerId = localStorage.getItem('customer_id')
      const firstName = props.userData ? props.userData.firstName : ''
      const lastName = props.userData ? props.userData.lastName : ''
      const email = props.userData ? props.userData.email : ''
      const selectedItems = {
        main: [],
        secondary: []
      }

      cartItems.value.forEach((item) => {
        if (item.RunwayId) {
          selectedItems.main.push({
            RunwayId: item.RunwayId,
            OfatCode: item.OFatCode,
            NoOfEntries: item.NoOfEntries,
            Validity: item.Validity,
            ProcessingSpeedCode: item.ProcessingSpeedCode,
            ServiceType: item.OfatCode,
            Quantity: item.Quantity,
            Destination: item.Destination,
            VisaType: item.VisaType,
            Nationality: item.Nationality,
            EVisa: item.IsElectronic,
            EntryDate: item.EntryDate,
            ExitDate: item.ExitDate
          })
        }
        if (!item.RunwayId) {
          selectedItems.secondary.push({
            code: item.code,
            quantity: item.quantity,
            destination: item.destination,
            entryDate: item.entryDate,
            exitDate: item.exitDate
          })
        }
      })

      animation.value = true
      await stripe.confirmSetup({ elements, redirect: 'if_required' })
        .then(async (result) => {
          if (result.setupIntent && result.setupIntent.status === 'succeeded') {
            await ApplicationService.createOrder(
              props.userData.customerId,
              props.userData.paymentMethodId,
              firstName,
              lastName,
              email,
              parseInt(officeId.value),
              selectedItems.main,
              selectedItems.secondary
            )
              .then((response) => {
                if (customerId) {
                  CartStore.clearBasket(customerId, officeId.value)
                }
                localStorage.removeItem('cartItems')
                if (!customerId) {
                  CartStore.clearCart()
                }
                ModalsStore.updateModal(modalType.value, email)
              })
              .catch((error) => {
                ModalsStore.updateModal('PaymentFailed')
              })
          }

          if (result.error) {
            ModalsStore.updateModal('PaymentFailed')
          }
        })
        .catch((error) => {
          ModalsStore.updateModal('PaymentFailed')
        })
        .finally(() => {
          if (isMobile.value) {
            PaymentStore.updatePaymentFinished(true)
          }
          animation.value = false
        })
    }

    function goBackHandler() {
      context.emit('activeStep', { step: 1 })
      if (isMobile.value) {
        PaymentStore.updateActiveStep(1)
        PaymentStore.updateFirstStepValid(false)
        PaymentStore.updateFirstStepSubmit(false)
        PaymentStore.updateSecondStepValid(false)
        PaymentStore.updateSecondStepSubmit(false)
      }
    }

    watch(paymentStepSelected, () => {
      if (isMobile.value && paymentStepSelected.value) {
        createOrderHandler()
      }
    })

    return {
      card,
      animation,
      termsAccept,
      isMobile,
      goBackHandler,
      updateTermsHandler,
      createOrderHandler
    }
  }
}
</script>

<style scoped></style>
