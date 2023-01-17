<template>
  <section class="verify-email-modal">
    <img
        src="@/assets/images/shared/close.svg"
        alt="Close"
        class="verify-email-modal-close"
        @click="closeModalHandler"
    />
      <div class="verify-email-image">
        <img src="@/assets/images/modals/verify-email/sms.svg" class="image" alt="">
      </div>
      <h2 class="verify-email-title">Verify your email address</h2>
    <p class="verify-email-description">
      We sent a confirmation email to {{ modalData.email }}.
      Check your email and click on the confirmation link to continue
    </p>
  </section>
</template>

<script>
import { useModalsStore } from '../../stores/Modals'
import {computed} from "vue";

export default {
  name: "VerifyEmail",
  setup() {
    const ModalsStore = useModalsStore()
    const modalData = computed(() => {
      return ModalsStore.getModalData
    })

    function closeModalHandler() {
      return ModalsStore.updateModal('')
    }
    return {
      modalData,
      closeModalHandler
    }
  }
}
</script>

<style scoped>

</style>