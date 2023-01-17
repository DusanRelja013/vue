<template>
  <section
    id="travel-requirements"
    class="landing-travel-requirements"
    ref="travel"
  >
    <div class="travel-services">
      <div
        v-if="
          (mainServices?.length && !visaDetails?.VisaRequired) ||
          (!mainServices?.length && visaDetails?.VisaRequired) ||
          (mainServices?.length && visaDetails?.VisaRequired)
        "
        class="travel-services-main"
      >
        <h2 class="travel-services-main--title">
          Visa is
          {{ visaDetails?.VisaRequired ? 'required' : 'not required' }} for your
          trip
        </h2>
        <template v-if="visaCard.TotalFeeWithVAT && mainServices.length">
          <TravelCard :main-service="true" :service="visaCard" />
        </template>
        <EmptyTravelCard
          v-if="!mainServices.length"
          :title="'No available Visa services'"
          :description="'Unfortunately, we don’t currently offer visa services for your chosen destination.'"
        />
      </div>
      <div class="travel-services-additional">
        <h2 class="travel-services-additional--title">
          Get these other services to make your trip planning easier
        </h2>
        <template v-if="secondaryServices.length">
          <TravelCard
            v-for="(service, index) in secondaryServices"
            :key="index"
            :service="service"
          />
        </template>
        <EmptyTravelCard
          v-if="!secondaryServices.length"
          :title="'No available services'"
          :description="'Unfortunately, we don’t offer services for chosen destination'"
        />
      </div>
    </div>
    <div
      v-if="restrictionDetails && restrictionDetails.requirements.length"
      class="travel-facts"
    >
      <h4 class="travel-facts__title">Quick travel facts</h4>
      <div class="travel-facts__items">
        <template v-if="restrictionDetails && restrictionDetails.requirements">
          <TravelFact
            v-for="(item, index) in restrictionDetails.requirements"
            :key="index"
            :index="index + 1"
            :active-item="activeFact"
            :icon="item.category.id"
            :title="item.category?.name"
            :summary="item.summary"
            :description="item.details"
            @handleValue="updateFactHandler"
          />
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import TravelCard from './components/TravelCard.vue'
import EmptyTravelCard from './components/EmptyTravelCard.vue'
import { useServicesStore } from '@/stores/Services'
import { ref, computed, watch, onMounted } from 'vue'
import TravelFact from './components/TravelFact.vue'
import { useDetailsStore } from '@/stores/Details'
import { useApplicationStore } from '@/stores/Application'
import { useScrollStore } from '@/stores/Scroll'

export default {
  name: 'TravelRequirements',
  components: {
    TravelCard,
    TravelFact,
    EmptyTravelCard
  },
  setup() {
    const ApplicationStore = useApplicationStore()
    const ServicesStore = useServicesStore()
    const DetailsStore = useDetailsStore()
    const ScrollState = useScrollStore()
    const allServices: any = ref([])
    const travel = ref()

    const selectedCurrency = computed(() => {
      return ApplicationStore.getSelectedCurrency
    })
    const visaCard = ref({
      Name: 'e-Visa',
      Description:
        'Apply for your visa online in a few simple steps. We’ll use our extensive resources to secure all the important paperwork so you can enjoy your journey.',
      TotalFeeWithVAT: 0,
      CurrencyCode: selectedCurrency.value
    })
    const visaDetails = ref(null)
    const activeFact = ref(0)

    const mainServices: any = computed(() => {
      return ServicesStore.getServices
    })

    const secondaryServices = computed(() => {
      return ServicesStore.getSecondaryServices
    })

    const restrictionDetails: any = computed(() => {
      return DetailsStore.getRestrictionDetails
    })

    const visaRequired: any = computed(() => {
      return DetailsStore.getVisaRequired
    })

    const selectedDestination: any = computed(() => {
      return ApplicationStore.getSelectedDestination
    })

    const scrollPosition = computed(() => {
      return ScrollState.getScrollPositionY
    })

    function updateFactHandler(value: number) {
      activeFact.value = value
    }

    watch(
      [mainServices, secondaryServices],
      () => {
        if (mainServices.value.length) {
          const minServicePrice = Math.min(
            ...mainServices.value.map((item: any) => item.TotalFeeWithVAT)
          )
          if (minServicePrice) {
            visaCard.value.TotalFeeWithVAT = minServicePrice
            visaCard.value.CurrencyCode = mainServices.value[0].CurrencyCode
          }
          const services = allServices.value.concat(
            mainServices.value,
            secondaryServices.value
          )
          allServices.value = services
        }
      },
      { immediate: true }
    )

    watch(
      selectedDestination,
      () => {
        if (visaRequired.value) {
          const destinationCode = selectedDestination.value?.code3
          const visa = visaRequired.value.find(
            (visa: any) => visa.Iso == destinationCode
          )
          if (visa) {
            visaDetails.value = { ...visa }
          }
        }
      },
      { immediate: true }
    )

    watch(
      visaRequired,
      () => {
        if (selectedDestination.value && visaRequired.value) {
          const destinationCode = selectedDestination.value?.code3
          const visa = visaRequired.value.find(
            (visa: any) => visa.Iso == destinationCode
          )
          if (visa) {
            visaDetails.value = { ...visa }
          }
        }
      },
      { immediate: true }
    )

    watch(scrollPosition, () => {
      if (travel.value) {
        const travelView = travel.value.getBoundingClientRect()
        if (
          travelView.top < 150 &&
          travelView.bottom < travelView.height + 100 &&
          travelView.bottom > 130
        ) {
          ScrollState.updateActiveLandingTab('travel-requirements')
        }
      }
    })

    return {
      travel,
      activeFact,
      mainServices,
      secondaryServices,
      allServices,
      visaCard,
      restrictionDetails,
      visaDetails,
      updateFactHandler
    }
  }
}
</script>

<style scoped></style>
