import { defineStore } from 'pinia'

export const useToasterStore = defineStore('toaster', {
  state: () => ({
    toaster: {
      message: '',
      duration: 3000,
      type: ''
    }
  }),
  getters: {
    getToasterData: (state) => state.toaster
  },
  actions: {
    updateToaster(data: any) {
      this.toaster = data;
    }
  }
})
