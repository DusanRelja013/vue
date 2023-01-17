<template>
  <section class="star-score">
    <div class="star-rating">
      <span :style="{ width: starScore + '%' }"></span>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'StarScore',
  props: {
    score: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const starScore = ref(0)

    starScore.value = (100 * props.score) / 5

    return { starScore }
  }
}
</script>
