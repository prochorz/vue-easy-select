import type { PropType } from 'vue';
import {E_SEARCH_POSITION} from "./component-constants";

const singleProps = {
    /**
     * Initial Value
     */
    modelValue: {
        type: [String, Number, Boolean],
        default: ''
    },
    /**
     * Flag for once there is a value it can’t be deselected
     * Only for not Multiple Mode
     */
    isAllowEmpty: {
        type: Boolean,
        default: false
    }
};

const multipleProps = {
    /**
     * Initial Value
     */
    modelValue: {
        type: Array as PropType<Array<any>>,
        default: []
    },
    /**
     * Enable Multiple mod
     */
    isMultiple: {
        type: Boolean,
        default: false
    }
};

const stubProps = {
    /**
     * Initial Value
     */
    modelValue: {
        type: null,
        default: undefined
    },
    /**
     * Flag for once there is a value it can’t be deselected
     * Only for not Multiple Mode
     */
    isAllowEmpty: {
        type: Boolean,
        default: false
    },
    /**
     * Enable Multiple mod
     */
    isMultiple: {
        type: Boolean,
        default: false
    }
}

const componentProps = {
    /**
     * Select name
     */
    name: {
        type: String,
        required: true
    },
    /**
     * Search model Value
     */
    searchPosition: {
        type: String,
        default: E_SEARCH_POSITION.CONTROL,
        validator: (value: E_SEARCH_POSITION) => Object.values(E_SEARCH_POSITION).includes(value)
    },
    /**
     * Search model Value
     */
    searchValue: {
        type: String,
        default: ''
    },
    /**
     * Edited placeholder
     */
    searchPlaceholder: {
        type: String,
        default: ''
    },
    /**
     * Disable filter options by search value
     */
    isRemoteSearch: {
        type: Boolean,
        default: false
    },
    /**
     * Flag for enable search in select
     */
    isSearchable: {
        type: Boolean,
        default: false
    },
    /**
     * Enable/Disable input field
     */
    isDisabled: {
        type: Boolean,
        default: false
    },
    /**
     * Input placeholder text.
     */
    placeholder: {
        type: String,
        default: ''
    },
    /**
     * The list of Options.
     * ```
     * [{ key: any, isDisabled: boolean }] || Array<string>
     * ```
     */
    options: {
        type: Array as PropType<Array<any>>,
        default: []
    },
    /**
     * The unique key for Options items.
     */
    keyField: {
        type: String,
        default: 'id'
    },
    /**
     * The text to display for Options items.
     */
    nameField: {
        type: String,
        default: 'name'
    },
    /**
     * The text to display for Options items.
     */
    disabledField: {
        type: String,
        default: 'disabled'
    }
};

export {
    stubProps,
    singleProps,
    multipleProps,
    componentProps
};