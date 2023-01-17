<template>
  <div class="mass-market-select">
    <element-label v-if="label.length" :label="label" />
    <VueMultiselect
      v-model="selected"
      :options="options"
      :disabled="disabled"
      :searchable="searchable"
      :label="optionLabel"
      :placeholder="placeholder"
      :allow-empty="false"
      @select="selectOptionHandler"
      deselect-label=""
      select-label=""
      selected-label=""
      class="select"
    >
    </VueMultiselect>
    <span v-if="floatingLabel" class="floating-label">{{ floatingLabelText }}</span>
    <img v-if="invalidData" src="@/assets/images/elements/select/info-invalid.svg" alt="invalid" class="invalid-data">
  </div>
</template>

<script>
import {ref, watch} from 'vue'
import VueMultiselect from 'vue-multiselect'
import Label from '@/components/elements/Label.vue'

export default {
  name: 'Select',
  components: {
    VueMultiselect,
    'element-label': Label
  },
  props: {
    options: {
      type: [Array, Object],
      default: () => ['test', 'test2'],
      required: false
    },
    value: {
      type: [Object, Array, String],
      default: ''
    },
    searchable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    optionLabel: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    floatingLabel: {
      type: Boolean,
      default: false
    },
    floatingLabelText: {
      type: Boolean,
      default: ''
    },
    invalidData: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const selected = ref(null)

    watch(() => props.value, (value) => {
        selected.value = value
    }, { immediate: true })

    function selectOptionHandler(option) {
      context.emit('selectedOption', option)
    }

    return { selected, selectOptionHandler }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
