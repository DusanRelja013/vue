<template>
  <section class="mass-market-tooltip" @mouseleave="showContent = false">
    <img @mouseover="showContent = true" src="@/assets/images/elements/tooltip/info.svg" alt="" class="tooltip-icon">
    <div v-if="text && showContent" class="tooltip-context">
      <p class="tooltip-context-text" v-html="text"></p>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';
export default {
  name: "Tooltip",
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  setup() {
    const showContent = ref(false);

    return { showContent }
  }
}
</script>

<style scoped>

</style>
