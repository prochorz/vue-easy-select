import DefaultTheme from 'vitepress/theme';

import ADvancedWrapperSelect from '../../../src/components/organisms/o-wrapper-select'
import MDropdown from '../../../src/components/molecules/m-dropdown'
import MInput from '../../../src/components/molecules/m-input'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }: any) {
        app.component('MInput', MInput);
        app.component('MDropdown', MDropdown);
        app.component('ADvancedWrapperSelect', ADvancedWrapperSelect);
    }
}