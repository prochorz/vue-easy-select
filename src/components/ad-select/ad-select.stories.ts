import { ref } from "vue";
import { Meta, Story } from "@storybook/vue3";

import AdSelect from './index';
import {E_SEARCH_POSITION} from "../../constants/component-constants";

type TProps = typeof AdSelect.props;

export default {
    title: 'AdSelect',
    component: AdSelect,
    argTypes: {
        isMultiple: { control: { type: 'boolean' } },
        isAllowEmpty: { control: { type: 'boolean' } },
        searchPosition: { control: { type: 'select' }, options: Object.values(E_SEARCH_POSITION) },
    },
} as Meta;

const options = [
    { id: 'Berlin', name: 'Berlin' },
    { id: 'Frankfurt', name: 'Frankfurt' },
    { id: 'Hamburg', name: 'Hamburg' },
    { id: 'Munich', name: 'Munich' },
    { id: 'Chicago', name: 'Chicago' },
    { id: 'Los Angeles', name: 'Los Angeles' },
    { id: 'New York', name: 'New York' },
    { id: 'San Francisco', name: 'San Francisco' },
    { id: 'Kyoto', name: 'Kyoto' },
    { id: 'Osaka', name: 'Osaka' },
    { id: 'Tokyo', name: 'Tokyo' },
    { id: 'Yokohama', name: 'Yokohama' }
];

const defaultArgs = {
    name: 'primary',
    modelValue: undefined,
    placeholder: 'My placeholder',
    options
};

const Template: Story<TProps> = (args) => ({
    components: { AdSelect },
    data: () => ({ args }),
    template: `
      <AdSelect
        v-bind="args"
        v-model="args.modelValue"
        v-model:searchValue="args.searchValue"
      />
    `,
});

export const Base = Object.assign(Template.bind({}), {
    args: {
        ...defaultArgs
    }
});

export const Multiple = Object.assign(Template.bind({}), {
    args: {
        ...defaultArgs,
        isMultiple: true
    }
});

export const Search = Object.assign(Template.bind({}), {
    args: {
        ...defaultArgs,
        searchValue: 'Berlin',
        searchPlaceholder: 'Search',
        isSearchable: true
    }
});

export const EmptyOptions = Object.assign(Template.bind({}), {
    args: {
        ...defaultArgs,
        options: [
            { id: false, name: 'False' },
            { id: null, name: 'Null' },
            { id: 0, name: '0' },
            { id: '', name: '' },
            { id: undefined, name: 'undefined' },
            { id: NaN, name: 'NaN' }
        ]
    }
});
