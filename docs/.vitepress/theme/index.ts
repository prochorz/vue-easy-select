import { Dropdown } from 'floating-vue';
import DefaultTheme from 'vitepress/theme';
import 'floating-vue/dist/style.css';

import {
    ADSelect,
    ADControl,
    ADOptions,
    ADWrapper
} from '../../../src';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }: any) {
        app.component('VDropdown', Dropdown);
        app.component('ADSelect', ADSelect);
        app.component('ADControl', ADControl);
        app.component('ADOptions', ADOptions);
        app.component('ADWrapper', ADWrapper);
    }
}