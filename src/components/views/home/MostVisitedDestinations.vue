<template>
  <section class="home-most-visited">
    <h4 class="home-most-visited__title">Popular destinations</h4>
    <div class="visited-card-wrapper">
      <tempate v-for="(destination, index) in popularDestinations" :key="index">
        <VisitedCard :destination="destination" />
      </tempate>
    </div>
    <div v-if="mostVisitedDestinations > 4" class="load-more">
      <img
        src="@/assets/images/shared/down.svg"
        alt=""
        class="load-more-icon"
      />
      <p class="load-more-title">Load more destinations</p>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import VisitedCard from '@/components/views/home/components/VisitedCard.vue'
import { computed, watch } from 'vue'
import { useDetailsStore } from '@/stores/Details'
import shared from '../../../hooks/shared'

export default {
  name: 'MostVisitedDestinations',
  components: {
    VisitedCard
  },
  setup() {
    const image1 = '@/assets/images/home/most-visited/image1.png'
    const mostVisitedDestinations = ref(4)
    const DetailsStore = useDetailsStore()
    const popularDestinations = ref([])

    const regions = computed(() => {
      return DetailsStore.getRegions
    })

    watch(
      regions,
      () => {
        if (regions.value) {
          const filteredArray = regions.value.filter(
            (region) => !region.country
          )
          if (filteredArray) {
            popularDestinations.value = shared.getRandomElements(
              filteredArray,
              4
            )
          }
        }
      },
      { immediate: true }
    )

    return { image1, mostVisitedDestinations, popularDestinations }
  }
}
</script>

<style scoped></style>
