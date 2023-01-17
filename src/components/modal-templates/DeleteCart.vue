<template>
  <section class="modal-delete-cart">
    <h4 class="delete-cart-title">Delete item</h4>
    <p class="delete-cart-description">
      Are you sure you want to delete item from the <br> shopping cart?
    </p>
    <div class="delete-cart-actions">
      <element-button
        :text="'Cancel'"
        @click="closeModalHandler"
        class="btn-cancel"
      />
      <element-button
        :text="'Delete'"
        @click="deleteCartHandler"
        class="btn-delete"
      />
    </div>
  </section>
</template>

<script>
import Button from '../elements/Button.vue'
import { useModalsStore } from '../../stores/Modals'
import { useApplicationStore } from '../../stores/Application'
import { useCartStore } from '../../stores/Cart'
import { computed } from 'vue'

export default {
  name: "DeleteCart",
  components: {
    'element-button': Button
  },
  setup() {
    const ModalsStore = useModalsStore()
    const ApplicationStore = useApplicationStore()
    const CartStore = useCartStore()

    const selectedOffice = computed(function () {
      return ApplicationStore.getSelectedOffice
    })

    const modalData = computed(() => {
      return ModalsStore.getModalData
    })

    function closeModalHandler() {
      ModalsStore.updateModal('')
    }

    function deleteCartHandler() {
      CartStore.removeCartItem(modalData.value, selectedOffice.value?.id)
      closeModalHandler()
    }

    return {
      closeModalHandler,
      deleteCartHandler
    }
  }
}
</script>

<style scoped>

</style>