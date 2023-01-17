<template>
  <section
    id="info-nav"
    class="landing-information"
    :class="{ 'information-fixed': fixedHeader }"
  >
    <nav class="info-nav">
      <div
        class="info-nav-item"
        :class="{ active: activeTab === 'travel-requirements' }"
        @click="activeTabHandler('travel-requirements')"
      >
        <img
          v-if="activeTab === 'travel-requirements'"
          src="@/assets/images/views/landing/information/airplane-active.svg"
          alt="travel requirements"
          class="item-icon"
        />
        <img
          v-if="activeTab !== 'travel-requirements'"
          src="@/assets/images/views/landing/information/airplane.svg"
          alt="travel requirements"
          class="item-icon"
        />
        <h4 class="item-title">Travel requirements</h4>
      </div>
      <div
        v-if="countryExist"
        class="info-nav-item"
        :class="{ active: activeTab === 'explore' }"
        @click="activeTabHandler('explore')"
      >
        <img
          v-if="activeTab !== 'explore'"
          src="@/assets/images/views/landing/information/global-search.svg"
          alt="Explore destination"
          class="item-icon"
        />
        <img
          v-if="activeTab === 'explore'"
          src="@/assets/images/views/landing/information/global-search-active.svg"
          alt="Explore destination"
          class="item-icon"
        />
        <h4 class="item-title">Explore destination</h4>
      </div>
      <div
        class="info-nav-item"
        :class="{ active: activeTab === 'covid' }"
        @click="activeTabHandler('covid')"
      >
        <img
          v-if="activeTab === 'covid'"
          src="@/assets/images/views/landing/information/covid-active.svg"
          alt="Covid"
          class="item-icon"
        />
        <img
          v-if="activeTab !== 'covid'"
          src="@/assets/images/views/landing/information/covid.svg"
          alt="Covid"
          class="item-icon"
        />
        <h4 class="item-title">Covid 19 guidelines</h4>
      </div>
      <div
        v-if="countryExist"
        class="info-nav-item"
        :class="{ active: activeTab === 'places' }"
        @click="activeTabHandler('places')"
      >
        <img
          v-if="activeTab === 'places'"
          src="@/assets/images/views/landing/information/places-active.svg"
          alt="Places"
          class="item-icon"
        />
        <img
          v-if="activeTab !== 'places'"
          src="@/assets/images/views/landing/information/places.svg"
          alt="Places"
          class="item-icon"
        />
        <h4 class="item-title">Places</h4>
      </div>
      <div
        class="info-nav-item"
        :class="{ active: activeTab === 'travel-tips' }"
        @click="activeTabHandler('travel-tips')"
      >
        <img
          v-if="activeTab !== 'travel-tips'"
          src="@/assets/images/views/landing/information/travel-tips.svg"
          alt="Travel tips"
          class="item-icon"
        />
        <img
          v-if="activeTab === 'travel-tips'"
          src="@/assets/images/views/landing/information/travel-tips-active.svg"
          alt="Travel tips"
          class="item-icon"
        />
        <h4 class="item-title">Travel tips</h4>
      </div>
    </nav>
    <div class="info-wrapper">
      <TravelRequirements />
    </div>
  </section>
</template>

<script>
import { ref, watch, computed } from 'vue'
import TravelRequirements from '@/components/views/landing/TravelRequirements.vue'
import { useScrollStore } from '../../../stores/Scroll'
import { useApplicationStore } from '../../../stores/Application'
import { useDetailsStore } from '../../../stores/Details'

export default {
  name: 'Information',
  components: {
    TravelRequirements
  },
  setup() {
    const activeTab = ref('travel-requirements')
    const ScrollState = useScrollStore()
    const ApplicationStore = useApplicationStore()
    const fixedHeader = ref(false)
    const DetailsStore = useDetailsStore()
    const countryExist = ref(false)

    const scrollPosition = computed(() => {
      return ScrollState.getScrollPositionY
    })

    const activeItem = computed(() => {
      return ScrollState.getActiveLandingTab
    })

    const selectedDestination = computed(() => {
      return ApplicationStore.getSelectedDestination
    })

    const regions = computed(() => {
      return DetailsStore.getRegions
    })

    function activeTabHandler(tab) {
      const appId = document.getElementById('app')
      const id = document.getElementById(tab)
      appId.scrollTo({
        top: id.offsetTop,
        left: 0,
        behavior: 'smooth'
      })
    }

    watch(scrollPosition, () => {
      const header = document.getElementById('app-header')
      const navigation = document.getElementById('info-nav')
      if (header) {
        if (header.offsetHeight >= navigation.getBoundingClientRect().top) {
          fixedHeader.value = true
        } else {
          fixedHeader.value = false
        }
      }
    })

    watch(
      selectedDestination,
      () => {
        if (regions.value && selectedDestination.value) {
          const filteredArray = regions.value.filter(
            (region) => region.country === selectedDestination.value.name
          )
          countryExist.value = !!filteredArray.length
        }
      },
      { immediate: true }
    )

    watch(activeItem, () => {
      activeTab.value = activeItem.value
    })

    return {
      activeTab,
      fixedHeader,
      countryExist,
      activeTabHandler
    }
  }
}
</script>

<style scoped></style>
