<template>
  <section class="chart-page">
    <div class="chart-content">
      <div class="ordered-cards__wrapper">
        <div class="chart-page-back">
          <img
            src="@/assets/images/shared/home-icon.svg"
            alt="Home"
            class="home"
            @click="goToHomeHandler"
          />
          <img
            src="@/assets/images/shared/arrow-right.svg"
            alt="Back"
            class="back-icon"
          />
          <h2 class="back-title back-title--blue" @click="goBackHandler">
            Destination
          </h2>
          <img
            src="@/assets/images/shared/arrow-right.svg"
            alt="Back"
            class="back-icon"
          />
          <h2 class="back-title">My cart</h2>
        </div>
        <div class="ordered-cards">
          <div
            v-for="(cart, index) in cartItems"
            class="ordered-cart"
            :key="index"
          >
            <img
              v-if="cart.RunwayId"
              src="@/assets/images/views/landing/travel-card/service.png"
              alt="service"
              class="ordered-cart__profile"
            />
            <img
              v-if="!cart.RunwayId && cart.image"
              :src="cart.image"
              alt="service"
              class="ordered-cart__profile"
            />
            <img
              v-if="!cart.RunwayId && !cart.image"
              src="@/assets/images/views/landing/travel-card/no-image.png"
              alt="service"
              class="ordered-cart__profile"
            />
            <div class="ordered-cart__content">
              <div class="cart-header">
                <div class="cart-info">
                  <h2 class="cart-info__title">
                    {{ cart.RunwayId ? 'Travel Visa' : cart.name }}
                  </h2>
                  <h2 v-if="cart.RunwayId" class="cart-info__destination">
                    {{ getDestinationName(cart) }}
                  </h2>
                </div>
                <div class="cart-actions">
                  <element-button
                    v-if="false"
                    class="cart-actions__icon"
                    :icon="'edit'"
                    @click="editCartHandler(cart)"
                  />
                  <element-button
                    class="cart-actions__icon"
                    :icon="'delete'"
                    @click="deleteCartHandler(cart)"
                  />
                </div>
              </div>
              <div v-if="cart.RunwayId" class="cart-description">
                <p class="cart-description__item">
                  Nationality - {{ getNationalityName(cart) }}
                </p>
                <p class="cart-description__item">{{ cart.Name }}</p>
                <p class="cart-description__item">{{ cart.EntryName }}</p>
                <p class="cart-description__item">
                  {{ cart.ProcessingSpeedDesc }}
                </p>
              </div>
              <div class="cart-price">
                <Quantity
                  :value="cart.RunwayId ? cart.Quantity : cart.quantity"
                  @valueHandler="updateCartHandler($event, cart)"
                />
                <h2 class="cart-price__title">
                  {{ cart.RunwayId ? cart.Currency : cart.currency }}
                  {{ getCartPrice(cart) }}
                </h2>
              </div>
            </div>
          </div>
          <section v-if="!cartItems.length" class="empty-cards">
            <h2 class="empty-cards__title">No items in cart</h2>
            <p class="empty-cards__description">Add products you need for your next destination in the cart.</p>
            <element-button :text="'Start planning'" :modifiers="['important']" @click="startPlanningHandler" />
          </section>
        </div>
      </div>
      <div  v-if="cartItems.length"  class="order-summary">
        <h2 class="order-summary__title">Order summary</h2>
        <div class="order-summary-content">
          <div class="order-price">
            <div class="order-price__item">
              <p class="item-title">{{ cartItems.length }} items</p>
            </div>
          </div>
        </div>
        <div class="order-summary-footer">
          <div class="footer-title">
            <h2 class="footer-title__description">Total for payment</h2>
            <p v-if="cartSummary" class="footer-title__price">{{ selectedCurrency }} {{ cartSummary?.totalAmountWithTax }}</p>
            <p v-if="!cartSummary && totalAmount" class="footer-title__price">{{ selectedCurrency }} {{ totalAmount }}</p>
          </div>
          <element-button
            :text="'Proceed to checkout'"
            :modifiers="['important']"
            @click="goToPaymentHandler"
          />
          <div class="disclaimer">
            <img
              src="@/assets/images/shared/lock.svg"
              alt="lock"
              class="disclaimer-icon"
            />
            <h4 class="disclaimer-title">
              This is a secure credit card payment
            </h4>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-additional">
      <h4 v-if="mainServices.length || secondaryServices.length" class="chart-additional__title">You will also need</h4>
      <div class="chart-additional__items">
        <template v-if="visaCard.TotalFeeWithVAT && mainServices.length">
          <TravelCard :main-service="true" :service="visaCard" />
        </template>
        <TravelCard
          v-for="(service, index) in secondaryServices"
          :key="index"
          :service="service"
          :main-service="false"
        />
      </div>
    </div>
    <div class="total-cart-mobile">
      <div class="footer-content">
        <h4 class="footer-content--title">Total</h4>
        <p class="footer-content--price">{{ selectedCurrency }} {{ cartSummary?.totalAmount ? cartSummary.totalAmountWithTax : totalAmount }}</p>
      </div>
      <element-button
        :text="'Checkout'"
        :modifiers="['important']"
        @click="goToPaymentHandler"
      />
    </div>
  </section>
