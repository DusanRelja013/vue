<template>
  <nav class="travel-map-navigation">
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
  <div class="map-wrapper">
    <section class="map-wrapper__spinner">
      <Spinner v-if="showSpinner"></Spinner>
    </section>
    <div id="map" class="map" :style="[ showSpinner ? { opacity: 0} : { opacity: 1 }]"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ref, onMounted, watch } from 'vue'
import ApplicationService from '../../../../services/ApplicationService'
import Spinner from '../../../shared/Spinner.vue'

export default {
  name: 'MapVisas',
  components: {
    Spinner
  },
  props: {
    country: {
      type: Object,
      default: null
    },
    code: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const defaultMapFilter = ['in', 'iso_3166_1_alpha_3', 'worldview']
    let visaIsRequiredISO = []
    let visaNotRequiredISO = []
    let visaMayBeRequiredISO = []
    let map = null
    const selectedMap = ref('all')
    const showSpinner = ref(false)

    async function updateMapTravelVisa(countryCode) {
      showSpinner.value = true
      await ApplicationService.getVisaInfoByNationality(countryCode).then(
        (allNationality) => {
          const requiredVisa = []
          const notRequiredVisa = []
          const maybeRequiredVisa = []
          for (let i = 0; i < allNationality.length; i++) {
            if (allNationality[i].VisaRequired === true) {
              requiredVisa.push(allNationality[i].Iso)
            }
            if (
              allNationality[i].VisaRequired === false &&
              allNationality[i].VisaMayBeRequired !== true
            ) {
              notRequiredVisa.push(allNationality[i].Iso)
            }
            if (allNationality[i].VisaMayBeRequired === true
            ) {
              maybeRequiredVisa.push(allNationality[i].Iso)
            }
          }
          visaIsRequiredISO = defaultMapFilter.concat(requiredVisa)
          visaNotRequiredISO = defaultMapFilter.concat(notRequiredVisa)
          visaMayBeRequiredISO = defaultMapFilter.concat(maybeRequiredVisa)
          if (map) {
            setTimeout(() => {
              map.setFilter('country-boundaries-disabled', visaIsRequiredISO)
              map.setFilter('country-boundaries', visaNotRequiredISO)
              map.setFilter('country-boundaries-neutral', visaMayBeRequiredISO)
              showSpinner.value = false
            }, 1000)
          }
        }
      ).finally(() => {
       // showSpinner.value = false;
      })
    }

    function centerMap(lng, lat, zoom, tab) {
      selectedMap.value = tab
      map.flyTo({
        center: [lng, lat],
        zoom: zoom
      })
    }

    watch(
      () => props.country,
      () => {
        if (props.country) {
          updateMapTravelVisa(props.country.code.toLowerCase())
        }
      },
      { immediate: true, deep: true }
    )

    onMounted(() => {
      mapboxgl.accessToken =
        'pk.eyJ1Ijoia3Jpc2F1YnVjaG9uIiwiYSI6ImNpZjVzcWhhaDBhNDZzeWt1MWVmbnZhcjgifQ.aMXr9Q4RmmLY_KzI-LFW5w'
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [5, 46],
        zoom: .9
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
              'fill-color': '#ffd154',
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
              'fill-color': '#F4DAA3',
              'fill-opacity': 1,
              'fill-outline-color': 'black'
            }
          },
          'country-label'
        )
        let selectedCountry = ''
        map.on('mousemove', function (e) {
          const features = map.queryRenderedFeatures(e.point, {
            layers: [
              'country-boundaries',
              'country-boundaries-disabled',
              'country-boundaries-neutral'
            ]
          })
          let layerId = ''
          let message = ''
          let title = ''
          let statusStyle = ''
          if (features && features[0]?.layer) {
            if (features[0].properties.iso_3166_1 !== selectedCountry) {
              selectedCountry = features[0].properties.iso_3166_1
              layerId = features[0].layer.id
              title = features[0].properties.name_en
              if (layerId) {
                if (layerId === 'country-boundaries') {
                  message = 'Travel visa is not required'
                  statusStyle = 'visa-content-image-not-required'
                }
                if (layerId === 'country-boundaries-disabled') {
                  message = 'Travel visa is required'
                  statusStyle = 'visa-content-image-required'
                }
                if (layerId === 'country-boundaries-neutral') {
                  message = 'Travel visa may be required'
                  statusStyle = 'visa-content-image-not-required'
                }
                popup
                    .setLngLat(e.lngLat)
                    .trackPointer()
                    .setHTML(
                        '<section class="map-visa"> ' +
                        '<div class="map-visa-header">' +
                        '<div class="header-title">' +
                        title +
                        '</div>' +
                        '</div>' +
                        '<div class="map-visa-content">' +
                        '<div class="visa-content">' +
                        '<div class="visa-content-image' +
                        ' ' +
                        statusStyle +
                        '">' +
                        '<img src="/images/shared/ok-white.svg"  />' +
                        '</div>' +
                        '<p class="visa-content-text">' + message + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</section>'
                    )
                    .addTo(map)
              }
            }

          } else {
            popup.remove()
            selectedCountry =''
          }
        })
      })

      map.scrollZoom.disable()
    })

    return {
      showSpinner,
      selectedMap,
      centerMap
    }
  }
}
</script>

<style scoped></style>
