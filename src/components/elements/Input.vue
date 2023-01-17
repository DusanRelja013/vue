<template>
  <section class="mass-market-input">
    <element-label v-if="label.length" :label="label" />
    <div
      class="mass-market-input--wrapper"
      :class="{ 'input-password': type === 'password', 'invalid': invalid }"
    >
      <input
        :value="currentValue"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :max-length="maxLength"
        :name="name"
        @keyup="inputHandler($event)"
        class="input"
        autocomplete="off"
        ref="input"
      />
      <div v-if="type === 'password'" class="password-icon" @click="togglePasswordViewHandler">
        <img :src="`/images/elements/input/${ passwordImage }.svg`" alt="password">
      </div>
    </div>
  </section>
</template>

<script>
import { onMounted, ref, toRefs, watch } from 'vue'
import Label from '@/components/elements/Label.vue'
export default {
  name: 'Input',
  components: {
    'element-label': Label
  },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Object, Array, Number]
    },
    maxLength: {
      type: Number,
      required: false
    },
    focus: {
      type: Boolean,
      default: false
    },
    passwordIcon: {
      type: String,
      default: ''
    },
    invalid: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const currentValue = ref('')
    const input = ref(null)
    const inputType = ref('')
    const passwordImage = ref('eye-off')
    let { passwordIcon } = toRefs(props)

    if (passwordIcon.value.length) {
      passwordImage.value = passwordIcon.value
    }

    function inputHandler($event) {
      currentValue.value = $event.target.value
      if ($event.key === 'Enter' || $event.keyCode === 13) {
        context.emit('enterEvent', currentValue.value)
        return
      }
      context.emit('valueHandler', currentValue.value)
    }
    function togglePasswordViewHandler() {
      if (passwordIcon.value) {
        inputType.value === 'password'
          ? ((inputType.value = 'text'), (passwordImage.value = 'eye-on'))
          : ((inputType.value = 'password'), (passwordImage.value = 'eye-off'))
      }
    }

    onMounted(() => {
      inputType.value = props.type
    })

    watch(
      () => props.value,
      (value) => {
        currentValue.value = value
      },
      { immediate: true }
    )

    watch(
      () => props.focus,
      (value) => {
        if (value && null !== input.value) {
          input.value.focus()
        }
      },
      { immediate: true }
    )

    return {
      inputType,
      passwordImage,
      currentValue,
      input,
      inputHandler,
      togglePasswordViewHandler
    }
  }
}
</script>

<style scoped></style>
