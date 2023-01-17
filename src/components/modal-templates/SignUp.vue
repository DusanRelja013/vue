<template>
  <section class="modal-signup">
    <img
      src="@/assets/images/shared/close.svg"
      alt="Close"
      class="modal-signup__close"
      @click="closeModalHandler"
    />
    <img src="@/assets/images/layouts/header/logo-small-blue.svg" alt="logo" class="logo">
    <CreateAccount v-if="currentView === 'create-account'" @updateView="updateViewHandler" />
    <Login v-if="currentView === 'login'" @updateView="updateViewHandler" />
    <ResetPassword v-if="currentView === 'reset'"  @updateView="updateViewHandler" />
  </section>
</template>

<script>
import CreateAccount from './CreateAccount.vue'
import Login from './Login.vue'
import ResetPassword from './ResetPassword.vue'
import { useModalsStore } from '../../stores/Modals'
import { ref } from 'vue'

export default {
  name: 'SignUp',
  components: {
    CreateAccount,
    Login,
    ResetPassword
  },
  setup() {
    const currentView = ref('login')
    const ModalsStore = useModalsStore()

    function closeModalHandler() {
      ModalsStore.updateModal('')
    }

    function updateViewHandler(value) {
      currentView.value = value
    }

    return {
      currentView,
      closeModalHandler,
      updateViewHandler
    }
  }
}
</script>

<style scoped>

</style>