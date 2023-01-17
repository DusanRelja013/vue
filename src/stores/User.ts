import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    selectedLanguage: {
      label: 'EN',
      value: 'en'
    }
  }),
  getters: {
    getSelectedLanguage: (state) => state.selectedLanguage
  },
  actions: {
    updateSelectedLanguage(lang: any) {
      this.selectedLanguage = lang
    }
  }
})
