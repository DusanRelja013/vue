<template>
  <section
    v-if="exploreText.length > 0"
    id="explore"
    class="landing-explore"
    ref="explore"
  >
    <div class="explore-images">
      <img :src="covidImageOver" alt="" class="explore-images-under" />
      <img :src="covidImageUnder" alt="" class="explore-images-over" />
    </div>
    <div class="explore-content">
      <div class="content-header">
        <h2 class="header-title">
          Explore
          {{ selectedDestination?.name ? selectedDestination?.name : '' }}
        </h2>
      </div>
      <div class="content-description" v-html="exploreText"></div>
    </div>
  </section>
</template>

<script lang="ts">
import { useApplicationStore } from '@/stores/Application'
import { computed, ref, watch } from 'vue'
import { useDetailsStore } from '@/stores/Details'
import { useScrollStore } from '@/stores/Scroll'

export default {
  name: 'Explore',
  components: {},
  setup() {
    const ApplicationStore = useApplicationStore()
    const DetailsStore = useDetailsStore()
    const ScrollState = useScrollStore()
    const explore = ref()

    const selectedDestination: any = computed(() => {
      return ApplicationStore.getSelectedDestination
    })

    const scrollPosition = computed(() => {
      return ScrollState.getScrollPositionY
    })

    const exploreText = ref('')

    const covidImageOver: any = ref(null)
    const covidImageUnder: any = ref(null)

    const getImageUrl = function (code: any, path: any) {
      return new URL(
        `/img/destinations/${code}/${path}.jpg`,
        import.meta.env.VITE_API_BASE_URL
      ).href
    }

    const regions: any = computed(() => {
      return DetailsStore.getRegions
    })

    watch(
      selectedDestination,
      () => {
        const destinationCode = selectedDestination.value?.code3.toString()
        covidImageOver.value = getImageUrl(destinationCode, 'explore-d_m')
        covidImageUnder.value = getImageUrl(destinationCode, 'explore')

        if (regions.value && selectedDestination.value) {
          const activeDestination = regions.value.find(
            (region: any) =>
              region.name === selectedDestination.value.name && !region.country
          )
          if (activeDestination) {
            exploreText.value = activeDestination.description
          } else {
            exploreText.value = ''
          }
        }
      },
      { immediate: true }
    )

    watch(
      regions,
      () => {
        if (regions.value && selectedDestination.value) {
          const activeDestination = regions.value.find(
            (region: any) => region.country === selectedDestination.value.name
          )
          if (activeDestination) {
            exploreText.value = activeDestination.description
          }
        }
      },
      { immediate: true }
    )

    watch(scrollPosition, () => {
      if (explore.value) {
        const exploreView = explore.value.getBoundingClientRect()
        if (
            exploreView.top < 150 &&
            exploreView.bottom < exploreView.height + 100 &&
            exploreView.bottom > 130
        ) {
          ScrollState.updateActiveLandingTab('explore')
        }
      }
    })

    return {
      explore,
      exploreText,
      selectedDestination,
      covidImageUnder,
      covidImageOver
    }
  }
}
</script>

<style scoped></style>
