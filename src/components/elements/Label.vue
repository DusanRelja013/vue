<template>
  <label class="mass-market-label">{{ label }}</label>
</template>

<script>
export default {
  name: 'Label',
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>