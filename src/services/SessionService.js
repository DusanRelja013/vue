import axios from 'axios'
import _ from 'lodash'
import EnvService from '@/services/EnvService'

const apiClient = axios.create({
  baseUrl: window.location.origin,
  withCredentials: false,
  crossdomain: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*'
  }
})

export default {
  async getSession() {
    return _.eq(await EnvService.getCurrent(), EnvService.LOCALHOST)
      ? JSON.parse(
          `${import.meta.env.VITE_SESIONS}`[
            `${import.meta.env.VITE_TESTING_SESSION}`
          ]
        )
      : apiClient.get('/call/getlandsession').then(({ data }) => {
          return data
        })
  }
}
