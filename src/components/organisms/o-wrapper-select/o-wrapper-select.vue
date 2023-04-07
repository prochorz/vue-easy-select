<template>
    <slot />
</template>

<script lang="ts">
import type { PropType } from 'vue';

import { defineComponent } from 'vue';

import { useProvide } from '../../../use/use-context';
export default defineComponent({
    name: 'OWrapperSelect',
    props: {
        /**
         * Initial Value
         */
        modelValue: {
            type: [String, Number, Boolean, Array] as PropType<any>,
            default: ''
        },
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
        },
        /**
         * Flag for once there is a value it can’t be deselected
         * Only for not Multiple Mode
         */
        isAllowEmpty: {
            type: Boolean,
            default: false
        }
    },
    setup(props, ctx) {
        const { globalProps } = useProvide<typeof props>(props, ctx);

        return {
            globalProps
        };
    }
})
</script>
