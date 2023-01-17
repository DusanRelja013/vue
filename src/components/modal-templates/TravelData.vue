<template>
  <section id="modal-travel-data" class="modal-travel-data">
    <div class="travel-data-info">
      <div class="data-info">
        <h1 class="data-info-title">Get your e - visa in 3 simple steps.</h1>
        <div class="data-info-steps">
          <div class="step">
            <div class="step-header">
              <h2 class="step-header__number">1</h2>
            </div>
            <h2 class="step-title">Fill out the form</h2>
            <p class="step-description">
              In just a couple clicks, start your visa application by filling out
              our easy online form.
            </p>
          </div>
          <div class="step">
            <div class="step-header">
              <h2 class="step-header__number">2</h2>
            </div>
            <h2 class="step-title">We process your application</h2>
            <p class="step-description">
              Sit back and relax as we use our extensive global resources to secure your visa.
            </p>
          </div>
          <div class="step">
            <div class="step-header">
              <h2 class="step-header__number">3</h2>
            </div>
            <h2 class="step-title">Get your visa</h2>
            <p class="step-description">
              We will safely deliver your approved tourist visa. Now go enjoy the journey!
            </p>
          </div>
        </div>
      </div>
      <div class="data-check">
        <div class="check-wrapper">
          <div class="check">
            <div class="check-status">
              <img src="@/assets/images/shared/ok-white.svg" alt="" class="check-status__image">
            </div>
            <p class="check-description">
              Save valuable time and avoid expensive delays using our visa platform.
            </p>
          </div>
          <div class="check">
            <div class="check-status">
              <img src="@/assets/images/shared/ok-white.svg" alt="" class="check-status__image">
            </div>
            <p class="check-description">
              Our visa specialist is available to assist you 24/7 via chat, phone, or email.
            </p>
          </div>
          <div class="check">
            <div class="check-status">
              <img src="@/assets/images/shared/ok-white.svg" alt="" class="check-status__image">
            </div>
            <p class="check-description">
              We deliver your passport with an approved visa at your preferred address.
            </p>
          </div>
          <div class="check">
            <div class="check-status">
              <img src="@/assets/images/shared/ok-white.svg" alt="" class="check-status__image">
            </div>
            <p class="check-description">
              We make complex questions easy to understand and answer.
            </p>
          </div>
          <div class="check">
            <div class="check-status">
              <img src="@/assets/images/shared/ok-white.svg" alt="" class="check-status__image">
            </div>
            <p class="check-description">
              We review all of your documents to certify your application is accurate, complete, and ready for submission.
            </p>
          </div>
          <div class="check">
            <div class="check-status">
              <img src="@/assets/images/shared/ok-white.svg" alt="" class="check-status__image">
            </div>
            <p class="check-description">
              Protecting your privacy is our top priority.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="travel-data-requirements">
      <img
        src="@/assets/images/shared/close-white.svg"
        alt="close"
        class="requirements__icon"
        @click="closeModalHandler"
      />
      <p class="requirements__description">
        Fill just a few more questions to define your visa type.
      </p>
      <div class="travel-period">
        <div class="period">
          <p class="period-text">From</p>
          <p class="period-result">
            {{ selectedOffice ? selectedOffice.name : ' - ' }}
          </p>
        </div>
        <div class="period">
          <p class="period-text">To</p>
          <p class="period-result">
            {{ selectedDestination ? selectedDestination.name : ' - ' }}
          </p>
        </div>
        <div class="period">
          <p class="period-text">Date</p>
          <p class="period-result" v-if="modalData.cardInfo[0].EntryDate && modalData.cardInfo[0].ExitDate">
            {{ modalData.cardInfo[0].EntryDate }} - {{ modalData.cardInfo[0].ExitDate }}
          </p>
        </div>
      </div>
      <div class="travel-options">
        <div class="travel-options-item">
          <element-select
              :options="countries"
              :option-label="'name'"
              :floating-label="true"
              :floating-label-text="'I am holding a passport from'"
              :disabled="!countries"
              :value="selectedNationality"
              :class="{'active-select': selectedNationality }"
              @selectedOption="selectCountry"
          />
          <div class="empty-item"></div>
        </div>
        <div class="travel-options-item">
          <element-select
              :options="visaTypeOptions"
              :option-label="'name'"
              :disabled="!nationality && !visaTypeOptions"
              :floating-label="true"
              :value="visaType"
              :floating-label-text="'Visa Type'"
              :class="{'active-select': visaType }"
              @selectedOption="selectedVisaTypeHandler"
          />
          <Tooltip :text="visaTooltipDescription" />
        </div>
        <div class="travel-options-item">
          <element-select
              :options="numberOfEntries"
              :option-label="'name'"
              :disabled="!visaType && !numberOfEntries"
              :floating-label="true"
              :value="selectedEntry"
              :floating-label-text="'Number of Entries'"
              :class="{'active-select': selectedEntry}"
              @selectedOption="selectedEntriesHandler"
          />
          <Tooltip :text="'Single - A visa that is valid for a single trip within the time span of the validity <br><br> Double -  A visa that allows you to enter and exist the country twice within the period of validity <br><br> Multiple - a multiple entry visa allows you to enter and exit the country as per the terms of the visa'" />
        </div>
        <div class="travel-options-item">
          <element-select
              :options="processingTimeOptions"
              :option-label="'name'"
              :disabled="!selectedEntry && !processingTimeOptions"
              :floating-label="true"
              :floating-label-text="'Processing Time'"
              :class="{'active-select': processingTime}"
              :value="processingTime"
              @selectedOption="selectedProcTimeHandler"
          />
          <Tooltip :text="'This indicates how long it will take to process your application'" />
        </div>
        <div class="travel-options-item">
          <element-select
              :options="visaValidityOptions"
              :option-label="'name'"
              :disabled="!processingTime && !visaValidityOptions"
              :floating-label="true"
              :floating-label-text="'Validity'"
              :class="{'active-select': visaValidity}"
              :value="visaValidity"
              @selectedOption="selectedVisaValidityHandler"
          />
          <Tooltip :text="'Validity offers how long you will be able to use your visa.'" />
        </div>
        <div class="travel-options-item">
          <div class="travel-options-quantity">
            <h2 class="travel-options-quantity__title">Quantity</h2>
            <Quantity
                @valueHandler="setQuantityHandler"
                :value="quantity"
            />
          </div>
          <div class="empty-item"></div>
        </div>
        <div class="travel-options__add">
          <div class="card-price">
            <p class="card-price__title">Total for {{ quantity }} visa(s)</p>
            <div class="card-price-content">
              <h4 class="card-price__value">
                <span class="card-price__currency">{{ selectedCurrency }}</span>
                {{ price }}
              </h4>
            </div>
          </div>
          <element-button
            :text="'Add to cart'"
            :modifiers="['valid']"
            @click="addToCartHandler"
          />
        </div>
        <p v-show="showInvalidMsg" class="travel-options-invalid">You must select a value from each dropdown before you can continue</p>
      </div>
    </div>
  </section>
