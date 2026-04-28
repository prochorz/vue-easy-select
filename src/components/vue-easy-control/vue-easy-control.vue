<template>
  <div
    ref="refContent"
    :class="[disabledClass]"
    class="vue-easy-control"
    role="combobox"
    :tabindex="globalProps.isDisabled ? -1 : 0"
    :aria-expanded="isOpen"
    aria-haspopup="listbox"
    :aria-controls="listId"
    :aria-activedescendant="activeDescendantId"
    :aria-disabled="globalProps.isDisabled || undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
      <div class="vue-easy-control__content">
          <VueEasyStateSearch v-if="isSearchableExist">
              <template v-if="$slots['search-icon']" #search-icon>
                  <slot name="search-icon" />
              </template>
          </VueEasyStateSearch>
          <template v-else>
            <span v-if="isEmptyValue">
                {{ globalProps.placeholder }}
            </span>
            <template v-else>
                <slot name="state" :state="currentState">
                    <VueEasyStateMultiple v-if="isMultiple" />
                    <template v-else>
                      <span>
                        {{ localValueName }}
                      </span>
                    </template>
                </slot>
            </template>
          </template>
      </div>
      <button
          v-if="isClearVisible"
          type="button"
          class="vue-easy-control__clear"
          tabindex="-1"
          aria-label="Clear selection"
          @click.stop="clearValue"
      >
          <slot name="clear-icon">
              <span class="vue-easy-control__clear-icon" aria-hidden="true" />
          </slot>
      </button>
      <div
          v-if="$slots.arrow"
          class="vue-easy-control__arrow"
      >
          <slot name="arrow" />
      </div>

      <NativeSelect v-if="globalProps.name" />
  </div>
</template>

<script setup lang="ts">
import type { TModelValue } from '../../types/select.type';

import {
    ref,
    watch,
    computed
} from 'vue';

import NativeSelect from '../native-select';
import VueEasyStateSearch from '../vue-easy-state-search';
import VueEasyStateMultiple from '../vue-easy-state-multiple';

import { useInject } from '../../use/use-context';
import useResizeObserver from '../../use/use-resize-observer';
import { E_SEARCH_POSITION } from '../../constants/component-constants';

defineOptions({ name: 'VueEasyControl' });

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits<{
    (e: 'resize'): void
    (e: 'toggle'): void
    (e: 'close'): void
}>();

const {
    currentState,
    globalProps,
    localValue,
    localOptions,
    activeIndex,
    moveActive,
    selectActive,
    clearValue,
    listId,
    getOptionId
} = useInject();

const refContent = ref();

const { height } = useResizeObserver(refContent);

const isSearchableExist = computed(() => {
    return globalProps.searchPosition === E_SEARCH_POSITION.CONTROL && globalProps.isSearchable && props.isOpen
});
const isMultiple = computed(() => Boolean(globalProps.isMultiple));

const disabledClass = computed(() => globalProps.isDisabled ? 'vue-easy-control--disabled' : null)

const isEmptyValue = computed(() => {
    if (isMultiple.value) {
        return !(localValue.value as Array<TModelValue>).length;
    }

    return localOptions.value.every(item => item[globalProps.keyField] !== localValue.value)
});

const localValueName = computed(() => {
    return localOptions.value.find(item => item[globalProps.keyField] === localValue.value)?.[globalProps.nameField]
});

const isClearVisible = computed(() =>
    Boolean(globalProps.isClearable) && !globalProps.isDisabled && !isEmptyValue.value
);

const activeDescendantId = computed(() =>
    props.isOpen && activeIndex.value >= 0 ? getOptionId(activeIndex.value) : undefined
);

function isTypingTarget(target: EventTarget | null): boolean {
    const el = target as HTMLElement | null;
    if (!el) return false;
    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
}

function onClick(event: MouseEvent) {
    if (globalProps.isDisabled) return;
    if (isTypingTarget(event.target)) return;
    emit('toggle');
}

function onKeydown(event: KeyboardEvent) {
    if (globalProps.isDisabled) return;
    const { key } = event;

    if (key === 'ArrowDown') {
        event.preventDefault();
        if (!props.isOpen) emit('toggle');
        else moveActive(1);
        return;
    }

    if (key === 'ArrowUp') {
        event.preventDefault();
        if (!props.isOpen) emit('toggle');
        else moveActive(-1);
        return;
    }

    if (key === 'Enter') {
        event.preventDefault();
        if (!props.isOpen) {
            emit('toggle');
            return;
        }
        if (activeIndex.value >= 0) {
            selectActive();
            if (!isMultiple.value) emit('close');
        }
        return;
    }

    if (key === 'Escape') {
        if (props.isOpen) {
            event.preventDefault();
            emit('close');
        }
        return;
    }

    if (key === ' ' || key === 'Spacebar') {
        if (isTypingTarget(event.target)) return;
        event.preventDefault();
        emit('toggle');
    }
}

function resizeHandler() {
    emit('resize');
}

watch(height, resizeHandler)
</script>

<style scoped lang="scss" src="./vue-easy-control.scss" />
