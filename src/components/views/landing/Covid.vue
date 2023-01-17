<template>
  <section id="covid" class="landing-covid" ref="covid">
    <div class="covid-situation-wrapper">
      <div class="covid-image">
        <img alt="" class="image" :srcset="srcSetBackground" />
      </div>
      <div class="covid-situation">
        <h1 class="covid-situation-title">Covid-19 Situation</h1>
        <p class="covid-situation-description">
          As the Covid-19 pandemic continues to change and develop globally, we
          continually review the guidance from the World Health Organization
          (WHO) and the entry requirements of the
          {{ selectedDestination?.name ? selectedDestination?.name : '' }}
          government.
        </p>
      </div>
    </div>
    <div class="covid-info">
      <div class="covid-info-facts">
        <template v-if="localSummary && localSummary.guidelines">
          <TravelFact
            v-for="(summary, index) in localSummary.guidelines"
            :key="index"
            :index="index + 1"
            :active-item="activeFact"
            :icon="summary.category?.id"
            :title="summary.category?.name"
            :summary="summary.summary"
            :description="summary.details"
            @handleValue="updateFactHandler"
          />
        </template>
      </div>
      <div class="covid-info-images">
        <img :src="covidImageUnder" alt="" class="covid-info-images__under" />
        <img :src="covidImageOver" alt="" class="covid-info-images__over" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
import TravelFact from '@/components/views/landing/components/TravelFact.vue'
import { computed } from 'vue'
import { useApplicationStore } from '@/stores/Application'
import { useDetailsStore } from '@/stores/Details'
import { useScrollStore } from '@/stores/Scroll'

export default {
  name: 'Covid',
  components: {
    TravelFact
  },
  setup() {
    const ApplicationStore = useApplicationStore()
    const DetailsStore = useDetailsStore()
    const ScrollState = useScrollStore()
    const activeFact = ref(0)
    const covid = ref()

    const localSummary: any = computed(() => {
      return DetailsStore.getLocalSummary
    })
    const covidImageDesktop = new URL(
      `/img/static/covid-d.jpg`,
      import.meta.env.VITE_API_BASE_URL
    ).href
    const covidImageTablet = new URL(
      `/img/static/covid-t.jpg`,
      import.meta.env.VITE_API_BASE_URL
    ).href
    const covidImageMobile = new URL(
      `/img/static/covid-m.jpg`,
      import.meta.env.VITE_API_BASE_URL
    ).href

    const srcSetBackground = ref(
      `${covidImageMobile} 768w, ${covidImageTablet} 1366w, ${covidImageDesktop}`
    )

    const covidImageOver: any = ref(null)
    const covidImageUnder: any = ref(null)

    const getImageUrl = function (code: any, path: any) {
      return new URL(
        `/img/destinations/${code}/${path}.jpg`,
        import.meta.env.VITE_API_BASE_URL
      ).href
    }

    const selectedDestination: any = computed(function () {
      return ApplicationStore.getSelectedDestination
    })

    const scrollPosition = computed(() => {
      return ScrollState.getScrollPositionY
    })

    function updateFactHandler(value: number) {
      activeFact.value = value
    }

    watch(
      selectedDestination,
      () => {
        const destinationCode = selectedDestination.value?.code3.toString()
        covidImageOver.value = getImageUrl(destinationCode, 'covid_front-d')
        covidImageUnder.value = getImageUrl(destinationCode, 'covid_back-d')
      },
      { immediate: true }
    )

    watch(scrollPosition, () => {
      if (covid.value) {
        const covidView = covid.value.getBoundingClientRect()
        if (
          covidView.top < 150 &&
          covidView.bottom < covidView.height + 100 &&
          covidView.bottom > 130
        ) {
          ScrollState.updateActiveLandingTab('covid')
        }
      }
    })

    return {
      covid,
      covidImageOver,
      covidImageUnder,
      srcSetBackground,
      selectedDestination,
      localSummary,
      activeFact,
      updateFactHandler
    }
  }
}
</script>

<style scoped></style>
