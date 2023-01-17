<template>
  <label class="mass-market-checkbox" :class="{ 'mass-market-checkbox__invalid': invalid }">
    <input
      :disabled="disabled"
      :checked="checked"
      @click="handleValue"
      class="mass-market-checkbox__input"
      type="checkbox"
    />
    <span class="mass-market-checkbox__button">
      <img src="@/assets/images/elements/checkbox/check.svg" class="check-icon" alt="check">
    </span>
    <span v-if="text" class="mass-market-checkbox__label">
      {{ text }}
    </span>
    <slot name="checkbox-label"></slot>
  </label>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'Checkbox',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    invalid: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const checked = ref(false)

    function handleValue() {
      checked.value = !checked.value
      context.emit('getValue', checked.value)
    }
    return { checked, handleValue }
  }
}
</script>

<style scoped></style>
