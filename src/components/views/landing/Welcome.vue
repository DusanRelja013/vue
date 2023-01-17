<template>
  <section
    class="landing-welcome"
    :style="{
      backgroundImage:
        'linear-gradient(180deg, #000000 -8.86%, rgba(0, 0, 0, 0) 80.68%), url(' +
        imgUrl +
        ')'
    }"
  >
    <Widget />
    <h1 class="landing-welcome--title">
      {{ selectedDestination?.name ? selectedDestination?.name : '' }}
    </h1>
    <div class="trip-panel">
      <div class="panel-header">
        <p
          class="panel-header__status"
          :class="{
            restricted: authorisationStatus === 'restricted',
            allowed: authorisationStatus === 'allowed',
            forbidden: authorisationStatus === 'forbidden'
          }"
        >
          {{ authorisationStatus }}
        </p>
        <h4 class="panel-header__title">
          Travel to {{ selectedDestination?.name }} is
          {{ restrictionDetails?.authorization_status }} from
          {{ selectedOffice?.name }}.
        </h4>
        <a href="#" class="panel-header__link" @click="learnMoreHandler"
          >Learn more</a
        >
      </div>
      <div class="panel-body">
        <img
          v-if="visaDetails?.VisaRequired"
          src="@/assets/images/views/landing/welcome/checked.svg"
          alt=""
          class="panel-body__status"
        />
        <img
          v-if="!visaDetails?.VisaRequired"
          src="@/assets/images/views/landing/welcome/checked-allowed.svg"
          alt=""
          class="panel-body__status"
        />
        <p class="panel-body__description">
          Travel visa is
          {{ visaDetails?.VisaRequired ? 'required' : 'not required' }} for {{ selectedNationality?.name }}
          passport holder
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { useApplicationStore } from '@/stores/Application'
import {computed, watch, ref, onMounted, onUnmounted} from 'vue'
import Widget from '@/components/shared/Widget.vue'
import { useModalsStore } from '@/stores/Modals'
import { useDetailsStore } from '../../../stores/Details'

export default {
  name: 'Welcome',
  components: {
    Widget
  },
  setup() {
    const ApplicationStore = useApplicationStore()
    const ModalsStore = useModalsStore()
    const DetailsStore = useDetailsStore()
    const visaDetails = ref(null)

    const restrictionDetails = computed(() => {
      return DetailsStore.getRestrictionDetails
    })

    const authorisationStatus = computed(() => {
      return DetailsStore.getAuthorisationStatus
    })

    const selectedDestination = computed(() => {
      return ApplicationStore.getSelectedDestination
    })

    const selectedOffice = computed(() => {
      return ApplicationStore.getSelectedOffice
    })

    const selectedNationality = computed(() => {
      return ApplicationStore.getSelectedNationality
    })

    const visaRequired = computed(() => {
      return DetailsStore.getVisaRequired
    })

    const imgUrl = ref(null)

    const getImageUrl = function (code) {
      let imageName = 'cover-d'
      const windowWidth = window.innerWidth
      if (windowWidth <= 1366) {
        imageName = 'cover-t'
      }
      if (windowWidth <= 768) {
        imageName = 'cover-m'
      }
      return new URL(
        `/img/destinations/${code}/${imageName}.jpg`,
          import.meta.env.VITE_API_BASE_URL,
      ).href
    }

    function learnMoreHandler() {
      ModalsStore.updateModal('TravelRequirements', {
        status: restrictionDetails.value.authorization_status,
        details: restrictionDetails.value.details,
        summary: restrictionDetails.value.summary
      })
    }

    watch(
      selectedDestination,
      () => {
        const destinationCode = selectedDestination.value?.code3.toString()
        imgUrl.value = getImageUrl(destinationCode)
        if (visaRequired.value) {
          const isVisaExist = visaRequired.value.find(
            (visa) => visa.Iso == destinationCode
          )
          if (isVisaExist) {
            visaDetails.value = isVisaExist
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
            (visa) => visa.Iso == destinationCode
          )
          if (visa) {
            visaDetails.value = { ...visa }
          }
        }
      },
      { immediate: true }
    )

    // onMounted(() => {
    //   document.addEventListener(
    //     'resize',
    //     getImageUrl(selectedDestination.value?.code3.toString())
    //   )
    // })
    //
    // onUnmounted(() => {
    //   document.removeEventListener(
    //     'resize',
    //     getImageUrl(selectedDestination.value?.code3.toString())
    //   )
    // })

    return {
      imgUrl,
      visaDetails,
      selectedDestination,
      selectedOffice,
      restrictionDetails,
      learnMoreHandler,
      authorisationStatus,
      selectedNationality
    }
  }
}
</script>

<style scoped></style>
