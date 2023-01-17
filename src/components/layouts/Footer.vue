<template>
  <footer v-if="showFooter" class="app-footer">
    <div class="app-footer-image">
      <img :srcset="srcSet" alt="" class="app-footer-image__background" />
    </div>
    <div class="app-footer-prepare">
      <h1 class="app-footer-prepare--title">
        Planning your next trip? 7C makes it easy!
      </h1>
      <element-button
        :text="'Start preparing today'"
        @click="goToRequirementsHandler"
      />
    </div>
    <div class="app-footer-info">
      <p class="app-footer-info--description">
        For any further questions, please visit our FAQ or contact our customer
        support specialists.
      </p>
      <div class="app-footer-info__contact">
        <div class="info-item">
          <img
            src="@/assets/images/layouts/footer/email.svg"
            alt=""
            class="info-item__icon"
          />
          <a href="mailto:inonupdates@uk.evisaexpress.com" class="info-item__description"
            >inonupdates@uk.evisaexpress.com</a
          >
        </div>
      </div>
    </div>
    <div class="app-footer-links">
      <router-link :to="{ name: 'terms' }" target='_blank' class="link-item">Terms & Conditions</router-link>
      <a href="#" class="link-item">@{{ currentYear }} 7C</a>
    </div>
  </footer>
</template>

<script lang="ts">
import Button from '@/components/elements/Button.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Footer',
  components: {
    'element-button': Button
  },
  setup() {
    const route = useRoute()
    const showFooter = ref(true)
    const currentYear = new Date().getFullYear()

    const covidImageDesktop = new URL(
      `/img/static/footer-d.jpg`,
      import.meta.env.VITE_API_BASE_URL
    ).href
    const covidImageTablet = new URL(
      `/img/static/footer-t.jpg`,
        import.meta.env.VITE_API_BASE_URL,
    ).href
    const covidImageMobile = new URL(
      `/img/static/footer-m.jpg`,
        import.meta.env.VITE_API_BASE_URL,
    ).href

    const srcSet = ref(
      `${covidImageMobile} 768w, ${covidImageTablet} 1366w, ${covidImageDesktop}`
    )

    function goToRequirementsHandler() {
      const appId = document.getElementById('app')
      if (appId) {
        appId.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    watch(
      () => route.name,
      async (name) => {
        showFooter.value = true
      }
    )

    return {
      srcSet,
      showFooter,
      currentYear,
      goToRequirementsHandler
    }
  }
}
</script>

<style scoped></style>
