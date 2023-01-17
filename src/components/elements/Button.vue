<template>
  <button
    :type="type"
    :disabled="disabled || animation"
    :class="setClasses(modifiers, 'mass-market-button')"
    class="mass-market-button"
  >
    <img v-if="icon" :src="imgUrl" class="mass-market-button__icon" alt="" />
    <span :class="{'animation-text': animation}">{{ text }}</span>
    <div v-if="animation" class="dot-elastic"></div>
  </button>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'Button',
  props: {
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    modifiers: {
      type: Array,
      default: () => []
    },
    animation: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'button'
    }
  },
  setup(props) {
    const imgUrl = computed(function () {
      return new URL(
        `../../assets/images/elements/button/${props.icon}.svg`,
        import.meta.url
      ).href
    })

    function setClasses(fieldClass, className) {
      let allClass = ''
      for (let i = 0; i < fieldClass.length; i++) {
        if (fieldClass[i]) {
          allClass = allClass + ' ' + className + '--' + fieldClass[i]
        }
      }

      return allClass
    }

    return { setClasses, imgUrl }
  }
}
</script>
