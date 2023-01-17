<template>
  <section class="quantity">
    <input
      type="button"
      value="-"
      class="minus"
      :disabled="quantity === 1 || disabled"
      @click="quantityHandler('remove')"
    />
    <input
      type="number"
      step="1"
      min="1"
      max=""
      name="quantity"
      :disabled="true"
      :value="quantity"
      title="Quantity"
      class="input-text"
      size="4"
    />
    <input
      type="button"
      value="+"
      :disabled="disabled"
      class="plus"
      @click="quantityHandler('add')"
    />
  </section>
</template>

<script lang="ts">
import { ref, watch } from 'vue'

export default {
  name: 'Quantity',
  props: {
    value: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props: any, context: { emit: (arg0: string, arg1: number) => void }) {
    const quantity = ref(1)

    function quantityHandler(item: string) {
      if (item === 'add') {
        quantity.value += 1
      }
      if (item === 'remove' && quantity.value > 1) {
        quantity.value = quantity.value - 1
      }

      context.emit('valueHandler', quantity.value)
    }

    watch(
      () => props.value,
      (value) => {
        quantity.value = value
      },
      { immediate: true }
    )

    return { quantity, quantityHandler }
  }
}
</script>

<style scoped></style>
