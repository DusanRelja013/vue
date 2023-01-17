<template>
  <section class="mass-market-message">
    <p v-if="errorMsg" class="mass-market-message__error">
      {{ $t(`validations.${errorMsg}`) }}
    </p>
  </section>
</template>

<script>
export default {
  name: 'Message',
  props: {
    errorMsg: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>