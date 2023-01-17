<template>
  <section class="login-modal">
    <div class="login-header">
      <h2 class="login-header__title">Sign in</h2>
    </div>
    <div class="login-main">
      <element-input
        :label="'Email'"
        :value="email"
        :type="'email'"
        :invalid="emailValidate.length > 0"
        @valueHandler="updateEmail"
        @enterEvent="loginHandler"
      />
      <element-message v-if="emailValidate" :error-msg="emailValidate" />
      <element-input
        :label="'Password'"
        :type="'password'"
        :value="password"
        :invalid="passwordValidate.length > 0"
        :password-icon="'eye-off'"
        @enterEvent="loginHandler"
        @valueHandler="updatePassword"
      />
      <element-message v-if="passwordValidate" :error-msg="passwordValidate" />
      <h4 class="login-main__forgot" @click="forgotPasswordHandler">
        Forgot password?
      </h4>
      <element-button
        :text="'Sign in'"
        :modifiers="['important']"
        @click="loginHandler"
      />
    </div>
    <div class="login-footer">
      <div v-if="false" class="login-item">
        <img
          src="@/assets/images/modals/sign-up/google.svg"
          alt=""
          class="item-icon"
        />
        <h4 class="item-title">Continue with Google</h4>
      </div>
      <div v-if="false" class="login-item">
        <img
          src="@/assets/images/modals/sign-up/facebook.svg"
          alt=""
          class="item-icon"
        />
        <h4 class="item-title">Continue with Facebook</h4>
      </div>
      <div class="create-account-item">
        <p class="item-text">Don’t have an account?</p>
        <p class="item-link" @click="createAccountHandler">Create account</p>
      </div>
    </div>
  </section>
</template>

<script>
import Input from '../elements/Input.vue'
import Button from '../elements/Button.vue'
import Message from '../elements/Message.vue'
import { ref } from 'vue'
import validations from '@/hooks/validations'
import ApplicationService from '../../services/ApplicationService'
import { useAuthenticationStore } from '../../stores/Authentication'
import { useModalsStore } from '../../stores/Modals'

export default {
  name: 'Login',
  components: {
    'element-input': Input,
    'element-button': Button,
    'element-message': Message
  },
  setup(props, context) {
    const AuthenticationStore = useAuthenticationStore()
    const ModalsStore = useModalsStore()
    const email = ref('')
    const password = ref('')
    const emailValidate = ref('')
    const passwordValidate = ref('')
    const invalidData = ref(false)

    function updateEmail(newEmail) {
      emailValidate.value = ''
      email.value = newEmail
    }

    async function loginHandler() {
      if (!validations.validateRequiredField(email.value)) {
        emailValidate.value = 'required'
      }
      if (!validations.validateRequiredField(password.value)) {
        passwordValidate.value = 'required'
      }
      if (
        !emailValidate.value &&
        !validations.validateEmailAddress(email.value)
      ) {
        emailValidate.value = 'email'
      }
      if (emailValidate.value || passwordValidate.value) {
        return
      }

      await ApplicationService.internalMethod(
        { email: email.value, password: password.value },
        '/callcustomers/login'
      ).then((res) => console.log('res', res))

      await ApplicationService.internalMethod({}, '/callcustomers/login')
        .then((res) => res.json())
        .then((userData) => {
          if (userData) {
            localStorage.setItem('customer_id', userData?.customer_id)
            // localStorage.setItem('temp_api_key', userData?.temp_api_key)
            localStorage.setItem('first_name', userData?.first_name)
            localStorage.setItem('last_name', userData?.last_name)
            localStorage.setItem('email', userData?.email)
            AuthenticationStore.updateUserData(userData)
            window.location.href = window.location.protocol + '//' + window.location.host + `/customers`
          }
          ModalsStore.updateModal('')
        })
    }

    function updatePassword(newPassword) {
      passwordValidate.value = ''
      password.value = newPassword
    }

    function createAccountHandler() {
      context.emit('updateView', 'create-account')
    }

    function forgotPasswordHandler() {
      context.emit('updateView', 'reset')
    }

    return {
      email,
      password,
      updateEmail,
      emailValidate,
      invalidData,
      passwordValidate,
      updatePassword,
      loginHandler,
      forgotPasswordHandler,
      createAccountHandler
    }
  }
}
</script>

<style scoped></style>
