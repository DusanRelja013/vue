import { defineStore } from 'pinia'

export const useScrollStore = defineStore('scroll', {
  state: () => ({
    scrollPositionY: 0,
    activeLandingTab: ''
  }),
  getters: {
    getScrollPositionY: (state) => state.scrollPositionY,
    getActiveLandingTab: (state) => state.activeLandingTab
  },
  actions: {
    updateScrollPositionY(position: number) {
      this.scrollPositionY = position
    },
    updateActiveLandingTab(tab: string) {
      this.activeLandingTab = tab
    }
  }
})
