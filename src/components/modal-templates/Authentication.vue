<template>
  <section class="modal-authentication">
    <h2 class="authentication-title">Authentication</h2>
    <div class="authentication-body">
      <element-input :label="'Username'" @valueHandler="updateUsernameHandler"  @enterEvent="submitAuthHandler" />
      <element-input :label="'Password'" :type="'password'" :password-icon="'eye-off'" @valueHandler="updatePasswordHandler" @enterEvent="submitAuthHandler"  />
      <element-message v-if="wrongData" :error-msg="'invalid'" />
      <element-button :text="'Confirm'" :modifiers="['valid']" @click="submitAuthHandler" />
    </div>
  </section>
</template>

<script lang="ts">
import Input from "../elements/Input.vue";
import Button from "../elements/Button.vue";
import Message from "../elements/Message.vue"
import { ref } from "vue";
import { useModalsStore } from "@/stores/Modals";
import { useAuthenticationStore } from "@/stores/Authentication";

export default {
  name: "Authentication",
  components: {
    'element-input': Input,
    'element-button': Button,
    'element-message': Message
  },
  setup() {
    const wrongData = ref(false)
    const username = ref('')
    const password = ref('')
    const ModalsStore = useModalsStore()
    const AuthStore = useAuthenticationStore()

    function updateUsernameHandler(value: string) {
      wrongData.value = false
      username.value = value
    }

    function updatePasswordHandler(value: string) {
      wrongData.value = false
      password.value = value
    }

    function submitAuthHandler() {
      wrongData.value = false;
      if (username.value === 'wonderlust' && password.value === 'TeamTesla!') {
        AuthStore.updateAuthConfirmed(true)
        ModalsStore.updateModal('')
      } else {
        wrongData.value = true
      }
    }

    return {
      updateUsernameHandler,
      updatePasswordHandler,
      submitAuthHandler,
      wrongData
    }
  }
}
</script>

<style scoped>

</style>
