<template>
  <section class="home-how-it-works">
    <div class="journey">
      <h1 class="journey-title">How it Works</h1>
      <p class="journey-description">
        Travel with peace of mind knowing we’re here to help with 24/7 support
        regarding all your trip requirements.
      </p>
      <img alt="" class="journey-image" :srcset="srcSetBackground" />
    </div>
    <div class="steps">
      <div class="step">
        <div class="step-header">
          <div class="header-number">1</div>
          <h2 class="header-title">
            Understand the travel requirements for your upcoming trip.
          </h2>
        </div>
        <div class="step-content">
          <p class="content-text">
            Easily search our database of current visa requirements and travel restrictions for your chosen destination.
          </p>
        </div>
      </div>
      <div class="step">
        <div class="step-header">
          <div class="header-number">2</div>
          <h2 class="header-title">
            Obtain all your necessary travel documents.
          </h2>
        </div>
        <div class="step-content">
          <p class="content-text">
            Let us handle the hard part! We’ll use our extensive global resources to apply for and secure all the important paperwork.
          </p>
        </div>
      </div>
      <div class="step">
        <div class="step-header">
          <div class="header-number">3</div>
          <h2 class="header-title">
            Stay up to date
          </h2>
        </div>
        <div class="step-content">
          <p class="content-text">
            Once you’ve completed your order, log in to your personalized calendar to easily access and organize all the details of your trip
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'HowItWorks',
  setup() {
    const journeyDesktop = new URL(
      `/img/static/how_it_works-d.jpg`,
        import.meta.env.VITE_API_BASE_URL,
    ).href

    const journeyTablet = new URL(
      `/img/static/how_it_works-t.jpg`,
        import.meta.env.VITE_API_BASE_URL,
    ).href
    const journeyMobile = new URL(
      `/img/static/how_it_works-m.jpg`,
        import.meta.env.VITE_API_BASE_URL,
    ).href

    const srcSetBackground = ref(
      `${journeyMobile} 760w, ${journeyTablet} 1366w, ${journeyDesktop}`
    )

    return { srcSetBackground }
  }
}
</script>

<style scoped></style>
