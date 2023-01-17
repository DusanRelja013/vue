<template>
  <div class="trip-requirements">
    <h4 class="trip-requirements--title">
      Search your destination and travel dates to find visa and travel document
      requirements.
    </h4>
    <div class="trip-requirements-search">
      <element-select
          :options="countries"
          :option-label="'name'"
          :floating-label="true"
          :floating-label-text="'I am holding a passport from'"
          :disabled="!countries"
          :class="{'active-select': internSelectedNationality }"
          :invalid-data="invalidCountry"
          @selectedOption="selectCountry"
      />
      <element-select
        :options="offices"
        :option-label="'country'"
        :floating-label="true"
        :floating-label-text="'Traveling from'"
        :class="{'active-select': internSelectedOffice }"
        :invalid-data="invalidOffices"
        @selectedOption="selectOfficeHandler"
      />
      <element-select
        :options="destinations"
        :disabled="!selectedOffice"
        :option-label="'name'"
        :floating-label="true"
        :floating-label-text="'Traveling to'"
        :class="{'active-select': internSelectedDestination }"
        :invalid-data="invalidDestinations"
        @selectedOption="selectDestinationHandler"
      />
      <element-datepicker
        class="mass-market-datepicker"
        :min-date="new Date()"
        @handleValue="updateDateHandler"
        :floating-label="true"
        :floating-label-text="'Entry/Exit dates'"
        :class="{'active-select': internSelectedDate }"
        :invalid-data="invalidDate"
      />
      <element-button
        :animation="animation"
        :text="'Start planning'"
        :modifiers="['important']"
        @click="showResultPageHandler"
      />
    </div>
    <div class="trip-requirements-info">
      <div class="info-item">
        <img
          src="@/assets/images/shared/ok.svg"
          alt="Done"
          class="info-item__icon"
        />
        <p class="info-item__title">Travel with ease</p>
      </div>
      <div class="info-item">
        <img
          src="@/assets/images/shared/ok.svg"
          alt="Done"
          class="info-item__icon"
        />
        <p class="info-item__title">No hidden costs</p>
      </div>
      <div class="info-item">
        <img
          src="@/assets/images/shared/ok.svg"
          alt="Done"
          class="info-item__icon"
        />
        <p class="info-item__title">Personalized trip calendar</p>
      </div>
      <div class="info-item">
        <img
          src="@/assets/images/shared/ok.svg"
          alt="Done"
          class="info-item__icon"
        />
        <p class="info-item__title">24/7 support</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import Select from '@/components/elements/Select.vue'
import Button from '@/components/elements/Button.vue'
import DatePickerC from '@/components/elements/DatePickerC.vue'
import { useApplicationStore } from '@/stores/Application'
import ApplicationService from '../../../../services/ApplicationService'
import { useServicesStore } from '../../../../stores/Services'

export default {
  name: 'RequirementsCard',
  components: {
    'element-select': Select,
    'element-button': Button,
    'element-datepicker': DatePickerC
  },
  setup: function () {
    const router = useRouter()
    const offices = ref([])
    const destinations = ref([])
    const ApplicationStore = useApplicationStore()
    const ServicesStore = useServicesStore()
    const animation = ref(false)
    const internSelectedNationality = ref(false)
    const internSelectedOffice = ref(false)
    const internSelectedDestination = ref(false)
    const internSelectedDate = ref(false)
    const invalidCountry = ref(false)
    const invalidOffices = ref(false)
    const invalidDestinations = ref(false)
    const invalidDate = ref(false)

    const allOffices = computed(function () {
      return ApplicationStore.getOffices
    })

    const countries = computed(function () {
      return ApplicationStore.getCountries
    })

    const selectedOffice = computed(function () {
      return ApplicationStore.getSelectedOffice
    })

    const selectedDestination = computed(function () {
      return ApplicationStore.getSelectedDestination
    })

    const selectedNationality = computed(function () {
      return ApplicationStore.getSelectedNationality
    })

    const nationality = computed(function () {
      return ApplicationStore.getSelectedNationality
    })

    const countryId = computed(function () {
      return ApplicationStore.getCountryByIP
    })

    const selectedDateRange = computed(() => {
      return ApplicationStore.getSelectedDateRange
    })

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

    function updateDateHandler(date) {
      clearInvalidInputs()
      internSelectedDate.value = true
      if (date) {
        ApplicationStore.updateSelectedDate({
          from: date[0],
          to: date[1]
        })
      }
      if (!date) {
        ApplicationStore.updateSelectedDate(null)
      }

    }

    function selectOfficeHandler(selectedOffice) {
      clearInvalidInputs()
      internSelectedOffice.value = true
      const office = { ...selectedOffice }
      const availableDestinations = []
      const destinationsIds = selectedOffice.destinations
      const officeCode = countries.value.find(
        (x) => x.cid == selectedOffice.cid
      ).code
      if (officeCode) {
        office.code = officeCode
      }
      localStorage.setItem('office_id', office.id)
      ApplicationStore.updateSelectedOffice(office)
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
      clearInvalidInputs()
      internSelectedDestination.value = true
      ApplicationStore.updateSelectedDestination(destination)
    }

    function selectCountry(country) {
      clearInvalidInputs()
      internSelectedNationality.value = true
      ApplicationStore.updateSelectedNationality(country)
    }

    function clearInvalidInputs() {
      invalidOffices.value = false;
      invalidDestinations.value = false;
      invalidDate.value = false;
      invalidCountry.value = false;
    }

    async function showResultPageHandler() {
      if (!selectedOffice.value || !selectedDestination.value || !selectedDateRange.value || !selectedNationality.value) {
        if (!selectedOffice.value) {
          invalidOffices.value = true
        }
        if (!selectedDestination.value) {
          invalidDestinations.value = true
        }
        if (!selectedDateRange.value) {
          invalidDate.value = true
        }
        if (!selectedNationality.value) {
          invalidCountry.value = true
        }
        return false;
      }
      animation.value = true
      await ApplicationService.getMainServices(
        selectedDestination.value.code,
        selectedOffice.value.id,
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
        selectedDestination.value.code,
        selectedOffice.value.id
      )
        .then((response) => {
          if (response) {
            ServicesStore.updateSecondaryServices(response)
          }
        })
        .catch((error) => {
          ServicesStore.updateSecondaryServices([])
        })
        .finally(() => {
          animation.value = false
        })

      await router.push({ name: 'landing' })
    }

    return {
      offices,
      destinations,
      selectedOffice,
      selectedDestination,
      selectedDateRange,
      animation,
      countries,
      nationality,
      internSelectedNationality,
      internSelectedOffice,
      internSelectedDestination,
      internSelectedDate,
      invalidCountry,
      invalidOffices,
      invalidDestinations,
      invalidDate,
      selectCountry,
      showResultPageHandler,
      selectOfficeHandler,
      selectDestinationHandler,
      updateDateHandler
    }
  }
}
</script>

<style scoped></style>
