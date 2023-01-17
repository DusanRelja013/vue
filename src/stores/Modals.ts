import { defineStore } from 'pinia'

export const useModalsStore = defineStore('modals', {
  state: () => ({
    modalName: '',
    modalData: {}
  }),
  getters: {
    getModalName: (state) => state.modalName,
    getModalData: (state) => state.modalData
  },
  actions: {
    updateModal(name: string, data= {}) {
      this.modalName = name
      this.modalData = data
    }
  }
})
