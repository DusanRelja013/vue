<template>
  <section class="home-page">
    <trip-requirements />
    <requirements-card class="home-page-requirements-card" />
    <travel-map />
    <most-visited-destinations />
    <how-it-works />
  </section>
</template>

<script>
import TripRequirements from '@/components/views/home/TripRequirements.vue'
import TravelMap from '@/components/views/home/TravelMap.vue'
import MostVisitedDestinations from '@/components/views/home/MostVisitedDestinations.vue'
import HowItWorks from '@/components/views/home/HowItWorks.vue'
import RequirementsCard from '@/components/views/home/components/RequirementsCard.vue'
import {useRoute} from "vue-router";
import {onMounted} from "vue";
import ApplicationService from "../services/ApplicationService";

export default {
  name: 'Home',
  components: {
    TripRequirements,
    TravelMap,
    MostVisitedDestinations,
    HowItWorks,
    RequirementsCard
  },
  setup() {
    const route = useRoute()

    onMounted(() => {
      if (route.query.extension) {
        ApplicationService.extensionUpdate(route.query.extension)
      }
    })
  }
}
</script>

<style scoped>

</style>