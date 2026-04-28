<template>
  <VueEasyWrapper v-bind="localBind">
      <div
        ref="refControl"
        :class="[disabledClass, openClass]"
        class="vue-easy-select__control"
      >
          <VueEasyControl
              :is-open="isOpen"
              @toggle="toggleHandler"
              @close="closeHandler"
              @resize="updateDropdownStyle"
          >
              <template #arrow>
                  <slot name="arrow" :is-open="isOpen">
                      <i class="vue-easy-select__arrow-icon" />
                  </slot>
              </template>
              <template v-if="$slots['search-icon']" #search-icon>
                  <slot name="search-icon" />
              </template>
              <template v-if="$slots['clear-icon']" #clear-icon>
                  <slot name="clear-icon" />
              </template>
          </VueEasyControl>
      </div>
      <Teleport to="body">
          <Transition
            name="roll"
            @beforeEnter="updateDropdownStyle"
            @afterEnter="onDropdownOpened"
            @beforeLeave="onDropdownClosed"
          >
            <div
              v-if="isOpen"
              ref="refDropdown"
              :style="dropdownStyle"
              :class="[dropdownClass]"
              class="vue-easy-select__dropdown"
            >
                <VueEasyOptions
                  class="vue-easy-select__dropdown-inner"
                  @selected="selectHandler"
                >
                    <template #item="slotProps">
                        <slot name="item" v-bind="slotProps" />
                    </template>
                    <template v-if="$slots['search-icon']" #search-icon>
                        <slot name="search-icon" />
                    </template>
                </VueEasyOptions>
            </div>
          </Transition>
      </Teleport>
  </VueEasyWrapper>
</template>

<script setup lang="ts">
import {
    ref,
    computed,
    useAttrs,
    onBeforeUnmount
} from 'vue';

import VueEasyWrapper from '../vue-easy-wrapper';
import VueEasyControl from '../vue-easy-control';
import VueEasyOptions from '../vue-easy-options';

import {
    stubProps,
    componentProps
} from '../../constants/global-props-constants';

const MAX_HEIGHT = 200;

defineOptions({ name: 'VueEasySelect' });

const props = defineProps({ ...componentProps, ...stubProps });
const attrs = useAttrs()

const isOpen = ref(false);
const dropdownStyle = ref({});

const refControl = ref<HTMLElement>();
const refDropdown = ref<HTMLElement>();

const localBind = computed(() => ({ ...props, ...attrs }));

const dropdownClass = ref();
const openClass = computed(() => isOpen.value ? 'vue-easy-select--open' : null)
const disabledClass = computed(() => props.isDisabled ? 'vue-easy-select--disabled' : null)

function updateDropdownStyle() {
    if (!refControl.value) return;
    const rect = refControl.value.getBoundingClientRect();
    const bottomOfDocument = document.documentElement.offsetHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const isDownPosition = bottomOfDocument >= rect.top + rect.height + scrollTop + MAX_HEIGHT;

    const left = rect.left + scrollLeft;
    const top = isDownPosition
        ? rect.top + rect.height + scrollTop
        : rect.top + scrollTop;
    const transform = isDownPosition
        ? `translate3d(${left}px, ${top}px, 0)`
        : `translate3d(${left}px, calc(${top}px - 100%), 0)`;

    dropdownClass.value = isDownPosition ? 'vue-easy-select--down' : 'vue-easy-select--up';

    dropdownStyle.value =  {
        transform,
        width: `${rect.width}px`,
        maxHeight: `${MAX_HEIGHT}px`
    };
}

function toggleHandler() {
    if (props.isDisabled) return;
    isOpen.value = !isOpen.value;
}

function closeHandler() {
    isOpen.value = false;
}

function selectHandler() {
    if (!props.isMultiple) {
        isOpen.value = false;
    }
}

function outSideClick(event: MouseEvent) {
    const targets = [refDropdown.value, refControl.value];
    const target = event.target as Node;
    const isContains = targets.some(item => item && (item === target || item.contains(target)));

    if (!isContains) {
        isOpen.value = false;
    }
}

function handleReposition() {
    if (isOpen.value) updateDropdownStyle();
}

function subscribeOutsideClick() {
    document.addEventListener('click', outSideClick);
}

function unsubscribeOutsideClick() {
    document.removeEventListener('click', outSideClick);
}

function subscribeReposition() {
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
}

function unsubscribeReposition() {
    window.removeEventListener('scroll', handleReposition, true);
    window.removeEventListener('resize', handleReposition);
}

function onDropdownOpened() {
    subscribeOutsideClick();
    subscribeReposition();
}

function onDropdownClosed() {
    unsubscribeOutsideClick();
    unsubscribeReposition();
}

onBeforeUnmount(() => {
    unsubscribeOutsideClick();
    unsubscribeReposition();
});
</script>

<style scoped lang="scss" src="./vue-easy-select.scss" />
