<template>
  <section class="search-widget">
    <element-select
      :options="offices"
      :option-label="'country'"
      :value="selectedWidgetOffice"
      @selectedOption="selectOfficeHandler"
    />
    <div class="line"></div>
    <element-select
      :options="destinations"
      :value="selectedWidgetDestination"
      :option-label="'name'"
      @selectedOption="selectDestinationHandler"
    />
    <div class="line"></div>
    <element-datepicker
      :placeholder="''"
      :short-format="true"
      :min-date="new Date()"
      :value="[selectedWidgetDate.from, selectedWidgetDate.to]"
      class="widget-datepicker"
      @handleValue="updateDateHandler"
    />
    <element-button
      :icon="'search'"
      :modifiers="['valid']"
      :disabled="
        !selectedWidgetOffice || !selectedDestination || !selectedWidgetDate
      "
      @click="updateResultPageHandler"
    />
  </section>
</template>

<script>
import Select from '../elements/Select.vue'
import DatePickerC from '@/components/elements/DatePickerC.vue'
import Button from '@/components/elements/Button.vue'
import { computed, ref, watch } from 'vue'
import { useApplicationStore } from '@/stores/Application'
import ApplicationService from '../../services/ApplicationService'
import { useServicesStore } from '../../stores/Services'
import { useDetailsStore } from '../../stores/Details'

export default {
  name: 'Widget',
  components: {
    'element-select': Select,
    'element-datepicker': DatePickerC,
    'element-button': Button
  },
  setup() {
    const DetailsStore = useDetailsStore()
    const ServicesStore = useServicesStore()
    const ApplicationStore = useApplicationStore()
    const offices = ref([])
    const destinations = ref([])
    const selectedWidgetOffice = ref(null)
    const selectedWidgetDestination = ref(null)
    const selectedWidgetDate = ref({
      from: new Date(),
      to: new Date()
    })

    const allOffices = computed(function () {
      return ApplicationStore.getOffices
    })

    const countries = computed(function () {
      return ApplicationStore.getCountries
    })

    const selectedOffice = computed(function () {
      return ApplicationStore.getSelectedOffice
    })

    const selectedDestination = computed(() => {
      return ApplicationStore.getSelectedDestination
    })

    const selectedDateRange = computed(() => {
      return ApplicationStore.getSelectedDateRange
    })

    const selectedNationality = computed(function () {
      return ApplicationStore.getSelectedNationality
    })

    if (selectedOffice.value) {
      updateDestinationsHandler(selectedOffice.value)
    }
    function selectOfficeHandler(selectedOffice) {
      selectedWidgetOffice.value = selectedOffice
      selectedWidgetDestination.value = null
      const availableDestinations = []
      const destinationsIds = selectedOffice.destinations
      if (destinationsIds && countries) {
        for (let i = 0; i < countries.value.length; i++) {
          if (destinationsIds.includes(countries.value[i].cid)) {
            availableDestinations.push(countries.value[i])
          }
        }
        destinations.value = availableDestinations
      }
    }

    function selectDestinationHandler(destination) {
      selectedWidgetDestination.value = destination
    }

    function updateDateHandler(date) {
      selectedWidgetDate.value = {
        from: date[0],
        to: date[1]
      }
    }

    function updateDestinationsHandler(selectedOffice) {
      const availableDestinations = []
      const destinationsIds = selectedOffice.destinations
      ApplicationStore.updateSelectedOffice(selectedOffice)
      if (destinationsIds && countries) {
        for (let i = 0; i < countries.value.length; i++) {
          if (destinationsIds.includes(countries.value[i].cid)) {
            availableDestinations.push(countries.value[i])
          }
        }
        destinations.value = availableDestinations
      }
    }

    async function updateResultPageHandler() {
      localStorage.setItem('office_id', selectedWidgetOffice.value.id)
      ApplicationStore.updateSelectedOffice(selectedWidgetOffice.value)
      ApplicationStore.updateSelectedDestination(
        selectedWidgetDestination.value
      )
      ApplicationStore.updateSelectedDate(selectedWidgetDate.value)

      await ApplicationService.getMainServices(
        selectedWidgetDestination.value.code,
        selectedWidgetOffice.value.id,
        selectedNationality.value.code
      )
        .then((services) => {
          if (services) {
            ServicesStore.updateServices(services)
          }
        })
        .catch((error) => {
          ServicesStore.updateServices([])
        })

      await ApplicationService.getSecondaryServices(
        selectedWidgetDestination.value.code,
        selectedWidgetOffice.value.id
      )
        .then((response) => {
          if (response) {
            ServicesStore.updateSecondaryServices(response)
          }
        })
        .catch((error) => {
          ServicesStore.updateSecondaryServices([])
        })

      await ApplicationService.getDestinationRestrictions(
        selectedWidgetOffice.value.code,
        selectedWidgetDestination.value.code
      ).then((response) => {
        if (response) {
          DetailsStore.updateRestrictionDetails(response)
        }
      })
      await ApplicationService.getLocalSummary(selectedWidgetDestination.value.code).then((response) => {
        DetailsStore.updateLocalSummary(response)
      })
      // await ApplicationService.getVisaInfoByNationality(selectedDestination.value.code.toLowerCase()).then((response) => {
      //   DetailsStore.updateVisasByNationality(response)
      // })
    }

    watch(
      allOffices,
      () => {
        const validOffices = []
        for (const property in allOffices.value) {
          const office = allOffices.value[property]
          office.id = property
          validOffices.push(office)
        }
        offices.value = validOffices
      },
      { immediate: true }
    )

    watch(
      selectedOffice,
      () => {
        selectedWidgetOffice.value = selectedOffice.value
      },
      { immediate: true }
    )

    watch(
      selectedDestination,
      () => {
        selectedWidgetDestination.value = selectedDestination.value
      },
      { immediate: true }
    )

    watch(
      selectedDateRange,
      () => {
        if (selectedDateRange.value) {
          selectedWidgetDate.value = selectedDateRange.value
        }

      },
      { immediate: true }
    )

    return {
      offices,
      destinations,
      selectedOffice,
      selectedDestination,
      selectedDateRange,
      selectedWidgetOffice,
      selectedWidgetDestination,
      selectedWidgetDate,
      selectOfficeHandler,
      selectDestinationHandler,
      updateDateHandler,
      updateResultPageHandler
    }
  }
}
</script>

<style scoped></style>
