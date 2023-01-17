/* eslint-disable*/

import _ from 'lodash';

const ENVIRONMENT = _.first(window.location.hostname.split('.'))
const LOCALHOST = 'localhost'
const DEV = 'dev'
const TEST = 'test'
const DEMO = 'demo'
const PRODUCTION = 'production'

export default {
    ENVIRONMENT,
    LOCALHOST,
    DEV,
    TEST,
    DEMO,
    PRODUCTION,

    api() {
        if (typeof VIS_API2_URL !== 'undefined' && typeof VIS_API2_KEY !== 'undefined') {
            return `${VIS_API2_URL}${VIS_API2_KEY}`
        }



        return _.includes([LOCALHOST, DEV], ENVIRONMENT)
            ? `${import.meta.env.VITE_DEV_API}/${import.meta.env.VITE_DEV_API_KEY}`
            : _.eq(ENVIRONMENT, TEST)
                ? `${import.meta.env.VITE_TEST_API}/${import.meta.env.VITE_TEST_API_KEY}`
                : _.eq(ENVIRONMENT, DEMO)
                    ? `${import.meta.env.VITE_DEMO_API}/${import.meta.env.VITE_DEMO_API_KEY}`
                    : `${import.meta.env.VITE_PROD_API}/${import.meta.env.VITE_PROD_API_KEY}`
    },

    bo() {
        if (typeof VIS_BO_URL !== 'undefined') {
            return `${VIS_BO_URL}`
        }
        return _.includes([LOCALHOST, DEV], ENVIRONMENT)
            ? `${import.meta.env.VITE_DEV_BO}`
            : _.eq(ENVIRONMENT, TEST)
                ? `${import.meta.env.VITE_TEST_BO}`
                : _.eq(ENVIRONMENT, DEMO)
                    ? `${import.meta.env.VITE_DEMO_BO}`
                    : `${import.meta.env.VITE_PROD_BO}`
    },

    req(endpoint) {
        if (typeof VIS_REQ_URL !== 'undefined' && typeof VIS_REQ_KEY !== 'undefined') {
            return `${VIS_REQ_URL}api/${endpoint}/${VIS_REQ_KEY}`
        }
        return _.includes([LOCALHOST, DEV, TEST], ENVIRONMENT)
            ? `${import.meta.env.VITE_REQ_DEV_API}/${endpoint}/${import.meta.env.VITE_REQ_DEV_API_KEY}`
            : `${import.meta.env.VITE_REQ_API}/${endpoint}/${import.meta.env.VITE_REQ_API_KEY}`
    },

    getCurrent() {
        if (typeof VIS_ENV !== 'undefined') {
            return `${VIS_ENV}`
        }
        return _.includes([LOCALHOST, DEV, TEST], ENVIRONMENT)
            ? ENVIRONMENT
            : PRODUCTION
    }
}
