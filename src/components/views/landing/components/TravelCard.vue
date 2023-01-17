<template>
  <section class="travel-card">
    <img
      v-if="mainService"
      src="@/assets/images/views/landing/travel-card/service.png"
      alt=""
      class="travel-card__image"
    />
    <img
      v-if="!mainService && service.image"
      :src="service.image"
      alt=""
      class="travel-card__image"
    />
    <img
      v-if="!mainService && !service.image"
      src="@/assets/images/views/landing/travel-card/no-image.png"
      alt=""
      class="travel-card__image"
    />
    <div class="travel-card__content">
      <h2 class="content-title">
        {{ service?.Name ? service.Name : service.name }}
      </h2>
      <div class="content-text">
        <p v-if="mainService" class="content-text__description">
          {{ service?.Description ? service?.Description : '' }}
        </p>
        <p
          v-if="!mainService"
          class="content-text__description"
          :class="{ 'content-text__clamp': !descriptionToggle }"
        >
          {{ service?.description ? service?.description : '' }}
        </p>
        <a
          v-if="!mainService && !descriptionToggle"
          href="#"
          class="content-text__link"
          @click="toggleDescriptionHandler"
          >Learn more</a
        >
        <a
          v-if="!mainService && descriptionToggle"
          href="#"
          class="content-text__link"
          @click="toggleDescriptionHandler"
          >Learn less</a
        >
      </div>
      <div class="content-footer">
        <div class="card-price">
          <p v-if="service?.TotalFeeWithVAT" class="card-price-title">from per</p>
          <h2 class="card-price-value">
            {{
              service?.CurrencyCode
                ? service.CurrencyCode
                : service.currencyCode
            }}
            {{
              service?.TotalFeeWithVAT
                ? service?.TotalFeeWithVAT * quantityItem
                : service?.totalAmountWithTax * quantityItem
            }}
          </h2>
        </div>
        <div class="card-quantity">
          <h4 class="card-quantity-title">Quantity</h4>
          <Quantity
              :value="quantityItem"
              @valueHandler="updateQuantityHandler($event)"
          />
        </div>
        <div class="card-actions">
          <element-button
            :modifiers="['important']"
            :icon="'shopping-cart'"
            :text="'Add to cart'"
            @click="addToCartHandler"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useModalsStore } from '@/stores/Modals'
import { useCartStore } from '@/stores/Cart'
import Button from '@/components/elements/Button.vue'
import { useApplicationStore } from '@/stores/Application'
import { computed, ref } from 'vue'
import { useServicesStore } from '@/stores/Services'
import Quantity from "@/components/shared/Quantity.vue";

export default {
  name: 'TravelCard',
  props: {
    service: {
      type: Object,
      default: null,
      required: true
    },
    mainService: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'element-button': Button,
    Quantity,
  },
  setup(props) {
    const ServicesStore = useServicesStore()
    const ModalsStore = useModalsStore()
    const CartStore = useCartStore()
    const ApplicationStore = useApplicationStore()
    const descriptionToggle = ref(false)
    const quantityItem = ref(1)

    const selectedOffice = computed(function () {
      return ApplicationStore.getSelectedOffice
    })

    const selectedDestination = computed(() => {
      return ApplicationStore.getSelectedDestination
    })

    const selectedDateRange = computed(function () {
      return ApplicationStore.getSelectedDateRange
    })

    const mainServices = computed(() => {
      return ServicesStore.getServices
    })

    function formatDate(date) {
      return (
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : '0' + (date.getMonth() + 1)) +
        '/' +
        (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
        '/' +
        date.getFullYear()
      )
    }

    function addToCartHandler() {
      const entryDate = formatDate(selectedDateRange.value.from)
      const exitDate = formatDate(selectedDateRange.value.to)
      const cardInfo = []
      if (props.mainService) {
        for (let i = 0; i < mainServices.value.length; i++) {
          const card = mainServices.value[i]
          card.EntryDate = entryDate
          card.ExitDate = exitDate
          card.Quantity = quantityItem.value
          cardInfo.push(card)
        }
        ModalsStore.updateModal('TravelData', {
          cardInfo
        })
        return
      }
      const secondaryServiceCard = { ...props.service }
      secondaryServiceCard.entryDate = entryDate
      secondaryServiceCard.exitDate = exitDate
      secondaryServiceCard.destination = selectedDestination.value.cid
      secondaryServiceCard.quantity = quantityItem.value
      CartStore.addCartItem(secondaryServiceCard, selectedOffice.value?.id)
      updateQuantityHandler(1);
    }

    function toggleDescriptionHandler() {
      descriptionToggle.value = !descriptionToggle.value
    }

    function updateQuantityHandler(quantity) {
      quantityItem.value = quantity
    }

    return {
      descriptionToggle,
      quantityItem,
      addToCartHandler,
      toggleDescriptionHandler,
      updateQuantityHandler
    }
  }
}
</script>

<style scoped></style>
