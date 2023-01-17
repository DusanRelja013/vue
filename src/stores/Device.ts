import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('device', {
  state: () => ({
    isMobile: false
  }),
  getters: {
    getIsMobile: (state) => state.isMobile
  },
  actions: {
    updateIsMobileDevice(state: boolean) {
      this.isMobile = state
    }
  }
})
