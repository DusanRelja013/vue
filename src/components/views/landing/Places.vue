<template>
  <section
    v-if="placeCards.length > 0"
    id="places"
    class="landing-places"
    ref="places"
  >
    <h1 class="places__title">
      Places in {{ selectedDestination?.name ? selectedDestination?.name : '' }}
    </h1>
    <div class="info-card-wrapper">
      <div v-for="(place, index) in placeCards" class="info-card" :key="index">
        <img
          :src="place.cc_photo[0].cc_photo"
          alt=""
          class="info-card__image"
        />
        <div class="info-card__data">
          <p v-if="place.profile_tags" class="card-info">
            <span v-for="(tag, i) in place.profile_tags" :key="i"
              >{{ tag.name
              }}<span v-if="i < place.profile_tags.length - 1">, </span></span
            >
          </p>
          <p class="card-title">{{ place.name }}</p>
          <h4
            class="card-text"
            v-html="place.description"
            :class="{ 'card-text__clamp': index + 1 !== descriptionActive }"
          ></h4>
          <a
            v-if="index + 1 !== descriptionActive && place.description"
            href="#"
            class="card-link"
            @click="toggleDescriptionHandler(index + 1)"
            >Read more</a
          >
          <a
            v-if="index + 1 === descriptionActive"
            href="#"
            class="card-link"
            @click="toggleDescriptionHandler(0)"
            >Read less</a
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed, watch, ref } from 'vue'
import { useApplicationStore } from '@/stores/Application'
import { useDetailsStore } from '../../../stores/Details'
import { useScrollStore } from '../../../stores/Scroll'

export default {
  name: 'Places',
  setup() {
    const ApplicationStore = useApplicationStore()
    const DetailsStore = useDetailsStore()
    const ScrollState = useScrollStore()
    const placeCards = ref([])
    const descriptionToggle = ref(false)
    const descriptionActive = ref(0)
    const places = ref()

    const selectedDestination = computed(() => {
      return ApplicationStore.getSelectedDestination
    })

    const regions = computed(() => {
      return DetailsStore.getRegions
    })

    const scrollPosition = computed(() => {
      return ScrollState.getScrollPositionY
    })

    function toggleDescriptionHandler(place) {
      descriptionActive.value = place
      descriptionToggle.value = !descriptionToggle.value
    }

    watch(regions, () => {
      if (regions.value && selectedDestination.value) {
        const filteredArray = regions.value.filter(
          (region) => region.country === selectedDestination.value.name
        )
        if (filteredArray.length) {
          placeCards.value = filteredArray
        }
      }
    })

    watch(selectedDestination, () => {
      if (regions.value && selectedDestination.value) {
        const filteredArray = regions.value.filter(
          (region) => region.country === selectedDestination.value.name
        )
        if (filteredArray.length) {
          placeCards.value = filteredArray
        } else {
          placeCards.value = []
        }
      }
    })

    watch(scrollPosition, () => {
      if (places.value) {
        const placesView = places.value.getBoundingClientRect()
        if (
          placesView.top < 150 &&
          placesView.bottom < placesView.height + 100 &&
          placesView.bottom > 130
        ) {
          ScrollState.updateActiveLandingTab('places')
        }
      }
    })

    return {
      places,
      descriptionToggle,
      placeCards,
      selectedDestination,
      descriptionActive,
      toggleDescriptionHandler
    }
  }
}
</script>

<style scoped></style>
