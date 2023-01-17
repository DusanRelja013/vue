<template>
  <section class="empty-travel-card">
    <div class="card-header">
      <div class="card-header-icon">
        <img src="@/assets/images/views/landing/warning.svg" alt="warning" class="card-header-icon__image">
      </div>
      <h4 class="card-header-title">{{ title }}</h4>
    </div>
    <div class="card-body">
      <p class="card-body__text">{{ description }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: "EmptyTravelCard",
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>