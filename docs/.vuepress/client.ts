import { defineClientConfig } from '@vuepress/client';
import ADvancedWrapperSelect from '../../src/components/organisms/o-wrapper-select'
import MDropdown from '../../src/components/molecules/m-dropdown'
import MInput from '../../src/components/molecules/m-input'

export default defineClientConfig({
    enhance({ app, router, siteData }) {
        app.component('MInput', MInput);
        app.component('MDropdown', MDropdown);
        app.component('ADvancedWrapperSelect', ADvancedWrapperSelect);
    },
    setup() {},
    rootComponents: [
    ],
});
