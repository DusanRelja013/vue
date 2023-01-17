<template>
  <section class="mass-market-datepicker">
    <Datepicker
        v-model="date"
        :format="format"
        type="date"
        :placeholder="placeholder"
        range
        :enableTimePicker="false"
        autoApply
        :disabled="disabled"
        :minDate="minDate"
        @update:modelValue="dateHandler"
    ></Datepicker>
    <span v-if="floatingLabel" class="floating-label">{{ floatingLabelText }}</span>
    <img v-if="invalidData" src="@/assets/images/elements/select/info-invalid.svg" alt="invalid" class="invalid-data">
  </section>

</template>

<script>
import { ref, watch, computed } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useApplicationStore } from '../../stores/Application'

export default {
  name: 'DatePickerC',
  components: { Datepicker },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Object, Array, Number, Date],
      default: ''
    },
    shortFormat: {
      type: Boolean,
      default: false
    },
    minDate: {
      type: Date,
      default: null
    },
    floatingLabel: {
      type: Boolean,
      default: false
    },
    floatingLabelText: {
      type: Boolean,
      default: ''
    },
    invalidData: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const date = ref()
    const ApplicationStore = useApplicationStore()
    const format = ref('dd.MM.yyyy')

    const selectedOffice = computed(function () {
      return ApplicationStore.getSelectedOffice
    })

    watch(
      () => props.value,
      () => {
        date.value = props.value
      },
      { immediate: true }
    )

    function checkDateFormat(id) {
      if (id === 232) {
        return 'dd/MM/yyyy'
      }
      if (props.shortFormat) {
        return 'dd.MM'
      }
      return 'dd.MM.yyyy'
    }

    watch(
      selectedOffice,
      () => {
        if (selectedOffice.value) {
          format.value = checkDateFormat(selectedOffice.value.cid)
        }
      },
      { immediate: true, deep: true }
    )

    const dateHandler = (modelData) => {
      date.value = modelData
      context.emit('handleValue', date.value)
    }

    return { date, format, dateHandler }
  }
}
</script>
