import DefaultTheme from 'vitepress/theme';

import {
    VueEasySelect,
    VueEasyControl,
    VueEasyOptions,
    VueEasyWrapper
} from '../../../src';

import DemoCard from './components/DemoCard.vue';

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }: any) {
        app.component('VueEasySelect', VueEasySelect);
        app.component('VueEasyControl', VueEasyControl);
        app.component('VueEasyOptions', VueEasyOptions);
        app.component('VueEasyWrapper', VueEasyWrapper);
        app.component('DemoCard', DemoCard);

        if (typeof window !== 'undefined') {
            const { Dropdown } = await import('floating-vue');
            await import('floating-vue/dist/style.css');
            app.component('VDropdown', Dropdown);
        }
    }
}
