<template>
  <section v-if="!accountCreated" class="modal-create-account">
    <div class="create-account-header">
      <h2 class="create-account-header--title">Create account</h2>
    </div>
    <div class="create-account-main">
      <div>
        <element-input
          :label="'First name'"
          :value="firstName"
          :invalid="firstNameValidate"
          @valueHandler="updateField($event, 'first_name')"
          @enterEvent="createAccountHandler"
        />
        <element-message v-if="firstNameValidate" :error-msg="'required'" />
      </div>
      <div>
        <element-input
          :label="'Last name'"
          :value="lastName"
          :invalid="lastNameValidate"
          @valueHandler="updateField($event, 'last_name')"
          @enterEvent="createAccountHandler"
        />
        <element-message v-if="lastNameValidate" :error-msg="'required'" />
      </div>
      <div>
        <element-input
          :label="'Email'"
          :type="'email'"
          :value="email"
          :invalid="emailValidate.length > 0"
          @valueHandler="updateField($event, 'email')"
          @enterEvent="createAccountHandler"
        />
        <element-message v-if="emailValidate" :error-msg="emailValidate" />
      </div>
      <div>
        <element-input
          :label="'Password'"
          :type="'password'"
          :value="password"
          :invalid="passwordValidate"
          :password-icon="'eye-off'"
          @valueHandler="updateField($event, 'password')"
          @enterEvent="createAccountHandler"
        />
        <element-message v-if="passwordValidate" :error-msg="'required'" />
      </div>
      <div>
        <element-input
          :label="'Confirm Password'"
          :type="'password'"
          :value="confirmPassword"
          :invalid="passwordConfirmValidate.length > 0"
          :password-icon="'eye-off'"
          @valueHandler="updateField($event, 'confirm_password')"
          @enterEvent="createAccountHandler"
        />
        <element-message v-if="passwordConfirmValidate" :error-msg="passwordConfirmValidate" />
      </div>
      <element-checkbox @getValue="updateTermsHandler" :invalid="termsValidate">
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
        :text="'Create account'"
        :modifiers="['important']"
        @click="createAccountHandler"
      />
    </div>
    <div class="create-account-footer">
      <div v-if="false" class="create-account-item">
        <img
          src="@/assets/images/modals/sign-up/google.svg"
          alt=""
          class="item-icon"
        />
        <h4 class="item-title">Continue with Google</h4>
      </div>
      <div v-if="false" class="create-account-item">
        <img
          src="@/assets/images/modals/sign-up/facebook.svg"
          alt=""
          class="item-icon"
        />
        <h4 class="item-title">Continue with Facebook</h4>
      </div>
      <div class="create-account-login">
        <p class="item-text">You have an account?</p>
        <p class="item-link" @click="changeViewHandler">Sign in</p>
      </div>
    </div>
  </section>
  <section v-if="accountCreated" class="modal-create-account">
    <div class="create-account-header">
      <h2 class="create-account-header--title">Confirm email address</h2>
    </div>
    <p class="create-account-message">
      We just sent you a link to <span class="message-email">{{ email }}</span
      >. Click the link in your email to confirm your email
    </p>
    <p class="resend-message">
      Didn’t receive an email?
      <a class="resend-message__link" href="#" @click="createAccountHandler"
        >Resend email</a
      >
    </p>
  </section>
</template>

<script>
import { ref } from 'vue'
import Input from '../elements/Input.vue'
import Button from '../elements/Button.vue'
import { useModalsStore } from '../../stores/Modals'
import ApplicationService from '../../services/ApplicationService'
import { useAuthenticationStore } from '../../stores/Authentication'
import Checkbox from '../elements/Checkbox.vue'
import Message from '../elements/Message.vue'
import validations from '../../hooks/validations'

export default {
  name: 'CreateAccount',
  components: {
    'element-input': Input,
    'element-button': Button,
    'element-checkbox': Checkbox,
    'element-message': Message
  },
  setup(props, context) {
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const ModalsStore = useModalsStore()
    const accountCreated = ref(false)
    const AuthenticationStore = useAuthenticationStore()
    const termsAccept = ref(false)
    const emailValidate = ref('')
    const firstNameValidate = ref(false)
    const lastNameValidate = ref(false)
    const passwordValidate = ref(false)
    const termsValidate = ref(false)
    const passwordConfirmValidate = ref('')

    function changeViewHandler() {
      context.emit('updateView', 'login')
    }

    function updateField(value, fieldName) {
      if (fieldName === 'first_name') {
        firstNameValidate.value = false
        firstName.value = value
      }
      if (fieldName === 'last_name') {
        lastNameValidate.value = false
        lastName.value = value
      }
      if (fieldName === 'email') {
        emailValidate.value = ''
        email.value = value
      }
      if (fieldName === 'password') {
        passwordValidate.value = false
        password.value = value
      }
      if (fieldName === 'confirm_password') {
        passwordConfirmValidate.value = ''
        confirmPassword.value = value
      }
    }

    function createAccountHandler() {
      if (!validations.validateRequiredField(firstName.value)) {
        firstNameValidate.value = true
      }
      if (!validations.validateRequiredField(lastName.value)) {
        lastNameValidate.value = true
      }
      if (!validations.validateRequiredField(password.value)) {
        passwordValidate.value = true
      }
      if (!validations.validateRequiredField(email.value)) {
        emailValidate.value = 'required'
      }
      if (
        !emailValidate.value &&
        !validations.validateEmailAddress(email.value)
      ) {
        emailValidate.value = 'email'
      }
      if (!termsAccept.value) {
        termsValidate.value = true
      }
      if (!validations.validateRequiredField(confirmPassword.value)) {
        passwordConfirmValidate.value = 'required'
      }
      if (!validations.validatePassword(confirmPassword.value, password.value) && !passwordConfirmValidate.value.length) {
        passwordConfirmValidate.value = 'confirm_password'
      }
      if (
        firstNameValidate.value ||
        lastNameValidate.value ||
        passwordValidate.value ||
        emailValidate.value ||
        termsValidate.value ||
        passwordConfirmValidate.value
      ) {
        return
      }
      ApplicationService.internalMethod(
        {
          email: email.value,
          first_name: firstName.value,
          last_name: lastName.value,
          password: password.value
        },
        '/callcustomers/create'
      ).then((response) => {
        localStorage.setItem('customer_id', response.customer_id)
        const userData = {
          email: email.value,
          first_name: firstName.value,
          last_name: lastName.value,
          password: password.value,
          customer_id: response.customer_id
        }
        AuthenticationStore.updateUserData(userData)
        accountCreated.value = true
        ModalsStore.updateModal('VerifyEmail', {
          email: email.value
        })
      })
      // AuthenticationService.createAccount(email.value, firstName.value, lastName.value, password.value).then(() => {
      //   accountCreated.value = true
      // })
    }

    function updateTermsHandler(value) {
      termsValidate.value = false
      termsAccept.value = value
    }

    return {
      email,
      firstName,
      lastName,
      password,
      accountCreated,
      confirmPassword,
      termsAccept,
      emailValidate,
      firstNameValidate,
      lastNameValidate,
      passwordValidate,
      termsValidate,
      passwordConfirmValidate,
      changeViewHandler,
      updateField,
      createAccountHandler,
      updateTermsHandler
    }
  }
}
</script>

<style scoped></style>
