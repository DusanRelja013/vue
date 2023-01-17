<template>
  <section id="travel-tips" class="landing-travel-tips" ref="travelTips">
    <h4 class="landing-travel-tips__title">Travel tips</h4>
    <div class="travel-tips-content">
      <div class="travel-tips-images">
        <img :srcset="imgUrl" alt="" class="image" />
      </div>
      <div class="travel-tips-items">
        <div class="travel-tips-item">
          <div class="item-header">
            <img
              src="@/assets/images/views/landing/travel-tips/search-favorite.svg"
              alt=""
              class="travel-tips-item__icon"
            />
            <h2 class="travel-tips-item__title">Do your research</h2>
          </div>
          <p class="travel-tips-item__description">
            You don’t have to become an expert in your intended destination, but
            researching certain basics in advance will lead to a more enjoyable
            journey. Looking up things like the weather forecast and outlet
            types will help you know what to pack. And reading up on local
            customs and tipping etiquette will help you feel more at home. As
            for visas and entry requirements, leave that to us!
          </p>
        </div>
        <div class="travel-tips-item">
          <div class="item-header">
            <img
              src="@/assets/images/views/landing/travel-tips/brifecase-tick.svg"
              alt=""
              class="travel-tips-item__icon"
            />
            <h2 class="travel-tips-item__title">Pack accordingly</h2>
          </div>
          <p class="travel-tips-item__description">
            Every locale has its specific type of packing list, but there are
            some general guidelines you can follow wherever you’re headed
            <br />-Pre-plan outfits and make sure you can mix and match
            separates to maximize your options. <br />-Roll your clothes to help
            prevent wrinkles. <br />-Utilize packing cubes to stay organized and
            save space.
          </p>
        </div>
        <div class="travel-tips-item">
          <div class="item-header">
            <img
              src="@/assets/images/views/landing/travel-tips/book.svg"
              alt=""
              class="travel-tips-item__icon"
            />
            <h2 class="travel-tips-item__title">Learn common phrases</h2>
          </div>
          <p class="travel-tips-item__description">
            Good manners go a long way, no matter where you are in the world.
            Learning words and phrases like “please,” “thank you,” and “excuse
            me” in the local language will make for more pleasant interactions.
            Take it a step further with words for how to get around and how to
            order at restaurants.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useApplicationStore } from '@/stores/Application'
import { useScrollStore } from '../../../stores/Scroll'

export default {
  name: 'TravelTips',
  setup() {
    const travelTips = ref()
    const ScrollState = useScrollStore()
    const imgUrl = ref(null)
    const ApplicationStore = useApplicationStore()
    const selectedDestination = computed(() => {
      return ApplicationStore.getSelectedDestination
    })

    const scrollPosition = computed(() => {
      return ScrollState.getScrollPositionY
    })

    const getImageUrl = function (code) {
      const travelTipsDesktop = new URL(
        `/img/destinations/${code}/travel_tips-d.jpg`,
        import.meta.env.VITE_API_BASE_URL
      ).href
      const travelTipsTablet = new URL(
        `/img/destinations/${code}/travel_tips-t.jpg`,
        import.meta.env.VITE_API_BASE_URL
      ).href
      const travelTipsMobile = new URL(
        `/img/destinations/${code}/travel_tips-m.jpg`,
        import.meta.env.VITE_API_BASE_URL
      ).href
      const srcSet = ref(
        `${travelTipsMobile} 768w, ${travelTipsTablet} 1366w, ${travelTipsDesktop}`
      )

      return srcSet.value
    }

    watch(
      selectedDestination,
      () => {
        const destinationCode = selectedDestination.value?.code3.toString()
        imgUrl.value = getImageUrl(destinationCode)
      },
      { immediate: true }
    )

    watch(scrollPosition, () => {
      if (travelTips.value) {
        const tipsView = travelTips.value.getBoundingClientRect()
        if (
          tipsView.top < 150 &&
          tipsView.bottom < tipsView.height + 100 &&
          tipsView.bottom > 130
        ) {
          ScrollState.updateActiveLandingTab('travel-tips')
        }
      }
    })

    return { travelTips, imgUrl }
  }
}
</script>

<style scoped></style>
