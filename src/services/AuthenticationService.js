import axios from 'axios'
import EnvService from '@/services/EnvService'

const apiClient = axios.create({
  baseURL: EnvService.api(),
  withCredentials: false,
  crossdomain: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*'
  }
})

export default {
  login(email, password) {
    return apiClient
      .post(`auth/customerlogin`, { email, password })
      .then(({ data }) => data.result)
  },
  logout(tempKey) {
    return apiClient
      .delete(`auth/customerlogout`)
      .then(({ data }) => data.result)
  },
  loginAccount(email, password) {
    return apiClient
        .post(`/callcustomers/login`, { email, password })
        .then(({ data }) => data.result)
  },
  createAccount(email, first_name, last_name, password) {
    return apiClient
      .post(`customers/customer`, { email, first_name, last_name, password })
      .then(({ data }) => data.result)
  },
  passwordReset(email, customerId) {
    let url = `mail/customerpasswordreset/email/${email}`
    if (customerId) {
      url = `mail/customerpasswordreset/customer_id/${customerId}`
    }
    return apiClient
       .get(url)
       .then(({ data }) => data.result)
  }
}
