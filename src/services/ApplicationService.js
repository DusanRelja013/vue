import axios from 'axios'
import EnvService from './EnvService'

const apiClient = axios.create({
  baseURL: EnvService.api(),
  withCredentials: false,
  crossdomain: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*'
  }
})

const reqClient = axios.create({
  baseURL: EnvService.req('getfromreq'),
  withCredentials: false,
  crossdomain: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*'
  }
})

const reqDocs = axios.create({
  baseURL: EnvService.req('requirements'),
  withCredentials: false,
  crossdomain: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*'
  }
})
const sandBox = axios.create({
  baseURL: `https://api.sandbox-travelperk.com/travelsafe/restrictions`,
  withCredentials: false,
  crossdomain: true,
  headers: {
    Accept: 'application/json',
    'Api-Version': '1',
    Authorization: 'ApiKey zitIpI.39rt2nCroQgdPYUcqkdTK0NOLpG9NCK7'
  }
})

const smartVel = axios.create({
  baseURL: 'https://api.smartvel.com/v4/',
  withCredentials: false,
  crossdomain: true,
  headers: {
    Accept: 'application/json'
  }
})

export default {
  getCountryByIP() {
    return apiClient.get('web/countrybyip').then(({ data }) => data.result)
  },
  getOffices(locale = 'en') {
    return apiClient
      .get(`web/offices/lang/${locale}`)
      .then(({ data }) => data.result)
  },

  getCountries(locale = 'en') {
    return apiClient
      .get(`web/countries/lang/${locale}`)
      .then(({ data }) => data.result)
  },
  getVisaInfoByNationality(nationality) {
    return apiClient
      .get(`requirements/visasinfobynationality/nationality/${nationality}`)
      .then(({ data }) => data.result)
  },
  getMainServices(destination, officeId, nationality) {
    return apiClient
      .get(
        `products/mainservices/destination/${destination}/office_id/${officeId}/nationality/${nationality}`
      )
      .then(({ data }) => data.result)
  },
  getSecondaryServices(destination, officeId) {
    return apiClient
      .get(
        `products/secondaryservices/destination/${destination}/office_id/${officeId}/lang/en/e_visa/1`
      )
      .then(({ data }) => data.result)
  },
  getRestrictions(destination, origin, date) {
    return sandBox
      .get(
        `?destination=${destination}&destination_type=country_code&origin=${origin}&origin_type=country_code&date=${date}`
      )
      .then(({ data }) => data.result)
  },
  getVisaRequirements(destination, officeId, nationality, lang = 'en') {
    return apiClient
      .get(
        `products/legacygetreq/destination/${destination}/office_id/${officeId}/nationality/${nationality}/lang/${lang}`
      )
      .then(({ data }) => data.result)
  },
  getOriginRestrictions(origin) {
    return apiClient
      .get(`requirements/restrictionsbycountry/origin/${origin}`)
      .then(({ data }) => data.result)
  },
  getDestinationRestrictions(origin, destination) {
    return apiClient
      .get(
        `requirements/detailedrestrictionsbydestination/origin/${origin}/destination/${destination}`
      )
      .then(({ data }) => data.result)
  },
  getBasket(customerId) {
    return apiClient
      .get(`products/basket/customer_id/${customerId}`)
      .then(({ data }) => data.result)
  },
  deleteBasket(customerId) {
    return apiClient
      .delete(`products/basket/customer_id/${customerId}`)
      .then(({ data }) => data.result)
  },
  updateBasket(customerId, data) {
    return apiClient
      .put(`products/basket/customer_id/${customerId}`, data)
      .then(({ data }) => data.result)
  },
  calculateBasket(data) {
    return apiClient
      .post(`products/calculate`, data)
      .then(({ data }) => data.result)
  },
  singleMainService(
    destinationCode,
    officeId,
    nationality,
    visaType,
    entryNumber,
    validity,
    expeditedService,
    eVisa
  ) {
    return apiClient
      .get(
        `products/mainservice/destination/${destinationCode}/office_id/${officeId}/nationality/${nationality}/visa_type/${visaType}/entries_number/${entryNumber}/validity/${validity}/expedited_service/${expeditedService}/e_visa/${eVisa}`
      )
      .then(({ data }) => data.result)
  },
  extensionUpdate(extensionId) {
    return apiClient
      .post(`web/saveaparam/`, { a: extensionId })
      .then(({ data }) => data.result)
  },
  productsIntent(officeId, email, firstName, lastName) {
    return apiClient
      .get(
        `products/intent/office_id/${officeId}/email/${email}/first_name/${firstName}/last_name/${lastName}`
      )
      .then(({ data }) => data.result)
  },
  checkUserProfile(email) {
    return apiClient
      .get(`customers/customer/email/${email}/check_only/true`)
      .then(({ data }) => data.result)
  },
  createOrder(
    customerId,
    transGuid,
    firstName,
    lastName,
    email,
    officeId,
    mainServices,
    secondaryServices
  ) {
    return apiClient
      .post(`products/createorder`, {
        customer_id: customerId,
        trans_guid: transGuid,
        first_name: firstName,
        last_name: lastName,
        email: email,
        office_id: officeId,
        main: mainServices,
        secondary: secondaryServices
      })
      .then(({ data }) => data.result)
  },
  async internalMethod(data, url) {
    const form = new FormData()
    form.append('data', JSON.stringify(data))

    return await fetch(url, {
      method: 'POST',
      body: form
    })
  },
  getLocalSummary(destinationId) {
    return apiClient
      .get(`requirements/retrievelocalsummary/destination/${destinationId}/`)
      .then(({ data }) => data.result)
  },
  getSmartVelRegions(landISOCode) {
    return smartVel
      .get(`regions?key=754376a7-11b0-47bc-b2e2-d25fcee942c3&lang=en`)
      .then(({ data }) => data)
  },
  getSmartVelRegionDetails(regionId, landISOCode) {
    return smartVel
        .get(`regions/${regionId}?key=754376a7-11b0-47bc-b2e2-d25fcee942c3&lang=${landISOCode}`)
        .then(({ data }) => data)
  }
}
