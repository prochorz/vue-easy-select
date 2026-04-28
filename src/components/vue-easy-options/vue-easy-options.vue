<template>
    <div
        ref="refRoot"
        :id="listId"
        :class="['vue-easy-options', { 'vue-easy-options--has-search': isSearchInOptions }]"
        role="listbox"
        :aria-multiselectable="globalProps.isMultiple || undefined"
    >
        <div
            v-if="isSearchInOptions"
            class="vue-easy-options__search"
        >
            <VueEasyStateSearch>
                <template v-if="$slots['search-icon']" #search-icon>
                    <slot name="search-icon" />
                </template>
            </VueEasyStateSearch>
        </div>
        <div v-if="!optionsList.length" class="vue-easy-options__empty">
            <slot name="empty">
                No options
            </slot>
        </div>
        <ul v-else class="vue-easy-options__list">
            <li
                v-for="(item, index) in optionsList"
                :key="item.key"
                :id="getOptionId(index)"
                role="option"
                :aria-selected="item.isChecked"
                :aria-disabled="item[globalProps.disabledField] || undefined"
                class="vue-easy-options__item"
                @mouseenter="setActiveIndex(index)"
                @click="clickHandler(item)"
            >
                <slot
                    :item="localOptions[index]"
                    :is-active="activeIndex === index"
                    name="item"
                >
                    <div :class="item.innerClasses">
                        {{ item[globalProps.nameField] }}
                    </div>
                </slot>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    watch
} from 'vue';

import VueEasyStateSearch from '../vue-easy-state-search';

import { useInject } from '../../use/use-context';
import { E_SEARCH_POSITION } from '../../constants/component-constants';

defineOptions({ name: 'VueEasyOptions' });

const emit = defineEmits<{
  (e: 'selected', option: Record<string, any>): void
}>();

const {
    globalProps,
    localOptions,
    selectHandler,
    activeIndex,
    setActiveIndex,
    resetActive,
    listId,
    getOptionId
} = useInject();

const refRoot = ref<HTMLElement>();

const isSearchInOptions = computed(() =>
    globalProps.isSearchable && globalProps.searchPosition === E_SEARCH_POSITION.OPTIONS
);

const optionsList = computed(() => {
    return localOptions.value.map((option, index) => {
        const isDisabled = Boolean(option[globalProps.disabledField]);
        const innerClasses = [
            'vue-easy-options__item-inner',
            option.isChecked && 'vue-easy-options__item-inner--checked',
            isDisabled && 'vue-easy-options__item-inner--disabled',
            activeIndex.value === index && 'vue-easy-options__item-inner--active'
        ].filter(Boolean);
        return {
            ...option,
            innerClasses
        }
    })
});

function clickHandler(option: Record<string, any>) {
    selectHandler(option);

    if (!option[globalProps.disabledField]) {
        emit('selected', option);
    }
}

onMounted(() => {
    const options = localOptions.value;
    const selected = options.findIndex(o => o.isChecked && !o[globalProps.disabledField]);
    if (selected >= 0) {
        setActiveIndex(selected);
        return;
    }
    const firstEnabled = options.findIndex(o => !o[globalProps.disabledField]);
    setActiveIndex(firstEnabled);
});

onUnmounted(() => {
    resetActive();
});

watch(activeIndex, (idx) => {
    if (idx < 0) return;
    nextTick(() => {
        const el = document.getElementById(getOptionId(idx));
        el?.scrollIntoView({ block: 'nearest' });
    });
});
</script>

<style scoped lang="scss" src="./vue-easy-options.scss" />
