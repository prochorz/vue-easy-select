<template>
    <ALabel
        v-if="label"
        :label="label"
        :for="name"
        :size="size"
        :additional-label="additionalLabel"
        :tooltip-label-message="tooltipLabelMessage"
    />
    <MDropdownWrapper
        v-model="isShow"
        v-bind="$attrs"
        :is-auto-size="true"
        :placement="openDirection"
        :is-disabled="isLocalDisabled"
        :is-autofocus="!isSearchable"
        :class="sizeClass"
        :popper-class="['a-select-dropdown', sizeClass]"
        :at-a-select="atAttribute"
        class="a-select select"
        @dropdownApplyShow="handleShow"
        @dropdownHide="handleHide"
    >
        <div
            :class="[openClass, errorClass, emptyClass, disabledClass]"
            class="select__control"
        >
            <select
                v-show="false"
                :id="name"
                v-model="localValue"
                :multiple="isMultiple"
                :disabled="isDisabled"
            >
                <option
                    v-for="option in localOptions"
                    :key="option[keyField]"
                    :value="option[keyField]"
                    :disabled="option.isDisabled"
                >
                    {{ option[nameField] }}
                </option>
            </select>
            <div class="select__control-inert">
                <template v-if="!isEmptyValue">
                    <div
                        v-if="isMultiple"
                        class="select__tag-wrapper"
                    >
                        <div
                            v-for="option in multipleTags"
                            :key="option[keyField]"
                            class="select__tag-item"
                            @click.stop
                        >
                            <AIcon
                                v-if="option[iconField]"
                                :name="option[iconField]"
                                :is-original="false"
                                width="12"
                                height="12"
                                class="select__control-icon"
                            />
                            <div class="select__tag-item-name">
                                {{ option[nameField] }}
                            </div>
                            <AIcon
                                :is-original="false"
                                width="12"
                                height="12"
                                name="icons/cross"
                                class="select__tag-item-close"
                                @click="selectHandler(option)"
                            />
                        </div>
                    </div>
                    <template v-else>
                        <AIcon
                            v-if="localIconState"
                            :name="localIconState"
                            :is-original="false"
                            height="12"
                            width="12"
                            class="select__control-icon"
                        />
                        <div class="select__control-content">
                            <span class="select__control-title">
                                {{ localState }}
                            </span>
                            <span
                                v-if="localSuffixState"
                                class="select__control-suffix"
                            >
                                {{ localSuffixState }}
                            </span>
                        </div>
                    </template>
                </template>
                <template v-else>
                    <div class="select__control-content">
                        <span class="select__control-title">
                            {{ placeholder }}
                        </span>
                    </div>
                </template>
            </div>
            <ALoader
                v-if="isLoading"
                size="small"
            />
            <AIcon
                v-else-if="!isDisabled"
                :width="iconsSize"
                :height="iconsSize"
                :is-original="false"
                :direction="arrowDirection"
                name="icons/select-arrow"
                class="select__control-icon select__control-icon--arrow"
            />
        </div>
        <div
            v-if="errorMessageText"
            :class="descriptionErrorClass"
            class="select__control-description"
        >
            {{ errorMessageText }}
        </div>
        <template #popper>
            <div
                v-if="isFetching"
                class="select__overlay"
            >
                <ALoader size="small" />
            </div>
            <div
                v-if="isSearchableExist"
                class="select__search-wrapper"
            >
                <AIcon
                    v-if="!isSmallSize"
                    :is-original="false"
                    name="icons/search"
                    height="12"
                    width="12"
                    class="select__search-icon"
                />
                <input
                    ref="refSearch"
                    v-model="localSearch"
                    :placeholder="searchPlaceholder"
                    type="text"
                    class="select__search"
                />
            </div>
            <div
                v-if="localOptions.length"
                class="select__item-list"
            >
                <div
                    v-for="option in localOptions"
                    :key="option[keyField]"
                    v-close-popper="!isMultiple"
                    :class="option.localClass"
                    class="select__control"
                    @click="selectHandler(option)"
                >
                    <div class="select__control-inert">
                        <AIcon
                            v-if="option[iconField]"
                            :name="option[iconField]"
                            :is-original="false"
                            width="12"
                            height="12"
                            class="select__control-icon"
                        />
                        <div class="select__control-content">
                            <span class="select__control-title">
                                {{ option[nameField] }}
                            </span>
                            <span
                                v-if="option[suffixField]"
                                class="select__control-suffix"
                            >
                                {{ option[suffixField] }}
                            </span>
                        </div>
                    </div>
                    <AIcon
                        v-if="option.isChecked"
                        :width="iconsSize"
                        :height="iconsSize"
                        :is-original="false"
                        name="icons/check"
                        class="select__control-icon select__control-icon--check"
                    />
                </div>
            </div>
            <div
                v-if="isEmptyList"
                class="select__control select__control-not-found"
            >
                <div class="select__control-inert">
                    <div class="select__control-content">
                        <span class="select__control-title">
                            {{ notFoundLabel }}
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </MDropdownWrapper>
</template>

