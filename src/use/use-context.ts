import {
    computed,
    reactive,
    inject, provide, ref} from 'vue';

import type {SetupContext, } from "@vue/runtime-core";

import { isObject } from '../services/data-services';
import { selectInjectionKey } from '../constants/app-constants';

function useProvide<Props extends Record<string, any>>(props: Readonly<Props>, { emit }: SetupContext) {
    function checkSelectedValue(value: any) {
        return localValue.value === value;
    }

    const localValue = computed({
        get: () => props.modelValue,
        set(value) {
            /**
             * Emit on change input value
             * @property { String } value
             */
            emit('update:modelValue', value);
        }
    });

    const normalizeOptions = computed<Array<any>>(() => {
        const isOptionObject = isObject(props.options[0]);
        return props.options.map((item: any) => {
            return isOptionObject
                ? item
                : {
                    [props.keyField]: item,
                    [props.nameField]: item
                };
        });
    });

    const localOptions = computed(() => {
        return normalizeOptions.value.map(option => {
            const isChecked = checkSelectedValue(option[props.keyField]);
            const isDisabled = props.isDisabled || option[props.disabledField];

            return {
                ...option,
                isChecked,
                [props.disabledField]: isDisabled
            };
        });
    });

    const context = {
        globalProps: props,
        localValue,
        localOptions,
        checkSelectedValue
    };

    provide(selectInjectionKey, context);

    return context;
}

function useInject() {
    return inject(selectInjectionKey) as ReturnType<typeof useProvide>;
}

export {
    useInject,
    useProvide
};
