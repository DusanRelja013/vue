<template>
  <div class="extendable-item">
    <img
      src="@/assets/images/views/landing/quality/language.svg"
      alt=""
      class="extendable-item__image"
    />
    <div class="extendable-item-info">
      <h4 class="info-title">Language & esential vocabulary</h4>
      <p
        class="info-description"
        :class="{ 'info-description__extend': isVisible }"
      >
        here are a number of languages of Morocco. The two official languages
        are Standard Arabic and Standard Moroccan Berber
      </p>
    </div>
    <img
      src="@/assets/images/shared/plus.svg"
      alt=""
      class="extendable-toggle"
      @click="updateCardStatus"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ExtendCard',
  setup() {
    const isVisible = ref(false)
    const icon = ref('plus')

    function updateCardStatus() {
      isVisible.value = !isVisible.value
      if (isVisible.value) {
        icon.value = 'minus'
      } else {
        icon.value = 'plus'
      }
    }

    return {
      isVisible,
      icon,
      updateCardStatus
    }
  }
}
</script>

<style scoped></style>
