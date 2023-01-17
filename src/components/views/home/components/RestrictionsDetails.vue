<template>
  <section class="restriction-details">
    <div class="details-header">
      <div class="header-top">
        <h4
          v-if="!fullVaccinated"
          class="header-top-status"
          :class="{
            allowed: details.authorization_status === 'allowed',
            restricted: details.authorization_status === 'restricted',
            unknown: details.authorization_status === 'unknown',
            forbidden: details.authorization_status === 'forbidden'
          }"
        >
          {{ details.authorization_status }}
        </h4>
        <h4
          v-if="fullVaccinated"
          class="header-top-status"
          :class="{
            allowed: details.authorization_status === 'allowed' ||  details.authorization_status === 'restricted',
            forbidden: details.authorization_status === 'forbidden',
             unknown: details.authorization_status === 'unknown'
          }"
        >
          <span v-if="details.authorization_status === 'allowed' || details.authorization_status === 'restricted'">allowed</span>
          <span v-if="details.authorization_status === 'forbidden'">forbidden</span>
          <span v-if="details.authorization_status === 'unknown'">unknown</span>
        </h4>
        <img
          src="@/assets/images/shared/close.svg"
          alt="Close"
          class="header-top-close"
          @click="closeModalHandler"
        />
      </div>
      <div class="header-title">
        <h2 class="header-title-item">{{ details.origin }}</h2>
        <img
          src="@/assets/images/views/home/map/arrow-right.svg"
          alt="arrow"
          class="header-title-icon"
        />
        <h2 class="header-title-item">{{ details.destinationName }}</h2>
      </div>
    </div>
    <div class="details-content">
      <p class="content-summary">
        {{ details.summary }}
      </p>
      <div v-if="details.vaccination" class="content-item">
        <div class="content-item-header">
          <img
            src="@/assets/images/views/home/map/heart-add.svg"
            alt=""
            class="item-icon"
          />
          <h4 class="item-title">{{ details.vaccination }}</h4>
        </div>
        <p class="content-item-description">
          {{ details.vaccination_summary }}
        </p>
      </div>
      <div v-if="details.quarantine_required" class="content-item">
        <div class="content-item-header">
          <img
            src="@/assets/images/views/home/map/home-2.svg"
            alt=""
            class="item-icon"
          />
          <h4 class="item-title">{{ details.quarantine_required }}</h4>
        </div>
        <p class="content-item-description">
          {{ details.quarantine_required_summary }}
        </p>
      </div>
      <div v-if="details.test_medical_certificate" class="content-item">
        <div class="content-item-header">
          <img
            src="@/assets/images/views/home/map/receipt-item.svg"
            alt=""
            class="item-icon"
          />
          <h4 class="item-title">{{ details.test_medical_certificate }}</h4>
        </div>
        <p class="content-item-description">
          {{ details.test_medical_certificate_summary }}
        </p>
      </div>
      <div v-if="details.testing_on_arrival" class="content-item">
        <div class="content-item-header">
          <img
            src="@/assets/images/views/home/map/arival.svg"
            alt=""
            class="item-icon"
          />
          <h4 class="item-title">{{ details.testing_on_arrival }}</h4>
        </div>
        <p class="content-item-description">
          {{ details.testing_on_arrival_summary }}
        </p>
      </div>
      <div v-if="details.other_medical_measue" class="content-item">
        <div class="content-item-header">
          <img
            src="@/assets/images/views/home/map/heart-add.svg"
            alt=""
            class="item-icon"
          />
          <h4 class="item-title">{{ details.other_medical_measue }}</h4>
        </div>
        <p class="content-item-description">
          {{ details.other_medical_measue_summary }}
        </p>
      </div>
      <div v-if="details.additional_documentation" class="content-item">
        <div class="content-item-header">
          <img
            src="@/assets/images/views/home/map/archive-tick.svg"
            alt=""
            class="item-icon"
          />
          <h4 class="item-title">{{ details.additional_documentation }}</h4>
        </div>
        <p class="content-item-description">
          {{ details.additional_documentation_summary }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RestrictionsDetails',
  props: {
    details: {
      type: Object,
      default: null
    },
    fullVaccinated: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    function closeModalHandler() {
      context.emit('close', true)
    }

    return { closeModalHandler }
  }
}
</script>

<style scoped></style>
