import { defineStore } from 'pinia'

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    userData: {
      customer_id: '',
      email: '',
      first_name: '',
      last_name: '',
      passport_number: '',
      temp_api_key: ''
    },
    isAuth: false,
    authPopupConfirmed: false
  }),
  getters: {
    getUserData: (state) => state.userData,
    getIsUserAuthenticated: (state) => state.isAuth,
    getAuthConfirmedPopup: (state) => state.authPopupConfirmed
  },
  actions: {
    updateUserData(user: any) {
      this.userData = user
      if (user?.customer_id) {
        this.isAuth = true
      }
    },
    updateUserAuth(value: boolean) {
      this.isAuth = value
    },
    updateUserNameAndEmail(firstName: string = '', lastName: string = '', email: string = '') {
      this.userData.first_name = firstName
      this.userData.last_name = lastName
      this.userData.email = email
    },
    updateAuthConfirmed(value: boolean) {
      this.authPopupConfirmed = value
    }
  }
})
