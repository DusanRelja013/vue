<template>
  <section class="travel-map-navigation-wrapper">
    <img
      v-show="navScroll > 0"
      src="@/assets/images/views/home/map/nav-left.svg"
      alt=""
      class="navigation__arrow left"
      @click="scrollLeftHandler"
    />
    <nav id="map-nav" class="travel-map-navigation" ref="contentNav">
      <p
        class="navigation-item"
        :class="{ active: selectedMap === 'all' }"
        @click="centerMap(5, 46, 0.8, 'all')"
      >
        All
      </p>
      <p
        class="navigation-item"
        :class="{ active: selectedMap === 'africa' }"
        @click="centerMap(34, 8, 1.5, 'africa')"
      >
        Africa
      </p>
      <p
        class="navigation-item"
        :class="{ active: selectedMap === 'asia' }"
        @click="centerMap(134, 34, 1.5, 'asia')"
      >
        Asia
      </p>
      <p
        class="navigation-item"
        :class="{ active: selectedMap === 'caribbean' }"
        @click="centerMap(-78, 21, 1.5, 'caribbean')"
      >
        Caribbean
      </p>
      <p
        class="navigation-item"
        :class="{ active: selectedMap === 'central-america' }"
        @click="centerMap(-85, 12, 1.5, 'central-america')"
      >
        Central America
      </p>
      <p
        class="navigation-item"
        :class="{ active: selectedMap === 'europe' }"
        @click="centerMap(15, 54, 1.5, 'europe')"
      >
        Europe
      </p>
      <p
        class="navigation-item"
        :class="{ active: selectedMap === 'middle-east' }"
        @click="centerMap(42, 29, 1.5, 'middle-east')"
      >
        Middle East
      </p>
      <p
        class="navigation-item"
        :class="{ active: selectedMap === 'north-america' }"
        @click="centerMap(-105, 54, 1.5, 'north-america')"
      >
        North America
      </p>
      <p
        class="navigation-item"
        :class="{ active: selectedMap === 'south-america' }"
        @click="centerMap(-60, -20, 1.5, 'south-america')"
      >
        South America
      </p>
      <p
        class="navigation-item"
        :class="{ active: selectedMap === 'south-pacific' }"
        @click="centerMap(-124, -8, 1.5, 'south-pacific')"
      >
        South Pacific
      </p>
    </nav>
    <img
      src="@/assets/images/views/home/map/nav-right.svg"
      alt=""
      class="navigation__arrow right"
      @click="scrollRightHandler"
    />
  </section>
  <div class="map-wrapper">
    <section class="map-wrapper__spinner">
      <Spinner v-if="showSpinner"></Spinner>
    </section>

    <div
      id="map"
      class="map map-restrictions"
      :class="{ 'fade-map': showSpinner }"
    ></div>
    <RestrictionsDetails
      v-if="showRestrictionDetails"
      :details="destinationDetails"
      :full-vaccinated="fullVaccinated"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ref, onMounted, watch } from 'vue'
import ApplicationService from '../../../../services/ApplicationService'
import RestrictionsDetails from './RestrictionsDetails.vue'
import Spinner from '../../../shared/Spinner.vue'

