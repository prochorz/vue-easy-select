import type {
    TModelValue,
    ISelectOption
} from '../types/select.type';
import type { SetupContext } from '@vue/runtime-core';

import {
    computed,
    inject,
    provide,
    ref
} from 'vue';

import { isObject } from '../services/data-services';
import { selectInjectionKey } from '../constants/app-constants';

let uidCounter = 0;
function nextUid(prefix: string): string {
    uidCounter += 1;
    return `${prefix}-${uidCounter}`;
}

function useProvide<Props extends Record<string, any>>(props: Readonly<Props>, { emit }: SetupContext) {
    const optionalLocalSearch = ref('');
    const activeIndex = ref(-1);
    const listId = nextUid('vue-easy-select');
    const getOptionId = (index: number) => `${listId}-option-${index}`;

    const localValue = computed<any>({
        get: () => {
            return props.modelValue;
        },
        set(value) {
            /**
             * Emit on change input value
             * @property { String | Array } value
             */
            emit('update:modelValue', value);
        }
    });

    const localSearch = computed({
        get: () => props.searchValue || optionalLocalSearch.value,
        set: (value: string) => {
            optionalLocalSearch.value = value;

            /**
             * Emitted when search changed
             * @property { String } value
             */
            emit('update:searchValue', value);
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
        const isFilterExist = !props.isRemoteSearch && Boolean(localSearch.value);

        const options = normalizeOptions.value.map(option => {
            const isChecked = checkSelectedValue(option[props.keyField]);
            const isDisabled = props.isDisabled || option[props.disabledField] || false;

            return {
                ...option,
                key: `${option[props.keyField]}_${option[props.nameField]}`,
                isChecked,
                [props.disabledField]: isDisabled
            };
        });

        return isFilterExist
            ? options.filter((option: ISelectOption) => {
                const name = option[props.nameField].toLowerCase();
                const value = localSearch.value.toLowerCase();

                return name.includes(value);
            })
            : options;
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

        if (!option[props.disabledField]) {
            localValue.value = newValue;
        }
    }

    function setActiveIndex(index: number) {
        activeIndex.value = index;
    }

    function resetActive() {
        activeIndex.value = -1;
    }

    function moveActive(delta: 1 | -1) {
        const options = localOptions.value;
        const count = options.length;
        if (!count) return;

        let next = activeIndex.value + delta;
        if (next < 0) next = count - 1;
        if (next >= count) next = 0;

        let guard = 0;
        while (options[next][props.disabledField] && guard < count) {
            next = (next + delta + count) % count;
            guard += 1;
        }

        if (!options[next][props.disabledField]) {
            activeIndex.value = next;
        }
    }

    function selectActive() {
        const option = localOptions.value[activeIndex.value];
        if (option && !option[props.disabledField]) {
            selectHandler(option);
        }
    }

    function clearValue() {
        if (props.isDisabled) return;
        localValue.value = props.isMultiple ? [] : '';
    }

    const context = {
        globalProps: props,
        currentState,
        localValue,
        localSearch,
        localOptions,
        normalizeOptions,
        selectHandler,
        checkSelectedValue,
        clearValue,
        activeIndex,
        setActiveIndex,
        resetActive,
        moveActive,
        selectActive,
        listId,
        getOptionId
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
