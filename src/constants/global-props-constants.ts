import type { PropType } from 'vue';

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
        default: null
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
     * Enable/Disable input field
     */
    isDisabled: {
        type: Boolean,
        default: false
    },
    /**
     * The list of Options.
     * ```
     * [{ key: any, isDisabled: boolean }] || Array<string>
     * ```
     */
    options: {
        type: Array as PropType<Array<any>>,
        required: true
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