</template>

<script lang="ts">
import TravelCard from '../components/views/landing/components/TravelCard.vue'
import Button from '@/components/elements/Button.vue'
import { useCartStore } from '@/stores/Cart'
import { computed, ref, watch } from 'vue'
import { useServicesStore } from '@/stores/Services'
import { useModalsStore } from '@/stores/Modals'
import { useRouter } from 'vue-router'
import Quantity from '@/components/shared/Quantity.vue'
import { useApplicationStore } from '@/stores/Application'

export default {
  name: 'Chart',
  components: {
    TravelCard,
    'element-button': Button,
    Quantity
  },
  setup() {
    const CartStore = useCartStore()
    const ServicesStore = useServicesStore()
    const ModalsStore = useModalsStore()
    const allServices: any = ref([])
    const router = useRouter()
    const ApplicationStore = useApplicationStore()
    const selectedCurrency = computed(() => {
      return ApplicationStore.getSelectedCurrency
    })
    const visaCard = ref({
      Name: 'e-Visa',
      Description:
          'Apply for your visa online in a few simple steps. We’ll use our extensive resources to secure all the important paperwork so you can enjoy your journey.',
      TotalFeeWithVAT: 0,
      CurrencyCode: selectedCurrency.value
    })

    const cartItems = computed(() => {
      return CartStore.getCartItems
    })

    const mainServices = computed(() => {
      return ServicesStore.getServices
    })

    const secondaryServices = computed(() => {
      return ServicesStore.getSecondaryServices
    })

    const cartSummary = computed(() => {
      return CartStore.getCartSummary
    })

    const totalAmount = computed(() => {
      return CartStore.getTotalAmount
    })

    const countries: any = computed(() => {
      return ApplicationStore.getCountries
    })

    const selectedOffice: any = computed(function () {
      return ApplicationStore.getSelectedOffice
    })

    function deleteCartHandler(cart: any) {
      ModalsStore.updateModal('DeleteCart', cart)
    }

    function goBackHandler() {
      router.go(-1)
    }

    function editCartHandler(cart: any) {
      ModalsStore.updateModal('TravelData', cart)
    }

    function updateCartHandler(quantity: any, card: any) {
      const newCard = { ...card }
      if (newCard.RunwayId) {
        newCard.Quantity = quantity
      }
      if (!newCard.RunwayId) {
        newCard.quantity = quantity
      }
      CartStore.updateCartQuantity(newCard, selectedOffice.value.id)
    }

    function goToPaymentHandler() {
      router.push({ name: 'payment' })
    }

    function goToHomeHandler() {
      router.push({ name: 'home' })
    }

    function getDestinationName(card: any) {
      for (let i = 0; i < countries.value.length; i++) {
        if (countries.value[i].cid == card.Destination) {
          return countries.value[i].name
        }
      }
    }

    function getNationalityName(card: any) {
      for (let i = 0; i < countries.value.length; i++) {
        if (countries.value[i].cid == card.Nationality) {
          return countries.value[i].name
        }
      }
    }

    function getCartPrice(card: any) {
      if (card.RunwayId) {
        return `${card.CurrencyCode} ${card.Quantity * card.TotalFeeWithVAT}`
      }
      if (!card.RunwayId) {
        return `${card.currencyCode} ${card.quantity * card.totalAmountWithTax}`
      }
    }

    function startPlanningHandler() {
      router.push({ name: 'home' })
    }

    watch(
      [mainServices, secondaryServices],
      () => {
        if (mainServices.value.length) {
          const minServicePrice = Math.min(
              ...mainServices.value.map((item: any) => item.TotalFeeWithVAT)
          )
          if (minServicePrice) {
            visaCard.value.TotalFeeWithVAT = minServicePrice
          }
          const services = allServices.value.concat(
            mainServices.value,
            secondaryServices.value
          )
          allServices.value = services
        }
      },
      { immediate: true }
    )

    return {
      cartItems,
      allServices,
      cartSummary,
      secondaryServices,
      mainServices,
      visaCard,
      totalAmount,
      selectedCurrency,
      goToHomeHandler,
      deleteCartHandler,
      goBackHandler,
      editCartHandler,
      updateCartHandler,
      goToPaymentHandler,
      getDestinationName,
      getNationalityName,
      getCartPrice,
      startPlanningHandler
    }
  }
}
</script>

<style scoped></style>
