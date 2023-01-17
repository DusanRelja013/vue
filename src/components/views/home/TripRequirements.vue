<template>
  <section
    class="home-trip-requirements"
    :style="{
      backgroundImage:
        'linear-gradient(180deg, #000000 -8.86%, rgba(0, 0, 0, 0) 80.68%), url(' +
        imgUrl +
        ')'
    }">
    <h1 class="trip-title">The travel solution for today’s world.</h1>
    <p class="trip-description">
      From obtaining visas to understanding the latest travel restrictions, 7C helps you prepare for a seamless journey—wherever you’re headed.
    </p>
    <div class="home-trip-requirements__wrapper">
      <RequirementsCard  />
    </div>
  </section>
</template>

<script>
import RequirementsCard from "@/components/views/home/components/RequirementsCard.vue";
import { ref, onMounted } from "vue";

export default {
  name: 'TripRequirements',
  components: {
    RequirementsCard
  },
  setup: function () {
    const imgUrl = ref(null)

    function getImageUrl() {
      let imageName = ''
      const windowWidth = window.innerWidth
      if (windowWidth <= 1366 && windowWidth > 768) {
        imageName = 'hp-t'
      }
      if (windowWidth <= 768) {
        imageName = 'hp-m'
      }
      if (windowWidth > 1366) {
        imageName = 'hp-d'
      }
      const hpBackground = new URL(
        `/img/static/${imageName}.jpg`,
        import.meta.env.VITE_API_BASE_URL
      ).href
      return hpBackground
    }

    window.addEventListener('resize', getImageUrl)

    onMounted(() => {
      imgUrl.value = getImageUrl()
    })

    return {
      imgUrl
    }
  }
}
</script>

<style scoped>

</style>