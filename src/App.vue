<template>
  <img
    v-if="!showSite"
    src="@/assets/images/shared/world-map.gif"
    class="app-load-image"
    alt=""
  />
  <section v-if="showSite" class="app-main">
    <app-header />
    <router-view />
    <app-footer />
    <transition name="modal">
      <app-modal v-if="modalName" @close="toggleModal">
        <component :is="modalPath"></component>
      </app-modal>
    </transition>
    <transition name="toaster">
      <app-toaster />
    </transition>
  </section>
</template>

<script>
import { ref, computed, watch, defineAsyncComponent, onMounted } from 'vue'
import { useModalsStore } from '@/stores/Modals'
import { useApplicationStore } from '@/stores/Application'
import { useDetailsStore } from '@/stores/Details'
import { useAuthenticationStore } from '@/stores/Authentication'
import Header from '@/components/layouts/Header.vue'
import Footer from '@/components/layouts/Footer.vue'
import Modal from '@/components/layouts/Modal.vue'
import ApplicationService from '@/services/ApplicationService'
import { useCartStore } from '@/stores/Cart'
import { useUserStore } from '@/stores/User'
import { useScrollStore } from '@/stores/Scroll'
import { useDeviceStore } from '@/stores/Device'
import { useI18n } from 'vue-i18n'
import Toaster from '@/components/shared/Toaster.vue'
import shared from '@/hooks/shared'

export default {
  name: 'Main',
  components: {
    'app-header': Header,
    'app-footer': Footer,
    'app-modal': Modal,
    'app-toaster': Toaster
  },
  setup: function () {
    const modalName = ref('')
    const modalPath = ref('')
    const ModalsStore = useModalsStore()
    const ApplicationStore = useApplicationStore()
    const AuthenticationStore = useAuthenticationStore()
    const ScrollState = useScrollStore()
    const DetailsStore = useDetailsStore()
    const DeviceStore = useDeviceStore()
    const UserStore = useUserStore()
    const CartStore = useCartStore()
    const i18n = useI18n()
    const customerId = localStorage.getItem('customer_id')
    const totalCart = localStorage.getItem('totalCart')
    const showSite = ref(false)

    const selectedLanguage = computed(() => {
      return UserStore.getSelectedLanguage
    })

    const selectedOffice = computed(function () {
      return ApplicationStore.getSelectedOffice
    })

    const isUserAuth = computed(() => {
      return AuthenticationStore.getIsUserAuthenticated
    })

    onMounted(() => {
      CartStore.initialTotalAmount(totalCart)
      window.Weglot.initialize({
        api_key: 'wg_6250016420a706df5b31d38762e8f0b95'
      })
      const app = document.getElementById('app')
      app.addEventListener('scroll', (event) => {
        ScrollState.updateScrollPositionY(event.target.scrollTop)
      })

      ApplicationService.internalMethod({}, '/callcustomers/checksession')
        .then((res) => res.json())
        .then((data) => {
          if (!data.session_expired) {
            ApplicationService.internalMethod({}, '/callcustomers/login')
              .then((res) => res.json())
              .then((userData) => {
                if (userData) {
                  localStorage.setItem('customer_id', userData?.customer_id)
                  localStorage.setItem('first_name', userData?.first_name)
                  localStorage.setItem('last_name', userData?.last_name)
                  localStorage.setItem('email', userData?.email)
                  AuthenticationStore.updateUserData(userData)
                  AuthenticationStore.updateUserAuth(true)
                }
              })
          }

          if (data.session_expired) {
            AuthenticationStore.updateUserAuth(false)
          }
        })
    })

    CartStore.initialCartItems()

    ApplicationService.getCountryByIP().then((result) => {
      ApplicationStore.updateCountryByIP(result)
    })

    ApplicationService.getSmartVelRegions('en').then((response) => {
      DetailsStore.updateRegions(response)
    })

    ApplicationStore.updateCountries('en')
    ApplicationStore.updateOffices('en')

    // SessionService.getSession().then((data) => {
    //   console.log(data)
    // })
    // if (customerId) {
    //   AuthenticationStore.updateUserAuth(true)
    // }

    DeviceStore.updateIsMobileDevice(shared.isMobile())

    const activeModalName = computed(function () {
      return ModalsStore.modalName
    })

    function toggleModal(value) {
      modalName.value = value.name
    }

    watch(
      activeModalName,
      () => {
        if (activeModalName.value) {
          modalPath.value = defineAsyncComponent(() =>
            import(`./components/modal-templates/${activeModalName.value}.vue`)
          )
        }
        modalName.value = activeModalName.value
      },
      { immediate: true }
    )

    watch(
      selectedLanguage,
      () => {
        i18n.locale.value = selectedLanguage.value.value
      },
      { immediate: true }
    )

    watch(
      isUserAuth,
      () => {
        const customerId = localStorage.getItem('customer_id')
        const cardItems = localStorage.getItem('cartItems')
        if (isUserAuth.value) {
          const firstName = localStorage.getItem('first_name')
          const lastName = localStorage.getItem('last_name')
          const email = localStorage.getItem('email')
          if (firstName && lastName) {
            AuthenticationStore.updateUserNameAndEmail(firstName, lastName, email)
          }
        }
        if (customerId && isUserAuth.value && !cardItems) {
          ApplicationService.getBasket(customerId)
            .then((basket) => {
              CartStore.initialCartItems(basket)
              localStorage.removeItem('cartItems')
            })
            .catch((error) => {
              console.error(error.description)
            })
        }

        if (
          customerId &&
          isUserAuth.value &&
          cardItems &&
          selectedOffice.value?.id
        ) {
          CartStore.updateBasket(selectedOffice.value.id)
        }
      },
      { immediate: true }
    )

    setTimeout(() => {
      showSite.value = true
    }, 3000)


    window.addEventListener('resize', () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      DeviceStore.updateIsMobileDevice(shared.isMobile())
    })

    return { showSite, modalName, modalPath, toggleModal }
  }
}
</script>

<style lang="scss">
@import './assets/scss/_main.scss';
</style>
