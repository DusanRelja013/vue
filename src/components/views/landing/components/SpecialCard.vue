<template>
  <section class="special-card">
    <p class="special-card-status">Special Offer</p>
    <h4 class="special-card-title">Bundle & Save</h4>
    <p class="special-card-description">Bundle all products together and
      get a discount on total price.
    </p>
    <div class="special-card-details">
      <div class="detail-item">
        <img src="@/assets/images/shared/ok.svg" alt="" class="detail-item__icon">
        <p class="detail-item__title">Travel Visa Application</p>
      </div>
      <div class="detail-item">
        <img src="@/assets/images/shared/ok.svg" alt="" class="detail-item__icon">
        <p class="detail-item__title">Travel Visa Application</p>
      </div>
      <div class="detail-item">
        <img src="@/assets/images/shared/ok.svg" alt="" class="detail-item__icon">
        <p class="detail-item__title">Travel Visa Application</p>
      </div>
    </div>
    <StarScore :score="2.5" />
    <div class="special-card-actions">
      <div class="card-price">
        <p class="card-price--title">from</p>
        <p class="card-price--value">$320</p>
      </div>
      <element-button :modifiers="['important']" :icon="'shopping-cart'" />
    </div>
  </section>
</template>

<script lang="ts">
import Button from '@/components/elements/Button.vue'
import StarScore from '@/components/shared/StarScore.vue'

export default {
  name: 'SpecialCard',
  components: {
    'element-button': Button,
    StarScore
  }
}
</script>

<style scoped>

</style>