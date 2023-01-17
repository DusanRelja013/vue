<template>
  <section class="secure-payment">
    <div class="secure-payment__header">
      <div class="header-item">
        <h1 class="item-title">Card holder details</h1>
        <img
          src="@/assets/images/views/payment/profile-tick.svg"
          alt="profile"
          class="item-icon"
        />
      </div>
    </div>
    <div class="secure-payment__content">
      <p class="content-subtitle">
        We'll use this information to send you confirmation and updates about
        your orders
      </p>
      <element-input
        :class="{ invalid: emailValidate }"
        :type="'email'"
        :value="userInfo.email"
        :disabled="userData?.email.length > 0"
        :label="'Email address'"
        :placeholder="'Email'"
        @valueHandler="inputHandler($event, 'email')"
      />
      <element-message v-if="emailValidate" :error-msg="'email'" />
      <div class="content-group">
        <element-input
          :label="'First Name'"
          :placeholder="'First Name'"
          :value="userInfo.firstName"
          :disabled="userData?.first_name.length > 0"
          @valueHandler="inputHandler($event, 'firstName')"
        />
        <element-input
          :label="'Last Name'"
          :placeholder="'Last Name'"
          :value="userInfo.lastName"
          :disabled="userData?.last_name.length > 0"
          @valueHandler="inputHandler($event, 'lastName')"
        />
      </div>
      <element-button
        v-if="!isMobile"
        :text="'Next : Payment details'"
        :modifiers="['important']"
        :animation="animation"
        :disabled="!userInfo.email || !userInfo.firstName || !userInfo.lastName"
        @click="nextStepHandler"
      />
      <div class="payment-details">
        <img
          src="@/assets/images/views/payment/lock-circle.svg"
          alt="lock"
          class="payment-details-image"
        />
        <p class="payment-details-text">This is a secure credit card payment</p>
      </div>
    </div>
  </section>
</template>

<script>
import {computed, ref, watch} from 'vue'
import Input from '../../../elements/Input.vue'
import Button from '../../../elements/Button.vue'
import validations from '../../../../hooks/validations'
import Message from '../../../elements/Message.vue'
import ApplicationService from '../../../../services/ApplicationService'
import { useDeviceStore } from '../../../../stores/Device'
import { usePaymentStore } from "../../../../stores/Payment";
import { useAuthenticationStore } from "../../../../stores/Authentication";

export default {
  name: 'PaymentStep1',
  components: {
    'element-input': Input,
    'element-button': Button,
    'element-message': Message
  },
  setup(props, context) {
    const userInfo = ref({
      email: '',
      firstName: '',
      lastName: ''
    })
    const emailValidate = ref(false)
    const animation = ref(false)
    const DeviceStore = useDeviceStore()
    const PaymentStore = usePaymentStore()
    const AuthenticationStore = useAuthenticationStore()

    const userData = computed(() => {
      return AuthenticationStore.getUserData
    })

    const isMobile = computed(() => {
      return DeviceStore.getIsMobile
    })

    const paymentStepSelected = computed(() => {
      return PaymentStore.getFirstStepSubmit
    })

    function nextStepHandler() {
      emailValidate.value = false
      emailValidate.value = !validations.validateEmailAddress(
        userInfo.value.email
      )
      if (emailValidate.value) {
        return
      }
      animation.value = true
      ApplicationService.productsIntent(
        1,
        userInfo.value.email,
        userInfo.value.firstName,
        userInfo.value.lastName
      )
        .then((response) => {
          animation.value = false
          context.emit('activeStep', {
            step: 2,
            user: {
              firstName: userInfo.value.firstName,
              lastName: userInfo.value.lastName,
              email: userInfo.value.email,
              clientSecret: response.clientSecret,
              customerId: response.customerId,
              publicKey: response.pubKey,
              paymentMethodId: response.paymentMethodId
            }
          })
          if (isMobile.value) {
            PaymentStore.updateActiveStep(2)
          }
        })
        .finally(() => {
          animation.value = false
        })
    }

    function inputHandler(value, field) {
      userInfo.value[field] = value
      if (field === 'email') {
        emailValidate.value = false
      }
      if (isMobile.value) {
        PaymentStore.updatePaymentFinished(false)
        const emailVal = !validations.validateEmailAddress(userInfo.value.email)
        if (userInfo.value.firstName && userInfo.value.lastName && userInfo.value.email && !emailVal) {
          PaymentStore.updateFirstStepValid(true)
        } else {
          PaymentStore.updateFirstStepValid(false)
        }
      }
    }

    watch(paymentStepSelected, () => {
      if (isMobile.value && paymentStepSelected.value) {
        nextStepHandler()
      }
    })

    watch(userData, () => {
      if (userData.value) {
        if (userData.value.email.length) {
          userInfo.value.email = userData.value.email
        }
        if (userData.value.first_name.length) {
          userInfo.value.firstName = userData.value.first_name
        }
        if (userData.value.first_name.length) {
          userInfo.value.lastName = userData.value.last_name
        }
      }
    }, { immediate: true })

    return {
      userInfo,
      emailValidate,
      animation,
      isMobile,
      userData,
      inputHandler,
      nextStepHandler
    }
  }
}
</script>

<style scoped></style>
