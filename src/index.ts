import type { App } from 'vue'

import VueEasyControl from './components/vue-easy-control'
import VueEasyOptions from './components/vue-easy-options'
import VueEasyWrapper from './components/vue-easy-wrapper'
import VueEasySelect from './components/vue-easy-select'

const components = {
    VueEasyControl,
    VueEasyOptions,
    VueEasyWrapper,
    VueEasySelect
}

function install(app: App) {
    for (const [name, component] of Object.entries(components)) {
        app.component(name, component)
    }
}

export {
    install,
    VueEasyControl,
    VueEasyOptions,
    VueEasyWrapper,
    VueEasySelect
}

export default { install }
