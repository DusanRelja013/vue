import { defineStore } from 'pinia'

export const useDetailsStore = defineStore('details', {
  state: () => ({
    restrictionDetails: null,
    authStatus: '',
    localSummary: null,
    visaRequired: null,
    regions: null,
  }),
  getters: {
    getRestrictionDetails: (state) => state.restrictionDetails,
    getAuthorisationStatus: (state) => state.authStatus,
    getLocalSummary: (state) => state.localSummary,
    getVisaRequired: (state) => state.visaRequired,
    getRegions: (state) => state.regions
  },
  actions: {
    updateRestrictionDetails: function (details: any) {
      if (details) {
        this.restrictionDetails = details
        this.authStatus = details.authorization_status
      }
    },
    updateLocalSummary(summary: any) {
      if (summary) {
        this.localSummary = summary
      }
    },
    updateVisasByNationality(visas: any) {
      this.visaRequired = visas
    },
    updateRegions(regions: any) {
      if (regions && regions.results) {
        this.regions = regions.results
      }
    }
  }
})