export default {
  name: 'MapRestrictions',
  components: {
    RestrictionsDetails,
    Spinner
  },
  props: {
    country: {
      type: Object,
      default: null
    },
    fullVaccinated: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const defaultMapFilter = ['in', 'iso_3166_1', 'worldview']
    let isRestrictedISO = []
    let isAllowedISO = []
    let isUnknownISO = []
    let isForbidden = []
    let map = null
    const selectedMap = ref('all')
    const restrictionCountries = ref([])
    const selectedOrigin = ref('')
    const showRestrictionDetails = ref(false)
    const destinationDetails = ref(null)
    const showSpinner = ref(false)
    const contentNav = ref()
    const navScroll = ref(0)

    async function updateMapTravelRestrictions(origin, fullVaccinated) {
      showSpinner.value = true
      await ApplicationService.getOriginRestrictions(origin)
        .then((allCountries) => {
          const countries = {}

          for (let i = 0; i < allCountries.length; i++) {
            if (Object.keys(allCountries[i])[0]) {
              countries[Object.keys(allCountries[i])[0]] = Object.values(
                allCountries[i]
              )[0]
            }
          }
          restrictionCountries.value = countries
          const restricted = []
          const allowed = []
          const unknown = []
          const forbidden = []

          if (fullVaccinated) {
            for (let i = 0; i < allCountries.length; i++) {
              const countryKey = Object.keys(allCountries[i])[0]
              if (
                allCountries[i][countryKey].authorization_status !==
                  'forbidden' &&
                allCountries[i][countryKey].authorization_status !== 'unknown'
              ) {
                allowed.push(countryKey)
              } else if (
                allCountries[i][countryKey].authorization_status === 'forbidden'
              ) {
                forbidden.push(countryKey)
              } else {
                unknown.push(countryKey)
              }
            }
            if (map) {
              isRestrictedISO = defaultMapFilter.concat()
              isAllowedISO = defaultMapFilter.concat(allowed)
              isUnknownISO = defaultMapFilter.concat(unknown)
              isForbidden = defaultMapFilter.concat(forbidden)
              setTimeout(() => {
                map.setFilter('country-boundaries', isAllowedISO)
                map.setFilter('country-boundaries-disabled', isRestrictedISO)
                map.setFilter('country-boundaries-neutral', isUnknownISO)
                map.setFilter('country-boundaries-forbidden', isForbidden)
                showSpinner.value = false
              }, 1000)
            }
          }

          if (!fullVaccinated) {
            for (let i = 0; i < allCountries.length; i++) {
              const countryKey = Object.keys(allCountries[i])[0]
              if (
                allCountries[i][countryKey].authorization_status ===
                'restricted'
              ) {
                restricted.push(countryKey)
              }
              if (
                allCountries[i][countryKey].authorization_status === 'forbidden'
              ) {
                forbidden.push(countryKey)
              }
              if (
                allCountries[i][countryKey].authorization_status === 'allowed'
              ) {
                allowed.push(countryKey)
              }
              if (
                allCountries[i][countryKey].authorization_status === 'unknown'
              ) {
                unknown.push(countryKey)
              }

              isRestrictedISO = defaultMapFilter.concat(restricted)
              isAllowedISO = defaultMapFilter.concat(allowed)
              isUnknownISO = defaultMapFilter.concat(unknown)
              isForbidden = defaultMapFilter.concat(forbidden)

              if (map) {
                setTimeout(() => {
                  map.setFilter('country-boundaries-disabled', isRestrictedISO)
                  map.setFilter('country-boundaries', isAllowedISO)
                  map.setFilter('country-boundaries-neutral', isUnknownISO)
                  map.setFilter('country-boundaries-forbidden', isForbidden)
                  showSpinner.value = false
                }, 1000)
              }
            }
          }
        })
        .finally(() => {
          // showSpinner.value = false
        })
    }

    async function updateFullVaccinatedRestrictions(origin, fullVaccinated) {
      const restricted = []
      const allowed = []
      const unknown = []
      const forbidden = []
      if (fullVaccinated) {
        for (let i = 0; i < restrictionCountries.value.length; i++) {
          const countryKey = Object.keys(restrictionCountries.value[i])[0]
          if (
            restrictionCountries.value[i][countryKey].full_vaccinated === true
          ) {
            allowed.push(countryKey)
          }
          if (
            restrictionCountries.value[i][countryKey].full_vaccinated === false
          ) {
            forbidden.push(countryKey)
          }
        }
        if (map) {
          isRestrictedISO = defaultMapFilter.concat()
          isAllowedISO = defaultMapFilter.concat(allowed)
          isUnknownISO = defaultMapFilter.concat()
          isForbidden = defaultMapFilter.concat(forbidden)
          setTimeout(() => {
            map.setFilter('country-boundaries', isAllowedISO)
            map.setFilter('country-boundaries-disabled', defaultMapFilter)
            map.setFilter('country-boundaries-neutral', defaultMapFilter)
            map.setFilter('country-boundaries-forbidden', isForbidden)
          }, 1000)
        }
      }

      if (!fullVaccinated) {
        for (let i = 0; i < restrictionCountries.value.length; i++) {
          const countryKey = Object.keys(restrictionCountries.value[i])[0]
          if (
            restrictionCountries.value[i][countryKey].authorization_status ===
            'restricted'
          ) {
            restricted.push(countryKey)
          }
          if (
            restrictionCountries.value[i][countryKey].authorization_status ===
            'forbidden'
          ) {
            forbidden.push(countryKey)
          }
          if (
            restrictionCountries.value[i][countryKey].authorization_status ===
            'allowed'
          ) {
            allowed.push(countryKey)
          }
          if (
            restrictionCountries.value[i][countryKey].authorization_status ===
            'unknown'
          ) {
            unknown.push(countryKey)
          }

          isRestrictedISO = defaultMapFilter.concat(restricted)
          isAllowedISO = defaultMapFilter.concat(allowed)
          isUnknownISO = defaultMapFilter.concat(unknown)
          isForbidden = defaultMapFilter.concat(forbidden)

          if (map) {
            setTimeout(() => {
              map.setFilter('country-boundaries-disabled', isRestrictedISO)
              map.setFilter('country-boundaries', isAllowedISO)
              map.setFilter('country-boundaries-neutral', isUnknownISO)
              map.setFilter('country-boundaries-forbidden', isForbidden)
            }, 1000)
          }
        }
      }
    }

    function centerMap(lng, lat, zoom, tab) {
      selectedMap.value = tab
      map.flyTo({
        center: [lng, lat],
        zoom: zoom
      })
    }

    function closeDetailsModal() {
      showRestrictionDetails.value = false
      destinationDetails.value = null
    }

    function scrollLeftHandler() {
      document.querySelector('#map-nav').scrollTo({
        left: 0,
        behavior: 'smooth'
      })
    }

    function scrollRightHandler() {
      document.querySelector('#map-nav').scrollTo({
        left: 1000,
        behavior: 'smooth'
      })
    }

    function doScrollHandler(value) {
      navScroll.value = value.target.scrollLeft
    }

    watch(
      () => props.country,
      () => {
        if (props.country) {
          updateMapTravelRestrictions(
            props.country.code.toLowerCase(),
            props.fullVaccinated
          )
        }
      },
      { immediate: true, deep: true }
    )

    watch(
      () => props.fullVaccinated,
      () => {
        if (props.country) {
          updateMapTravelRestrictions(
            props.country.code.toLowerCase(),
            props.fullVaccinated
          )
        }
      }
    )

    onMounted(() => {
      contentNav.value.addEventListener('scroll', doScrollHandler)
      mapboxgl.accessToken =
        'pk.eyJ1Ijoia3Jpc2F1YnVjaG9uIiwiYSI6ImNpZjVzcWhhaDBhNDZzeWt1MWVmbnZhcjgifQ.aMXr9Q4RmmLY_KzI-LFW5w'
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [5, 46],
        zoom: 0.9
      })
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      })
      map.addControl(new mapboxgl.NavigationControl())
      map.on('load', () => {
        map.setPaintProperty('water', 'fill-color', '#D5F2FE')
        map.addLayer(
          {
            id: 'country-boundaries',
            source: {
              type: 'vector',
              url: 'mapbox://mapbox.country-boundaries-v1'
            },
            'source-layer': 'country_boundaries',
            type: 'fill',
            paint: {
              'fill-color': '#6AA5A5',
              'fill-opacity': 1,
              'fill-outline-color': 'black'
            }
          },
          'country-label'
        )
        map.addLayer(
          {
            id: 'country-boundaries-neutral',
            source: {
              type: 'vector',
              url: 'mapbox://mapbox.country-boundaries-v1'
            },
            'source-layer': 'country_boundaries',
            type: 'fill',
            paint: {
              'fill-color': '#D1D8E9',
              'fill-opacity': 1,
              'fill-outline-color': 'black'
            }
          },
          'country-label'
        )
        map.addLayer(
          {
            id: 'country-boundaries-disabled',
            source: {
              type: 'vector',
              url: 'mapbox://mapbox.country-boundaries-v1'
            },
            'source-layer': 'country_boundaries',
            type: 'fill',
            paint: {
              'fill-color': '#CDD889',
              'fill-opacity': 1,
              'fill-outline-color': 'black'
            }
          },
          'country-label'
        )
        map.addLayer(
          {
            id: 'country-boundaries-forbidden',
            source: {
              type: 'vector',
              url: 'mapbox://mapbox.country-boundaries-v1'
            },
            'source-layer': 'country_boundaries',
            type: 'fill',
            paint: {
              'fill-color': '#FF94A2',
              'fill-opacity': 1,
              'fill-outline-color': 'black'
            }
          },
          'country-label'
        )

        let selectedCountry = ''

        map.on('mousemove', function (e) {
          let layerId = ''
          let key = ''
          let status = ''
          let title = ''
          let statusStyle = ''
          const features = map.queryRenderedFeatures(e.point, {
            layers: [
              'country-boundaries',
              'country-boundaries-neutral',
              'country-boundaries-disabled',
              'country-boundaries-forbidden'
            ]
          })
          if (features && features[0]?.layer) {
            if (features[0].properties.iso_3166_1 !== selectedCountry) {
              selectedCountry = features[0].properties.iso_3166_1
              layerId = features[0].layer.id
              if (layerId === 'country-boundaries') {
                statusStyle = 'description-available'
              }
              if (layerId === 'country-boundaries-disabled') {
                statusStyle = 'description-unavailable'
              }
              if (layerId === 'country-boundaries-forbidden') {
                statusStyle = 'description-forbidden'
              }
              if (layerId === 'country-boundaries-neutral') {
                statusStyle = 'description-unknown'
              }
              key = features[0].properties.iso_3166_1
              if (layerId && key) {
                let fullVaccinatedStatus
                if (props.fullVaccinated) {
                  if (
                    restrictionCountries.value[key].authorization_status ===
                      'allowed' ||
                    restrictionCountries.value[key].authorization_status ===
                      'restricted'
                  ) {
                    fullVaccinatedStatus = 'allowed'
                  }
                  if (
                    restrictionCountries.value[key].authorization_status ===
                    'forbidden'
                  ) {
                    fullVaccinatedStatus = 'forbidden'
                  }
                  if (
                    restrictionCountries.value[key].authorization_status ===
                    'unknown'
                  ) {
                    fullVaccinatedStatus = 'unknown'
                  }
                }
                status = props.fullVaccinated
                  ? fullVaccinatedStatus
                  : restrictionCountries.value[key].authorization_status
                title = features[0].properties.name_en
                const message = restrictionCountries.value[key].summary
                const vaccination = restrictionCountries.value[key].vaccination
                  ? '<div class="item"><img src="/images/views/home/map/heart-add.svg" alt="" class="item-icon"><h4 class="item-title">' +
                    restrictionCountries.value[key].vaccination +
                    '</h4></div>'
                  : ''
                const quarantineRequired = restrictionCountries.value[key]
                  .quarantine_required
                  ? '<div class="item"><img src="/images/views/home/map/home-2.svg" alt="" class="item-icon"><h4 class="item-title">' +
                    restrictionCountries.value[key].quarantine_required +
                    '</h4></div>'
                  : ''
                const testMedicalCertificate = restrictionCountries.value[key]
                  .test_medical_certificate
                  ? '<div class="item"><img src="/images/views/home/map/receipt-item.svg" alt="" class="item-icon"><h4 class="item-title">' +
                    restrictionCountries.value[key].test_medical_certificate +
                    '</h4></div>'
                  : ''
                const testingOnArrival = restrictionCountries.value[key]
                  .testing_on_arrival
                  ? '<div class="item"><img src="/images/views/home/map/arival.svg" alt="" class="item-icon"><h4 class="item-title">' +
                    restrictionCountries.value[key].testing_on_arrival +
                    '</h4></div>'
                  : ''
                const otherMedicalMeasue = restrictionCountries.value[key]
                  .other_medical_measue
                  ? '<div class="item"><img src="/images/views/home/map/heart-add.svg" alt="" class="item-icon"><h4 class="item-title">' +
                    restrictionCountries.value[key].other_medical_measue +
                    '</h4></div>'
                  : ''
                const additionalDocumentation = restrictionCountries.value[key]
                  .additional_documentation
                  ? '<div class="item"><img src="/images/views/home/map/archive-tick.svg" alt="" class="item-icon"><h4 class="item-title">' +
                    restrictionCountries.value[key].additional_documentation +
                    '</h4></div>'
                  : ''

                popup
                  .setLngLat(e.lngLat)
                  .trackPointer()
                  .setHTML(
                    '<section class="map-popup"> ' +
                      '<div class="map-popup-header">' +
                      '<div class="header-title">' +
                      title +
                      '</div>' +
                      '<p class="header-description' +
                      ' ' +
                      statusStyle +
                      '">' +
                      status +
                      '</p>' +
                      '</div>' +
                      '<div class="map-popup-content">' +
                      '<h4 class="content-title">' +
                      message +
                      '</h4>' +
                      '<div class="content-items">' +
                      vaccination +
                      quarantineRequired +
                      testMedicalCertificate +
                      testingOnArrival +
                      otherMedicalMeasue +
                      additionalDocumentation +
                      '</div>' +
                      '</div>' +
                      '</section>'
                  )
                  .addTo(map)
              }
            }
          } else {
            popup.remove()
            selectedCountry = ''
          }
        })
      })
      map.on(
        'click',
        [
          'country-boundaries',
          'country-boundaries-disabled',
          'country-boundaries-neutral',
          'country-boundaries-forbidden'
        ],
        function (e) {
          const features = map.queryRenderedFeatures(e.point, {
            layers: [
              'country-boundaries',
              'country-boundaries-disabled',
              'country-boundaries-neutral',
              'country-boundaries-forbidden'
            ]
          })
          if (features.length) {
            const countryCode = features[0]?.properties.iso_3166_1
            destinationDetails.value = restrictionCountries.value[countryCode]
            destinationDetails.value.destinationName =
              features[0]?.properties.name_en
            destinationDetails.value.origin = props.country.name
            if (destinationDetails.value) {
              showRestrictionDetails.value = true
            }
          }
        }
      )

      map.scrollZoom.disable()
    })

    return {
      selectedMap,
      isRestrictedISO,
      isAllowedISO,
      isUnknownISO,
      showSpinner,
      restrictionCountries,
      selectedOrigin,
      showRestrictionDetails,
      destinationDetails,
      contentNav,
      navScroll,
      centerMap,
      closeDetailsModal,
      scrollLeftHandler,
      scrollRightHandler
    }
  }
}
</script>

<style scoped></style>
