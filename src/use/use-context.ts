import type {
    TModelValue,
    ISelectOption
} from '../types/select.type';
import type { SetupContext } from '@vue/runtime-core';

import {
    computed,
    inject,
    provide
} from 'vue';

import { isObject } from '../services/data-services';
import { selectInjectionKey } from '../constants/app-constants';

function useProvide<Props extends Record<string, any>>(props: Readonly<Props>, { emit }: SetupContext) {

    const localValue = computed({
        get: () => props.modelValue,
        set(value) {
            /**
             * Emit on change input value
             * @property { String | Array } value
             */
            emit('update:modelValue', value);
        }
    });

    function checkSelectedValue(value: any) {
        return props.isMultiple
            ? (localValue.value as Array<TModelValue>).includes(value)
            : localValue.value === value;
    }

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

    const currentState = computed(() => {
        if (props.isMultiple) {
            return normalizeOptions.value.filter(item => checkSelectedValue(item[props.keyField]));
        }

        return normalizeOptions.value.find(item => checkSelectedValue(item[props.keyField]));
    });

    function selectHandler(option: ISelectOption) {
        const newOptionValue = option[props.keyField];
        const isSelected = checkSelectedValue(newOptionValue);
        let newValue = isSelected && props.isAllowEmpty ? '' : newOptionValue;

        if (props.isMultiple) {
            if (isSelected) {
                newValue = (localValue.value as Array<TModelValue>).filter(item => item !== newOptionValue);
            } else {
                newValue = [...localValue.value as Array<TModelValue>, newOptionValue];
            }
        }

        if (!option.isDisabled) {
            localValue.value = newValue;
        }
    }

    const context = {
        globalProps: props,
        currentState,
        localValue,
        localOptions,
        normalizeOptions,
        selectHandler,
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
