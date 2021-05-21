class Constants {
    METHOD_SIGNATURES = {
        SEARCH: '/search/service',
        CONFIRM: '/confirm/service',
        UPDATE: '/on-update/service',
    }

    CONSENT_MANAGEMENT_API_PATHS = {
        V_1_CARE_CONTEXTS_ON_DISCOVER: {
            method: 'post',
            path: '/care-contexts/on-discover'
        },
        V_1_CARE_CONTEXTS_DISCOVER: {
            method: 'post',
            path: '/care-contexts/discover'
        },
        V_1_LINKS_LINK_HIP_INIT: {
            method: 'post',
            path: '/hip-links/link/init'
        },
        V_1_LINKS_LINK_HIP_ON_INIT: {
            method: 'post',
            path: '/hip-links/link/on-init'
        },
        V_1_LINKS_LINK_HIP_CONFIRM: {
            method: 'post',
            path: '/hip-links/link/confirm'
        },
        V_1_LINKS_LINK_HIP_ON_CONFIRM: {
            method: 'post',
            path: '/hip-links/link/on-confirm'
        },
        V_1_LINKS_LINK_CM_INIT: {
            method: 'post',
            path: '/cm-links/link/init'
        },
        V_1_LINKS_LINK_CM_ON_INIT: {
            method: 'post',
            path: '/cm-links/link/on-init'
        },
        V_1_LINKS_LINK_CM_CONFIRM: {
            method: 'post',
            path: '/cm-links/link/confirm'
        },
        V_1_LINKS_LINK_CM_ON_CONFIRM: {
            method: 'post',
            path: '/cm-links/link/on-confirm'
        },
        V_1_CONSENT_REQUESTS_INIT: {
            method: 'post',
            path: '/consent-requests/init'
        },
        V_1_CONSENT_REQUESTS_ON_INIT: {
            method: 'post',
            path: '/consent-requests/on-init'
        },
        V_1_CONSENTS_FETCH: {
            method: 'post',
            path: '/consents/fetch'
        },
        V_1_CONSENTS_ON_FETCH: {
            method: 'post',
            path: '/consents/on-fetch'
        },
        V_1_CONSENTS_HIP_NOTIFY: {
            method: 'post',
            path: '/consents/hip/notify'
        },
        V_1_CONSENTS_HIP_ON_NOTIFY: {
            method: 'post',
            path: '/consents/hip/on-notify'
        },
        V_1_CONSENTS_HIU_NOTIFY: {
            method: 'post',
            path: '/consents/hiu/notify'
        },
        V_1_PATIENTS_FIND: {
            method: 'post',
            path: '/patients/find'
        },
        V_1_PATIENTS_ON_FIND: {
            method: 'post',
            path: '/patients/on-find'
        },
        V_1_HEALTH_INFORMATION_CM_REQUEST: {
            method: 'post',
            path: '/health-information/cm/request'
        },
        V_1_HEALTH_INFORMATION_CM_ON_REQUEST: {
            method: 'post',
            path: '/health-information/cm/on-request'
        },
        V_1_HEALTH_INFORMATION_HIP_REQUEST: {
            method: 'post',
            path: '/health-information/hip/request'
        },
        V_1_HEALTH_INFORMATION_NOTIFY: {
            method: 'post',
            path: '/health-information/notify'
        },
        V_1_HEALTH_INFORMATION_HIP_ON_REQUEST: {
            method: 'post',
            path: '/health-information/hip/on-request'
        }
    }

    CONSENT_MANAGEMENT_API_FORWARD_PATHS = {
        V_1_CARE_CONTEXTS_ON_DISCOVER: {
            method: 'post',
            path: '/care-contexts/on-discover'
        },
        V_1_CARE_CONTEXTS_DISCOVER: {
            method: 'post',
            path: '/care-contexts/discover'
        },
        V_1_LINKS_LINK_HIP_INIT: {
            method: 'post',
            path: '/hip-links/link/init'
        },
        V_1_LINKS_LINK_HIP_ON_INIT: {
            method: 'post',
            path: '/hip-links/link/on-init'
        },
        V_1_LINKS_LINK_HIP_CONFIRM: {
            method: 'post',
            path: '/hip-links/link/confirm'
        },
        V_1_LINKS_LINK_HIP_ON_CONFIRM: {
            method: 'post',
            path: '/hip-links/link/on-confirm'
        },
        V_1_LINKS_LINK_CM_INIT: {
            method: 'post',
            path: '/cm-links/link/init'
        },
        V_1_LINKS_LINK_CM_ON_INIT: {
            method: 'post',
            path: '/cm-links/link/on-init'
        },
        V_1_LINKS_LINK_CM_CONFIRM: {
            method: 'post',
            path: '/cm-links/link/confirm'
        },
        V_1_LINKS_LINK_CM_ON_CONFIRM: {
            method: 'post',
            path: '/cm-links/link/on-confirm'
        },
        V_1_CONSENT_REQUESTS_INIT: {
            method: 'post',
            path: '/consent-requests/init'
        },
        V_1_CONSENT_REQUESTS_ON_INIT: {
            method: 'post',
            path: '/consent-requests/on-init'
        },
        V_1_CONSENTS_FETCH: {
            method: 'post',
            path: '/consents/fetch'
        },
        V_1_CONSENTS_ON_FETCH: {
            method: 'post',
            path: '/consents/on-fetch'
        },
        V_1_CONSENTS_HIP_NOTIFY: {
            method: 'post',
            path: '/consents/hip/notify'
        },
        V_1_CONSENTS_HIP_ON_NOTIFY: {
            method: 'post',
            path: '/consents/hip/on-notify'
        },
        V_1_CONSENTS_HIU_NOTIFY: {
            method: 'post',
            path: '/consents/hiu/notify'
        },
        V_1_PATIENTS_FIND: {
            method: 'post',
            path: '/patients/find'
        },
        V_1_PATIENTS_ON_FIND: {
            method: 'post',
            path: '/patients/on-find'
        },
        V_1_HEALTH_INFORMATION_CM_REQUEST: {
            method: 'post',
            path: '/health-information/cm/request'
        },
        V_1_HEALTH_INFORMATION_CM_ON_REQUEST: {
            method: 'post',
            path: '/health-information/cm/on-request'
        },
        V_1_HEALTH_INFORMATION_HIP_REQUEST: {
            method: 'post',
            path: '/health-information/hip/request'
        },
        V_1_HEALTH_INFORMATION_NOTIFY: {
            method: 'post',
            path: '/health-information/notify'
        },
        V_1_HEALTH_INFORMATION_HIP_ON_REQUEST: {
            method: 'post',
            path: '/health-information/hip/on-request'
        }
    }

}

export default new Constants();