import { defineStore } from 'pinia'

export const useServicesStore = defineStore('services', {
  state: () => ({
    services: [],
    secondaryServices: [],
    selectedServices: []
  }),
  getters: {
    getServices: (state) => state.services,
    getSecondaryServices: (state) => state.secondaryServices
  },
  actions: {
    updateServices(services: any) {
      this.services = services
    },
    updateSecondaryServices(services: any) {
      this.secondaryServices = services
    }
  }
})
