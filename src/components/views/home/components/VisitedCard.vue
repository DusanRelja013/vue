<template>
  <section class="visited-card">
    <div
      v-if="destination && destination.cc_photo"
      class="visited-card-view"
    >
      <img :src="destination.cc_photo[0].cc_photo" alt="" class="visited-card-view__image">
    </div>
    <div class="visited-card-info">
      <div class="card-header">
        <h2 class="card-header-title">{{ destination?.name }}</h2>
      </div>
      <div v-if="destination?.profile_tags.length" class="card-description">
        <template v-for="(field, index) in destination.profile_tags" :key="index">
          <div v-if="index < 5" class="description-item">
            <img src="@/assets/images/shared/ok.svg" alt="" class="description-item__icon">
            <p class="description-item__title">{{ field.name }}</p>
          </div>
        </template>

      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'VisitedCard',
  props: {
    destination: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>

</style>