<template>
  <section class="travel-fact" @click="toggleFactHandler">
    <div class="travel-fact__header">
      <img
        :src="imageUrl"
        alt=""
        class="fact-icon"
      />
      <h4 class="fact-title">{{ title }}</h4>
      <img
        :class="{ 'toggle-active': cardExpanded }"
        src="@/assets/images/shared/arrow-down.svg"
        alt=""
        class="fact-toggle"
        @click="toggleFactHandler"
      />
    </div>
    <div class="travel-fact__body">
      <div class="fact-content" :class="{ 'cropped': !cardExpanded }">
        {{ summary }}
        {{ description }}
      </div>
    </div>
  </section>
</template>

<script>
import {ref, watch} from "vue";

export default {
  name: 'TravelFact',
  props: {
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'other_medical_measures'
    },
    description: {
      type: String,
      default: ''
    },
    summary: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    },
    activeItem: {
      type: Number,
      default: 0
    }
  },
  setup(props, context) {
    const cardExpanded = ref(false)
    const imageUrl = new URL(
      `/src/assets/images/views/landing/travel-facts/${props.icon}.svg`,
      import.meta.url
    )

    function toggleFactHandler() {
      if (props.activeItem == props.index && cardExpanded.value === true) {
        context.emit('handleValue', 0)
        return
      }
      context.emit('handleValue', props.index)
    }

    watch(() => props.activeItem, () => {
        cardExpanded.value = props.index === props.activeItem
      },
      { immediate: true }
    )

    return { toggleFactHandler, imageUrl, cardExpanded }
  }
}
</script>

<style scoped>

</style>