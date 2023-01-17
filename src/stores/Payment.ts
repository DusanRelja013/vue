import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    activeStep: 1,
    firstStepValid: false,
    secondStepValid: false,
    firstStepSubmit: false,
    secondStepSubmit: false,
    paymentFinished: false
  }),
  getters: {
    getActiveStep: (state) => state.activeStep,
    getFirstStepValid: (state) => state.firstStepValid,
    getSecondStepValid: (state) => state.secondStepValid,
    getFirstStepSubmit: (state) => state.firstStepSubmit,
    getSecondStepSubmit: (state) => state.secondStepSubmit,
    getPaymentFinished: (state) => state.paymentFinished
  },
  actions: {
    updateActiveStep(position: number) {
      this.activeStep = position
    },
    updateFirstStepValid(status: boolean) {
      this.firstStepValid = status
    },
    updateSecondStepValid(status: boolean) {
      this.secondStepValid = status
    },
    updateFirstStepSubmit(status: boolean) {
      this.firstStepSubmit = status
    },
    updateSecondStepSubmit(status: boolean) {
      this.secondStepSubmit = status
    },
    updatePaymentFinished(status: boolean) {
      this.paymentFinished = status
    }
  }
})
