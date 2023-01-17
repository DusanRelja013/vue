<template>
  <section class="landing-page">
    <welcome />
    <information />
    <explore />
    <covid />
    <places />
    <travel-tips />
  </section>
</template>

<script>
import Welcome from '@/components/views/landing/Welcome.vue'
import Information from '@/components/views/landing/Information.vue'
import Covid from '@/components/views/landing/Covid.vue'
import Explore from '@/components/views/landing/Explore.vue'
import Places from '@/components/views/landing/Places.vue'
import TravelTips from '@/components/views/landing/TravelTips.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useApplicationStore } from '@/stores/Application'
import ApplicationService from '@/services/ApplicationService'
import { useDetailsStore } from "../stores/Details";

export default {
  name: 'Landing',
  components: {
    Welcome,
    Information,
    Covid,
    Explore,
    Places,
    TravelTips
  },
  setup() {
    const ApplicationStore = useApplicationStore()
    const DetailsStore = useDetailsStore()
    const router = useRouter()
    const officeId = localStorage.getItem('officeId')
    const destinationId = localStorage.getItem('destinationId')

    const selectedDestination = computed(() => {
      return ApplicationStore.getSelectedDestination
    })

    const selectedOffice = computed(function () {
      return ApplicationStore.getSelectedOffice
    })

    if (!selectedDestination.value && !selectedOffice.value && (!officeId || !destinationId)) {
      router.push({ name: 'home'})
    }

    if (selectedOffice.value && selectedDestination.value) {
      ApplicationService.getDestinationRestrictions(
        selectedOffice.value.code,
        selectedDestination.value.code
      ).then((response) => {
        if (response) {
          DetailsStore.updateRestrictionDetails(response)
        }
      })
    }

    if (selectedDestination.value) {
      ApplicationService.getLocalSummary(selectedDestination.value.code).then((response) => {
        DetailsStore.updateLocalSummary(response)
      })
    }
    if (selectedOffice.value) {
      ApplicationService.getVisaInfoByNationality(selectedOffice.value.code.toLowerCase()).then((response) => {
        DetailsStore.updateVisasByNationality(response)
      })
    }
  }
}
</script>

<style scoped></style>
