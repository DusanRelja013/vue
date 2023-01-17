<template>
  <section
    id="app-header"
    class="app-header"
    :class="{ revert: revert, fixed: scrollPosition > 0 && !isMobile }"
  >
    <div class="app-screens">
      <div class="items-group">
        <div class="item" @click="goToRouteHandler('home')">
          <img
            v-if="!revert && !scrollPosition"
            src="@/assets/images/layouts/header/logo-large-white.svg"
            alt="Logo"
            class="item-logo"
          />
          <img
            v-if="revert || scrollPosition > 0"
            src="@/assets/images/layouts/header/logo-large-blue.svg"
            alt="Logo"
            class="item-logo"
          />
        </div>
               <div class="item">
                 <h4 class="item-title">Travel Planing</h4>
               </div>
               <div class="item">
                 <h4 class="item-title">Discover</h4>
               </div>
              <div class="item">
                <h4 class="item-title">Faq's</h4>
              </div>
               <div class="item">
                 <h4 class="item-title">About Us</h4>
               </div>
      </div>
      <div v-if="showGroup" class="items-group">
               <!-- <div class="item" @click="goToRouteHandler('wishlist')">
                 <h4 class="item-title">Wishlist</h4>
                 <img
                   src="@/assets/images/layouts/header/wishlist.svg"
                   alt=""
                   class="item__icon"
                 />
               </div> -->
        <div
          class="item item-card"
          @mouseover="toggleCart = true; showProfilePopup = false"
          @mouseleave="toggleCart = false"
          @click="goToRouteHandler('cart')"
        >
          <h4 class="item-title">My cart</h4>
          <p v-if="cartItems.length" class="item-cart-number">
            {{ cartItems.length }}
          </p>
          <img
            src="@/assets/images/layouts/header/cart.svg"
            alt=""
            class="item__icon"
          />
          <transition name="fade">
            <div
                v-if="cartItems.length"
                v-show="toggleCart"
                @mouseleave="toggleCart = false"
                class="cart-items-wrapper"
            >
              <div class="card-items-content">
                <div
                    v-for="(card, index) in cartItems"
                    class="card-item"
                    :key="index"
                >
                  <div class="card-item-image">
                    <img
                        v-if="card.RunwayId"
                        src="@/assets/images/views/landing/travel-card/service.png"
                        alt="service"
                        class="card-item-image__icon"
                    />
                    <img
                        v-if="!card.RunwayId && card.image"
                        :src="card.image"
                        alt="service"
                        class="card-item-image__icon"
                    />
                    <img
                        v-if="!card.RunwayId && !card.image"
                        src="@/assets/images/views/landing/travel-card/no-image.png"
                        alt="service"
                        class="card-item-image__icon"
                    />
                  </div>
                  <div class="card-item-content">
                    <div class="content-title">
                      <h2 class="content-title__service">
                        {{ card.RunwayId ? card.Name : card.name }}
                      </h2>
                      <h2 v-if="card.RunwayId" class="content-title__destination">
                        {{ getDestinationName(card) }}
                      </h2>
                    </div>
                    <div v-if="card.RunwayId" class="content-description">
                      <p class="content-description__item">
                        Nationality - {{ getNationalityName(card) }}
                      </p>
                      <p class="content-description__item">
                        {{ card.Name }}
                      </p>
                      <p class="content-description__item">
                        {{ card.EntryName }}
                      </p>
                      <p class="content-description__item">
                        {{ card.ProcessingSpeedDesc }}
                      </p>
                    </div>
                    <div class="content-total">
                      <p class="content-total__quantity">
                        Quantity {{ getQuantity(card) }}
                      </p>
                      <p class="content-total__price">
                        {{
                          card.RunwayId ? card.CurrencyCode : card.currencyCode
                        }}
                        {{
                          card.RunwayId
                              ? card.TotalFeeWithVAT * card.Quantity
                              : card.totalAmountWithTax * card.quantity
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="card-item-total">
                  <h2 class="total-title">Total</h2>
                  <p v-if="cartSummary" class="total-price">
                    {{ selectedCurrency}} {{ cartSummary.totalAmountWithTax ? cartSummary.totalAmountWithTax : 0 }}
                  </p>
                  <p v-if="!cartSummary && totalAmount" class="total-price">
                    {{ selectedCurrency }} {{ totalAmount }}
                  </p>
                </div>
              </div>
              <element-button
                  :text="'Go to Cart'"
                  :modifiers="['important']"
                  @click="goToRouteHandler('cart')"
              />
            </div>
            
          </transition>

        </div>
        <div class="currency">
          <p class="color: '#fff'">EUR</p>
        </div>
        <div class="item profile-item">
          <h4 v-if="!isUserAuth" class="item-title" @click="signInHandler">
            Sign in
          </h4>
          <div
            v-if="isUserAuth"
            class="profile"
            @mouseover="toggleCart = false"
          >
            <div class="profile-item" @click="showProfilePopup = true">
              <h4 class="profile-item-message">Hi,</h4>
              <div class="profile-item-initials">
                {{ userData?.first_name?.charAt(0).toUpperCase()
                }}{{ userData?.last_name?.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div
              class="profile-popup"
              v-if="showProfilePopup"
              v-click-outside="onClickOutside"
            >
              <div class="popup-item">
                <h4 class="popup-item--title">Account</h4>
                <div class="items-wrapper">
                  <div
                    class="item"
                    @click="goToExternalRouteHandler('customers/account')"
                  >
                    <img
                      src="@/assets/images/layouts/header/profile/user.svg"
                      alt=""
                      class="item-image"
                    />
                    <h4 class="item-title">Email & password details</h4>
                  </div>
                </div>
              </div>
              <div class="popup-item">
                <h4 class="popup-item--title">Dashboard</h4>
                <div class="items-wrapper">
                  <div
                    class="item"
                    @click="goToExternalRouteHandler('customers')"
                  >
                    <img
                      src="@/assets/images/layouts/header/profile/calendar.svg"
                      alt=""
                      class="item-image"
                    />
                    <h4 class="item-title">Trips</h4>
                  </div>
                </div>
                <div class="items-wrapper">
                  <div
                    class="item"
                    @click="goToExternalRouteHandler('customers/traveler')"
                  >
                    <img
                      src="@/assets/images/layouts/header/profile/profile.svg"
                      alt=""
                      class="item-image"
                    />
                    <h4 class="item-title">Profile Details</h4>
                  </div>
                </div>
                <div class="items-wrapper">
                  <div
                    class="item"
                    @click="goToExternalRouteHandler('customers/my_products')"
                  >
                    <img
                      src="@/assets/images/layouts/header/profile/shopping-cart.svg"
                      alt=""
                      class="item-image"
                    />
                    <h4 class="item-title">My Products</h4>
                  </div>
                </div>
                <div class="items-wrapper">
                  <div
                    class="item"
                    @click="goToExternalRouteHandler('customers/billing')"
                  >
                    <img
                      src="@/assets/images/layouts/header/profile/wallet.svg"
                      alt=""
                      class="item-image"
                    />
                    <h4 class="item-title">Billing</h4>
                  </div>
                </div>
                <div v-if="false" class="items-wrapper">
                  <div class="item">
                    <img
                      src="@/assets/images/layouts/header/profile/notification.svg"
                      alt=""
                      class="item-image"
                    />
                    <h4 class="item-title">Notifications</h4>
                  </div>
                </div>
              </div>
              <div class="logout" @click="logoutHandler">
                <img
                  src="@/assets/images/layouts/header/profile/log-out.svg"
                  alt=""
                  class="logout-icon"
                />
                <h4 class="logout-title">Log out</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mobile-screens">
      <div class="logo" @click="goToRouteHandler('home')">
        <img
          src="@/assets/images/layouts/header/logo-large-blue.svg"
          alt="Logo"
          class="item-logo"
        />
      </div>
      <div class="mobile-group">
        <div class="mobile-group-cart" @click="goToCartHandler">
          <img
            src="@/assets/images/layouts/header/cart.svg"
            alt=""
            class="item__icon"
          />
          <p v-if="cartItems.length" class="item-cart-number">
            {{ cartItems.length }}
          </p>
        </div>
        <div class="profile-logout" v-if="!isUserAuth" @click="goToSignUpHandler">
          <img
            src="@/assets/images/layouts/header/profile.svg"
            alt=""
            class="item__icon"
          />
        </div>
        <div
          v-if="isUserAuth"
          class="profile-mobile"
          @click="showProfileMenuHandler"
        >
          <div class="profile-mobile-initials">
            {{ userData?.first_name?.charAt(0).toUpperCase()
            }}{{ userData?.last_name?.charAt(0).toUpperCase() }}
          </div>
        </div>
        <span class="mobile-burger" @click="mobileNavHandler">
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </span>
      </div>
      <div class="mobile-navigation-menu" :class="{ 'active' :showMobileNav}">
        <img
          @click="mobileNavHandler"
          src="@/assets/images/shared/close.svg"
          alt="Close"
          class="navigation-close"
        />
        <div class="navigation-items">
          <div class="navigation-items-group">
            <div
              class="item"
              @click="goToExternalRouteHandler('customers/account')"
            >
              Terms and conditions
            </div>
            <div
              v-if="false"
              class="item"
              @click="goToExternalRouteHandler('customers/account')"
            >
              Download the app
            </div>
          </div>
        </div>
      </div>
      <div v-if="showProfileMobile" class="mobile-navigation-menu" :class="{ 'active' :showProfileMobile}">
        <img
          @click="showProfileMobile = false"
          src="@/assets/images/shared/close.svg"
          alt="Close"
          class="navigation-close"
        />
        <div class="navigation-profile">
          <div class="navigation-profile-title">
            <div class="profile-icon">
              <p class="profile-icon__text">
                {{ userData?.first_name?.charAt(0).toUpperCase()
                }}{{ userData?.last_name?.charAt(0).toUpperCase() }}
              </p>
            </div>
            <h4 class="profile-name">
              {{ userData?.first_name }} {{ userData?.last_name }}
            </h4>
          </div>
          <div class="navigation-profile-items">
            <div
              class="item"
              @click="goToExternalRouteHandler('customers/account')"
            >
              <img
                src="@/assets/images/layouts/header/profile/user.svg"
                alt=""
                class="item-icon"
              />
              <h4 class="item-title">Email & password details</h4>
            </div>
            <div class="item" @click="goToExternalRouteHandler('customers')">
              <img
                src="@/assets/images/layouts/header/profile/calendar.svg"
                alt=""
                class="item-icon"
              />
              <h4 class="item-title">Trips</h4>
            </div>
            <div
              class="item"
              @click="goToExternalRouteHandler('customers/traveler')"
            >
              <img
                src="@/assets/images/layouts/header/profile/user.svg"
                alt=""
                class="item-icon"
              />
              <h4 class="item-title">Profile details</h4>
            </div>
            <div
              class="item"
              @click="goToExternalRouteHandler('customers/my_products')"
            >
              <img
                src="@/assets/images/layouts/header/profile/shopping-cart.svg"
                alt=""
                class="item-icon"
              />
              <h4 class="item-title">My Products</h4>
            </div>
            <div
              class="item"
              @click="goToExternalRouteHandler('customers/billing')"
            >
              <img
                src="@/assets/images/layouts/header/profile/wallet.svg"
                alt=""
                class="item-icon"
              />
              <h4 class="item-title">Billing</h4>
            </div>
          </div>
          <div class="navigation-profile-logout">
            <div class="item" @click="logoutHandler">
              <img
                src="@/assets/images/layouts/header/profile/log-out.svg"
                alt=""
                class="item-icon"
              />
              <h4 class="item-title">Logout</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import Button from '@/components/elements/Button.vue'
// import Select from '@/components/elements/Select.vue'
import { Config } from '@/config'
import { useUserStore } from '@/stores/User'
import { useCartStore } from '@/stores/Cart'
import { useModalsStore } from '@/stores/Modals'
import { useAuthenticationStore } from '@/stores/Authentication'
import { useApplicationStore } from '@/stores/Application'
import { useScrollStore } from '@/stores/Scroll'
import vClickOutside from 'click-outside-vue3'
import ApplicationService from '@/services/ApplicationService'
import {useDeviceStore} from "@/stores/Device";

export default {
  name: 'Header',
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    'element-button': Button
    // 'element-select': Select
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const showMobileNav = ref(false)
    const revert = ref(false)
    const toggleCart = ref(false)
    const availableLanguages = Config.AVAILABLE_LANGUAGES
    const UserStore = useUserStore()
    const CartStore = useCartStore()
    const ModalsStore = useModalsStore()
    const ApplicationStore = useApplicationStore()
    const AuthenticationStore = useAuthenticationStore()
    const DeviceStore = useDeviceStore()
    const ScrollState = useScrollStore()
    const showGroup = ref(true)
    const showProfilePopup = ref(false)
    const showProfileMobile = ref(false)

    const selectedLanguage = computed(() => {
      return UserStore.getSelectedLanguage
    })

    const cartItems = computed(() => {
      return CartStore.getCartItems
    })

    const cartSummary = computed(() => {
      return CartStore.getCartSummary
    })

    const totalAmount = computed(() => {
      return CartStore.getTotalAmount
    })

    const isUserAuth = computed(() => {
      return AuthenticationStore.getIsUserAuthenticated
    })

    const userData = computed(() => {
      return AuthenticationStore.getUserData
    })

    const countries = computed(() => {
      return ApplicationStore.getCountries
    })

    const scrollPosition = computed(() => {
      return ScrollState.getScrollPositionY
    })

    const selectedCurrency = computed(() => {
      return ApplicationStore.getSelectedCurrency
    })

    const isMobile = computed(() => {
      return DeviceStore.getIsMobile
    })

    function goToRouteHandler(routeName) {
      toggleCart.value = false
      if (routeName === 'cart' && !cartItems.value.length) {
        return
      }
      router.push({ name: routeName })
    }

    function signInHandler() {
      ModalsStore.updateModal('SignUp')
    }

    function onClickOutside(event) {
      showProfilePopup.value = false
    }

    function logoutHandler() {
      ApplicationService.internalMethod(
        'POST',
        'data',
        {},
        '/callcustomers/logout'
      ).then(() => {
        localStorage.removeItem('customer_id')
        localStorage.removeItem('first_name')
        localStorage.removeItem('last_name')
        localStorage.removeItem('office_id')
        localStorage.removeItem('email')
        localStorage.removeItem('public_key')
        AuthenticationStore.updateUserAuth(false)
        CartStore.clearCart()
        showProfilePopup.value = false
        showMobileNav.value = false
        router.push({ name: 'home' })
        ModalsStore.updateModal('')
      })
    }

    function getDestinationName(card) {
      for (let i = 0; i < countries.value.length; i++) {
        if (countries.value[i].cid == card.Destination) {
          return countries.value[i].name
        }
      }
    }

    function getNationalityName(card) {
      for (let i = 0; i < countries.value.length; i++) {
        if (countries.value[i].cid == card.Nationality) {
          return countries.value[i].name
        }
      }
    }

    function getQuantity(card) {
      if (card.RunwayId) {
        return card.Quantity
      }
      if (!card.RunwayId) {
        return card.quantity
      }
    }

    function goToExternalRouteHandler(path) {
      window.location.href =
        window.location.protocol + '//' + window.location.host + `/${path}`
    }

    function goToCartHandler() {
      if (cartItems.value.length) {
        router.push({ name: 'cart' })
      }
    }

    function goToSignUpHandler() {
      ModalsStore.updateModal('SignUp')
    }

    function showProfileMenuHandler() {
      showProfileMobile.value = !showProfileMobile.value
      if (showProfileMobile.value) {
        document.body.classList.add('lang-index')
      } else {
        document.body.classList.remove('lang-index')
      }
    }

    function mobileNavHandler() {
      showMobileNav.value = !showMobileNav.value
      if (showMobileNav.value) {
        document.body.classList.add('lang-index')
      } else {
        document.body.classList.remove('lang-index')
      }
    }

    watch(
      () => route.name,
      async (name) => {
        revert.value = false
        if (!isMobile.value) {
          document.body.classList.remove('scroll-active')
        }

        showGroup.value = true
        if (name === 'terms' || name === 'cart' || name === 'payment') {
          revert.value = true
          if (name !== 'payment') {
            if (!isMobile.value) {
              document.body.classList.add('scroll-active')
            }
          }
        }
        if (name === 'payment') {
          showGroup.value = false
        }
      }, { immediate: true}
    )

    watch(
      scrollPosition,
      () => {
        if (!isMobile.value) {
          if (scrollPosition.value > 0 && route.name !== 'payment') {
            document.body.classList.add('scroll-active')
          } else {
            if (route.name !== 'terms' && route.name !== 'cart') {
              document.body.classList.remove('scroll-active')
            }
          }
        }
      },
      { immediate: true }
    )

    return {
      revert,
      showMobileNav,
      toggleCart,
      availableLanguages,
      selectedLanguage,
      cartItems,
      cartSummary,
      isUserAuth,
      showGroup,
      userData,
      showProfilePopup,
      totalAmount,
      scrollPosition,
      showProfileMobile,
      isMobile,
      goToExternalRouteHandler,
      onClickOutside,
      getDestinationName,
      getNationalityName,
      getQuantity,
      logoutHandler,
      signInHandler,
      goToRouteHandler,
      goToCartHandler,
      goToSignUpHandler,
      showProfileMenuHandler,
      mobileNavHandler,
      selectedCurrency
    }
  }
}
</script>

<style scoped></style>
