<template>
  <section class="mass-market-toggle">
    <element-label v-if="label.length" :label="label" />
    <div class="toggle-wrapper">
      <label class="toggle">
        <input
            class="toggle-input"
            type="checkbox"
            :disabled="disabled"
            :checked="checked"
            @change="$emit('handleToggleValue', $event.target.checked)"
        />
        <span class="slider" :class="{ disabled: disabled }"></span>
      </label>
    </div>
  </section>
</template>

<script>
import Label from "./Label.vue";

export default {
  name: 'Toggle',
  components: {
    'element-label': Label
  },
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>