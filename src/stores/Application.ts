import { defineStore } from 'pinia'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ApplicationService from '@/services/ApplicationService.js'

export const useApplicationStore = defineStore('application', {
  state: () => ({
    offices: {},
    countries: [],
    selectedOffice: null,
    selectedDestination: null,
    selectedDateRange: null,
    countryByIP: null,
    selectedCurrency: 'USD',
    selectedNationality: null
  }),
  getters: {
    getOffices: (state) => state.offices,
    getCountries: (state) => state.countries,
    getSelectedOffice: (state) => state.selectedOffice,
    getSelectedDestination: (state) => state.selectedDestination,
    getSelectedDateRange: (state) => state.selectedDateRange,
    getCountryByIP: (state) => state.countryByIP,
    getSelectedCurrency: (state) => state.selectedCurrency,
    getSelectedNationality: (state) => state.selectedNationality
  },
  actions: {
    updateOffices(lang = 'en') {
      ApplicationService.getOffices(lang).then((response: any) => {
        this.offices = response
      })
    },
    updateCountries(lang = 'en') {
      ApplicationService.getCountries(lang).then((response: any) => {
        this.countries = response
      })
    },
    updateSelectedOffice(office: any) {
      this.selectedOffice = office
    },
    updateSelectedDestination(destination: any) {
      this.selectedDestination = destination
    },
    updateSelectedDate(date: any) {
      this.selectedDateRange = date
    },
    updateCountryByIP(data: any) {
      this.countryByIP = data
    },
    updateCurrency(currency: string) {
      this.selectedCurrency = currency
    },
    updateSelectedNationality(nationality: any) {
      this.selectedNationality = nationality
    }
  }
})