</template>

<script>
import {computed, onMounted, ref, watch} from 'vue'
import { useModalsStore } from '@/stores/Modals'
import { useCartStore } from '@/stores/Cart'
import Select from '@/components/elements/Select.vue'
import Button from '@/components/elements/Button.vue'
import Quantity from '@/components/shared/Quantity.vue'
import { useApplicationStore } from '@/stores/Application'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ApplicationService from '@/services/ApplicationService'
import Tooltip from "../elements/Tooltip.vue";

export default {
  name: 'TravelData',
  components: {
    'element-select': Select,
    'element-button': Button,
    Quantity,
    Tooltip
  },
  setup() {
    const ApplicationStore = useApplicationStore()
    const visaType = ref(null)
    const numberOfEntries = ref([])
    const ModalsStore = useModalsStore()
    const CartStore = useCartStore()
    const nationality = ref(null)
    const visaTypeOptions = ref([])
    const selectedEntry = ref(null)
    const processingTimeOptions = ref([])
    const visaValidityOptions = ref([])
    const processingTime = ref(null)
    const visaValidity = ref(null)
    const quantity = ref(1)
    const price = ref(0)
    const selectedService = ref(null)
    const showInvalidMsg = ref(false)
    const activeSelect = ref([])
    const visaTooltipDescription = ref('');

    const selectedOffice = computed(function () {
      return ApplicationStore.getSelectedOffice
    })

    const selectedDestination = computed(function () {
      return ApplicationStore.getSelectedDestination
    })

    const modalData = computed(() => {
      return ModalsStore.getModalData
    })

    const countries = computed(() => {
      return ApplicationStore.getCountries
    })

    const selectedCurrency = computed(() => {
      return ApplicationStore.getSelectedCurrency
    })

    const selectedNationality = computed(function () {
      return ApplicationStore.getSelectedNationality
    })

    function closeModalHandler() {
      ModalsStore.updateModal('')
    }

    function addToCartHandler() {
      if (!nationality.value || !visaType.value || !selectedEntry.value || !processingTime.value || !visaValidity.value) {
        showInvalidMsg.value = true;
        return;
      }
      selectedService.value.EntryDate = modalData.value.cardInfo[0].EntryDate
      selectedService.value.ExitDate = modalData.value.cardInfo[0].ExitDate
      CartStore.addCartItem(selectedService.value, selectedOffice.value.id)
      ModalsStore.updateModal('')
    }

    function selectCountry(country) {
      showInvalidMsg.value = false
      visaType.value = null
      selectedEntry.value = null
      processingTime.value = null
      nationality.value = country
      ApplicationStore.updateSelectedNationality(country)

      ApplicationService.getVisaRequirements(
        selectedDestination.value.code.toLowerCase(),
        selectedOffice.value.id,
        nationality.value.code.toLowerCase()
      ).then((response) => {
        const visaTypes = []
        for (const visa in response) {
          const type = response[visa]
          type.id = visa
          visaTypes.push(type)
        }
        visaTypeOptions.value = visaTypes
      }).catch(() => {
        nationality.value = null
        visaTypeOptions.value = []
        processingTimeOptions.value = []
        visaValidityOptions.value = []
        processingTime.value = null
        visaType.value = null
        selectedEntry.value = null
        visaValidity.value = null
      })
    }

    function selectedEntriesHandler(option) {
      processingTime.value = null
      selectedEntry.value = option
      showInvalidMsg.value = false
      const procTimes = []
      for (const entry in option.proc_time) {
        const type = option.proc_time[entry]
        type.id = entry
        procTimes.push(type)
      }
      processingTimeOptions.value = procTimes
    }

    function selectedProcTimeHandler(option) {
      processingTime.value = option
      showInvalidMsg.value = false

      const validity = []
      for (const entry in option.validity) {
        const type = option.validity[entry]
        type.id = entry
        validity.push(type)
      }
      visaValidityOptions.value = validity
    }

    function selectedVisaValidityHandler(option) {
      visaValidity.value = option
      showInvalidMsg.value = false

      ApplicationService.singleMainService(
        selectedDestination.value.code,
        selectedOffice.value.id,
        nationality.value.code,
        visaType.value.id,
        selectedEntry.value.id,
        visaValidity.value.id,
        processingTime.value.id,
        visaType.value.evisa
      ).then((service) => {
        if (service) {
          const newService = { ...service }
          newService.Quantity = quantity.value
          selectedService.value = newService
          const data = {
            office_id: selectedOffice.value.id,
            main: [{
              RunwayId: selectedService.value.RunwayId,
              OfatCode: selectedService.value.OFatCode,
              NoOfEntries: selectedService.value.NoOfEntries,
              Validity: selectedService.value.Validity,
              ProcessingSpeedCode: selectedService.value.ProcessingSpeedCode,
              ServiceType: selectedService.value.OfatCode,
              Quantity: selectedService.value.Quantity
            }],
            secondary: []
          }
          ApplicationService.calculateBasket(data).then((response) => {
            price.value = response.summary.totalAmountWithTax
          })
        }
      })
    }

    function selectedVisaTypeHandler(option) {
      selectedEntry.value = null
      processingTime.value = null
      visaType.value = option
      showInvalidMsg.value = false

      const entriesNumber = []
      for (const entry in option.entries_number) {
        const type = option.entries_number[entry]
        type.id = entry
        entriesNumber.push(type)
      }
      numberOfEntries.value = entriesNumber
    }

    function setQuantityHandler(value) {
      quantity.value = value
      if (selectedService.value) {
        selectedService.value.Quantity = value
        const data = {
          office_id: selectedOffice.value.id,
          main: [{
            RunwayId: selectedService.value.RunwayId,
            OfatCode: selectedService.value.OFatCode,
            NoOfEntries: selectedService.value.NoOfEntries,
            Validity: selectedService.value.Validity,
            ProcessingSpeedCode: selectedService.value.ProcessingSpeedCode,
            ServiceType: selectedService.value.OfatCode,
            Quantity: selectedService.value.Quantity
          }],
          secondary: []
        }
        ApplicationService.calculateBasket(data).then((response) => {
          price.value = response.summary.totalAmountWithTax
        })
      }
    }

    watch(
      modalData,
      () => {
        if (modalData.value && modalData.value.cardInfo) {
          quantity.value = modalData.value.cardInfo[0].Quantity

          for (let i = 0; i < modalData.value.cardInfo.length; i++) {
            if (i === 0) {
              visaTooltipDescription.value = modalData.value.cardInfo[i].Name + ': ' + modalData.value.cardInfo[i].Description
            }
            if (i > 0) {
              visaTooltipDescription.value = visaTooltipDescription.value + '<br><br>' + modalData.value.cardInfo[i].Name + ': ' + modalData.value.cardInfo[i].Description
            }
          }
        }
      },
      { immediate: true }
    )

    watch(selectedNationality, () => {
      if (selectedNationality.value) {
        selectCountry(selectedNationality.value)
      }

    }, { immediate: true })

    onMounted(() => {
      const element = document.getElementById('modal-travel-data')
      element.scrollTop = -element.scrollHeight
    })

    return {
      nationality,
      visaType,
      numberOfEntries,
      selectedOffice,
      selectedDestination,
      visaTypeOptions,
      selectedEntry,
      processingTimeOptions,
      processingTime,
      price,
      modalData,
      quantity,
      visaValidityOptions,
      visaValidity,
      selectedService,
      selectedCurrency,
      showInvalidMsg,
      activeSelect,
      countries,
      selectedNationality,
      visaTooltipDescription,
      selectedVisaValidityHandler,
      selectedProcTimeHandler,
      selectedVisaTypeHandler,
      selectedEntriesHandler,
      closeModalHandler,
      addToCartHandler,
      selectCountry,
      setQuantityHandler,
    }
  }
}
</script>

<style scoped></style>
