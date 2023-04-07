import { Dropdown } from 'floating-vue';
import DefaultTheme from 'vitepress/theme';
import 'floating-vue/dist/style.css';

import ADvancedWrapperSelect from '../../../src/components/organisms/o-wrapper-select'
import MDropdown from '../../../src/components/molecules/m-dropdown'
import MInput from '../../../src/components/molecules/m-input'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }: any) {
        app.component('VDropdown', Dropdown);
        app.component('MInput', MInput);
        app.component('MDropdown', MDropdown);
        app.component('ADvancedWrapperSelect', ADvancedWrapperSelect);
    }
}