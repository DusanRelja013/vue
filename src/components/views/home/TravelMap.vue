<template>
  <section class="home-travel-map">
    <h2 class="home-travel-map__title">Where To?</h2>
    <p class="home-travel-map__description">
      With an ever-changing travel landscape where rules and restrictions are
      updated daily, it’s more important than ever to have the latest info
      before you go! Use our travel map to find the most up-to-date requirements
      for your chosen country.
    </p>
    <div class="travel-map">
      <div class="travel-map-options">
        <element-select
          :options="reasons"
          :label="'Question'"
          :option-label="'name'"
          :value="selectedReason"
          @selectedOption="selectQuestionHandler"
        />
        <element-select
          :options="destinations"
          :option-label="'name'"
          :label="'From'"
          :placeholder="'From'"
          :value="selectedDestination"
          :disabled="destinations.length === 0"
          @selectedOption="selectDestinationHandler"
        />
        <element-toggle
          :label="'Fully vaccinated'"
          :disabled="selectedReason.key === 'visa'"
          :checked="fullVaccinated"
          @handleToggleValue="fullVaccinatedHandler"
        />
      </div>
      <MapVisas
        v-if="showTravelMap"
        :country="selectedDestination"
        :code="visaCode"
      />
      <MapRestrictions
        v-if="!showTravelMap"
        :country="selectedDestination"
        :full-vaccinated="fullVaccinated"
      />
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import Select from '@/components/elements/Select.vue'
import { computed, watch } from 'vue'
import { useApplicationStore } from '@/stores/Application'
import MapVisas from './components/MapVisas.vue'
import MapRestrictions from './components/MapRestrictions.vue'
import Toggle from '../../elements/Toggle.vue'

export default {
  name: 'TravelMap',
  components: {
    'element-select': Select,
    'element-toggle': Toggle,
    MapVisas,
    MapRestrictions
  },
  setup() {
    const reasons = ref([
      {
        key: 'visa',
        name: 'Where do I need a visa to travel from'
      },
      {
        key: 'restrictions',
        name: 'What country has travel restrictions?'
      }
    ])
    const ApplicationStore = useApplicationStore()
    const selectedReason = ref({
      key: 'restrictions',
      name: 'What country has travel restrictions?'
    })
    const selectedDestination = ref(null)
    const showTravelMap = ref(true)
    const fullVaccinated = ref(false)

    const destinations = computed(() => {
      return ApplicationStore.getCountries
    })

    const countryId = computed(function () {
      return ApplicationStore.getCountryByIP
    })

    const visaCode = ref('')

    watch(
      countryId,
      () => {
        if (countryId.value) {
          const activeDestination = destinations.value.find(
            (x) => x.code === countryId.value.code
          )
          if (activeDestination) {
            selectedDestination.value = activeDestination
          }
          if (selectedReason.value.key === 'visa') {
            showTravelMap.value = true
          }
          if (selectedReason.value.key === 'restrictions') {
            showTravelMap.value = false
          }
        }
      },
      { immediate: true }
    )

    function selectDestinationHandler(option) {
      if (selectedReason.value.key === 'visa') {
        showTravelMap.value = true
      }
      if (selectedReason.value.key === 'restrictions') {
        showTravelMap.value = false
      }
      selectedDestination.value = option
    }

    function selectQuestionHandler(option) {
      selectedReason.value = option
      if (option.key === 'visa') {
        showTravelMap.value = true
        fullVaccinated.value = false
      }
      if (option.key === 'restrictions') {
        showTravelMap.value = false
      }
    }

    function fullVaccinatedHandler(value) {
      fullVaccinated.value = value
    }

    return {
      reasons,
      destinations,
      selectedReason,
      selectedDestination,
      showTravelMap,
      countryId,
      visaCode,
      fullVaccinated,
      selectDestinationHandler,
      selectQuestionHandler,
      fullVaccinatedHandler
    }
  }
}
</script>

<style scoped></style>
