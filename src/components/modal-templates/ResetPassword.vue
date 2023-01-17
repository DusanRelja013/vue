<template>
  <section class="modal-reset-password">
    <section v-if="!emailSend" class="forgot-password">
      <h4 class="forgot-password-title">Forgot your password</h4>
      <p class="forgot-password-description">
        No problem! Enter your email address below and we’ll send you a link to
        reset it.
      </p>
      <div class="forgot-password-content">
        <div>
          <element-input
            :label="'Email'"
            :type="'email'"
            :invalid="emailValidate || emailRequired"
            :value="email"
            @enterEvent="resetPasswordHandler"
            @valueHandler="updateEmailHandler"
          />
          <element-message v-if="emailValidate" :error-msg="'email'" />
          <element-message v-if="emailRequired" :error-msg="'required'" />
          <element-message v-if="emailNotExist" :error-msg="'invalid'" />
        </div>
        <element-button
          :text="'Reset password'"
          :modifiers="['important']"
          @click="resetPasswordHandler"
        />
        <element-button
          :text="'Back'"
          :modifiers="['transparent']"
          @click="changeViewHandler"
        />
      </div>
    </section>
    <section v-if="emailSend" class="reset-password">
      <h4 class="reset-password__title">Reset password</h4>
      <p class="reset-password-message">
        We just sent you a link to <span class="email">{{ email }}</span
        >. Click the link in your email to reset your password
      </p>
      <p class="resend-message">
        Didn’t receive an email?
        <a class="resend-message__link" href="#" @click="resetPasswordHandler"
          >Resend email</a
        >
      </p>
    </section>
  </section>
</template>

<script>
import Input from '../elements/Input.vue'
import Button from '../elements/Button.vue'
import { ref } from 'vue'
import AuthenticationService from '../../services/AuthenticationService'
import validations from '../../hooks/validations'
import Message from '../elements/Message.vue'

export default {
  name: 'ResetPassword',
  components: {
    'element-input': Input,
    'element-button': Button,
    'element-message': Message
  },
  setup(props, context) {
    const email = ref()
    const emailSend = ref(false)
    const emailValidate = ref(false)
    const emailRequired = ref(false)
    const emailNotExist = ref(false)

    function updateEmailHandler(value) {
      emailNotExist.value = false
      emailValidate.value = false
      emailRequired.value = false
      email.value = value
    }

    function resetPasswordHandler() {
      emailRequired.value = !validations.validateRequiredField(email.value)
      if (emailRequired.value) {
        return
      }
      emailValidate.value = !validations.validateEmailAddress(email.value)
      if (emailValidate.value) {
        return
      }
      AuthenticationService.passwordReset(email.value)
        .then(() => {
          emailSend.value = true
        })
        .catch(() => {
          emailNotExist.value = true
        })
    }

    function changeViewHandler() {
      context.emit('updateView', 'login')
    }

    return {
      email,
      emailSend,
      emailValidate,
      emailRequired,
      emailNotExist,
      changeViewHandler,
      updateEmailHandler,
      resetPasswordHandler
    }
  }
}
</script>

<style scoped></style>