<script lang="ts">
import type { PropType } from 'vue';

import {
    ref,
    nextTick,
    computed,
    onMounted,
    defineComponent
} from 'vue';
import { VClosePopper } from 'floating-vue';

import AIcon from '../a-icon';
import ALabel from '../a-label';
import ALoader from '../a-loader';
import MDropdownWrapper from '../../molecules/m-dropdown-wrapper';

import {
    isObject,
    isEmptyString
} from '../../../services/utils-service';
import { generateId } from '../../../services/utils-service';
import { E_FIELDS } from '../../../constants/fields-constants';
import { E_TOOLTIP_DIRECTIONS } from '../../../constants/tooltip-constants';
import { E_SELECT_SIZE_MAP } from '../../../constants/elements-size-constants';
import { E_ICON_DIRECTIONS } from '../../../constants/placement-direction-constants';

type TSelectOption = string|number;

interface ISelectOption {
    isDisabled?: boolean,
    [key: string]: any
}

type TModelValue = string | number | boolean;

export default defineComponent({
    name: 'ASelect',
    components: {
        AIcon,
        ALabel,
        ALoader,
        MDropdownWrapper
    },
    directives: {
        'close-popper': VClosePopper
    },
    inheritAttrs: false,
    props: {
        /**
         * Initial Value
         */
        modelValue: {
            type: [String, Number, Boolean, Array] as PropType<TModelValue | Array<TModelValue>>,
            default: ''
        },
        /**
         * Search model Value
         */
        searchValue: {
            type: String,
            default: ''
        },
        /**
         * Default value Name for exclude option
         */
        defaultValueName: {
            type: [String, Number, Boolean],
            default: ''
        },
        /**
         * Input placeholder text.
         */
        placeholder: {
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
         * Select name
         */
        name: {
            type: String,
            default: generateId()
        },
        /**
         * Enable/Disable input field
         */
        isDisabled: {
            type: Boolean,
            default: false
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
         * Is need to autofocus
         */
        isAutofocus: {
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
         * Disable filter options by search value
         */
        isRemoteSearch: {
            type: Boolean,
            default: false
        },
        /**
         * Flag for wait async list
         */
        isFetching: {
            type: Boolean,
            default: false
        },
        /**
         * Loading status
         */
        isLoading: {
            type: Boolean,
            default: false
        },
        /**
         * Text value of the tooltip label
         */
        tooltipLabelMessage: {
            type: String,
            default: ''
        },
        /**
         * Style size
         */
        size: {
            type: String as PropType<E_SELECT_SIZE_MAP[keyof E_SELECT_SIZE_MAP]>,
            default: E_SELECT_SIZE_MAP.NORMAL,
            validator: (value: E_SELECT_SIZE_MAP) => Object.values(E_SELECT_SIZE_MAP).includes(value)
        },
        /**
         * The list of Options.
         * ```
         * [{ key: any, isDisabled: boolean }] || Array<string>
         * ```
         */
        options: {
            type: Array as PropType<Array<TSelectOption | ISelectOption>>,
            required: true
        },
        /**
         * The unique key for Options items.
         */
        keyField: {
            type: String,
            default: E_FIELDS.ID
        },
        /**
         * The text to display for Options items.
         */
        nameField: {
            type: String,
            default: E_FIELDS.NAME
        },
        /**
         * The text to display for Options items.
         */
        suffixField: {
            type: String,
            default: E_FIELDS.SUFFIX
        },
        /**
         * The IconName, placed before OptionName.
         */
        icon: {
            type: String,
            default: ''
        },
        /**
         * The icon to display for Options items.
         */
        iconField: {
            type: String,
            default: E_FIELDS.ICON
        },
        /**
         * Select suffix value
         */
        suffixValue: {
            type: String,
            default: ''
        },
        /**
         * Dropdown Position
         * @values top, bottom
         */
        openDirection: {
            type: String,
            default: E_TOOLTIP_DIRECTIONS.BOTTOM,
            validator: (value: E_TOOLTIP_DIRECTIONS) => {
                return [
                    E_TOOLTIP_DIRECTIONS.TOP,
                    E_TOOLTIP_DIRECTIONS.BOTTOM
                ].includes(value);
            }
        },
        /**
         * Select label value
         */
        label: {
            type: String,
            default: ''
        },
        /**
         * Text value of the select additional label
         */
        additionalLabel: {
            type: String,
            default: ''
        },
        /**
         * Text for no search result
         */
        notFoundLabel: {
            type: String,
            default: '-'
        },
        /**
         * Hide/Show error
         */
        isErrorShow: {
            type: Boolean,
            default: true
        },
        /**
         * Show/Hide error message
         */
        isErrorShowMessage: {
            type: Boolean,
            default: true
        },
        /**
         * Select error message
         */
        errorMessage: {
            type: String,
            default: ''
        },
        /**
         * Disabled options
         */
        isDisabledOptionsShow: {
            type: Boolean,
            default: true
        },
        /**
         * Enable Multiple mod
         */
        isMultiple: {
            type: Boolean,
            default: false
        },
        /**
         * AQA attribute
         */
        atAttribute: {
            type: String,
            default: ''
        }
    },
    emits: {
        show: null,
        'update:searchValue': null,
        'update:modelValue': null
    },
    setup(props, { emit }) {
        const isShow = ref(false);
        const isLocalOpen = ref(false);
        const refSearch = ref();
        const optionalLocalSearch = ref('');

        const localSearch = computed({
            get: () => props.searchValue || optionalLocalSearch.value,
            set(value: string) {
                optionalLocalSearch.value = value;

                /**
                 * Emitted when search changed
                 * @property { String } value
                 */
                emit('update:searchValue', value);
            }
        });

        const isSearchableExist = computed(() => props.isSearchable && !props.isFetching);
        const isLocalDisabled = computed(() => props.isDisabled || props.isLoading);
        const arrowDirection = computed(() => isLocalOpen.value ? E_ICON_DIRECTIONS.DOWN : E_ICON_DIRECTIONS.UP);
        const iconsSize = computed(() => props.size === E_SELECT_SIZE_MAP.SMALL ? '12' : '16');

        const isErrorsExist = computed(() => Boolean(props.errorMessage) && props.isErrorShow);
        const errorMessageText = computed(() => (isErrorsExist.value && props.isErrorShowMessage) ? props.errorMessage : '');

        function checkSelectedValue(value: TModelValue) {
            if (props.isMultiple) {
                return (localValue.value as Array<TModelValue>).includes(value);
            }

            return localValue.value === value;
        }

        const isEmptyValue = computed(() => {
            if (props.isMultiple) {
                return !(localValue.value as Array<TModelValue>).length;
            }

            return isEmptyString(localValue.value);
        });

        const normalizeOptions = computed<Array<ISelectOption>>(() => {
            const isOptionObject = isObject(props.options[0]);
            return props.options.map(item => {
                return isOptionObject
                    ? item as ISelectOption
                    : {
                        [props.keyField]: item,
                        [props.nameField]: item
                    };
            });
        });

        const localOptions = computed<Array<ISelectOption>>(() => {
            const isFilterExist = !props.isRemoteSearch && Boolean(localSearch.value.length);
            const visibleOptions = normalizeOptions.value.flatMap(option => {
                const isChecked = checkSelectedValue(option[props.keyField]);
                const isShowExist = props.isDisabledOptionsShow || !option.isDisabled;
                const isExist = isChecked || isShowExist;

                return isExist
                    ? [{
                        ...option,
                        isChecked,
                        localClass: option.isDisabled ? 'select__control--disabled' : null
                    }]
                    : [];
            });

            return isFilterExist
                ? visibleOptions.filter((option: ISelectOption) => {
                    const name = option[props.nameField].toLowerCase();
                    const suffix = option[props.suffixField]?.toLowerCase();
                    const value = localSearch.value.toLowerCase();

                    return [name, suffix].some(item => item?.includes(value));
                })
                : visibleOptions;
        });

        const isEmptyList = computed(() => !localOptions.value.length);

        const currentOption = computed(() => {
            return normalizeOptions.value.find(item => checkSelectedValue(item[props.keyField]));
        });

        const sizeClass = computed(() => `select--${props.size}`);
        const openClass = computed(() => isLocalOpen.value ? 'select__control--open' : null);
        const errorClass = computed(() => isErrorsExist.value ? 'select__control--error' : null);
        const descriptionErrorClass = computed(() => isErrorsExist.value ? 'select__control-description--error' : null);
        const disabledClass = computed(() => props.isDisabled ? 'select__control--disabled' : null);
        const emptyClass = computed(() => isEmptyValue.value ? 'select__control--empty' : null);

        const localState = computed(() => {
            if (!isEmptyValue.value) {
                const currentOptionsName = currentOption.value?.[props.nameField];
                const state = currentOptionsName || props.defaultValueName;

                if (state) {
                    return String(state);
                }
            }

            return !props.isLoading ? localValue.value : '';
        });

        const isSmallSize = computed(() => props.size === E_SELECT_SIZE_MAP.SMALL);

        const localSuffixState = computed(() => {
            const isOptionSuffixExist = !isSmallSize.value && Boolean(currentOption.value?.[props.suffixField]);
            return isOptionSuffixExist ? currentOption.value?.[props.suffixField] : props.suffixValue;
        });
        const localIconState = computed(() => {
            const isIconExist = !isSmallSize.value && Boolean(currentOption.value?.[props.iconField]);
            return isIconExist ? currentOption.value?.[props.iconField] : null;
        });

        const localValue = computed({
            get: () => {
                const isMultipleEmpty = props.isMultiple && !Array.isArray(props.modelValue);
                return !isMultipleEmpty ? props.modelValue : [];
            },
            set(value) {
                /**
                 * Emit on change input value
                 * @property { String } value
                 */
                emit('update:modelValue', value);
            }
        });

        const multipleTags = computed(() => {
            return normalizeOptions.value.filter(item => checkSelectedValue(item[props.keyField]));
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

        async function handleShow() {
            localSearch.value = '';
            isLocalOpen.value = true;
            await nextTick();
            refSearch.value?.focus();

            /**
             * Emitted when Dropdown Show
             */
            emit('show');
        }

        function handleHide() {
            isLocalOpen.value = false;
        }

        function autofocusHandler() {
            if (props.isAutofocus) {
                isShow.value = true;
            }
        }

        onMounted(autofocusHandler);

        return {
            isShow,
            openClass,
            refSearch,
            iconsSize,
            sizeClass,
            errorClass,
            localState,
            localValue,
            emptyClass,
            isEmptyList,
            localSearch,
            isSmallSize,
            isEmptyValue,
            localOptions,
            multipleTags,
            disabledClass,
            arrowDirection,
            localIconState,
            isLocalDisabled,
            errorMessageText,
            localSuffixState,
            isSearchableExist,
            descriptionErrorClass,
            handleShow,
            handleHide,
            selectHandler
        };
    }
});
</script>

<style lang="css" src="../../../../node_modules/floating-vue/dist/style.css" />
<style lang="scss" src="./a-select.scss" />
