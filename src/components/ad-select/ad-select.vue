<template>
  <ADWrapper
    :is-disabled="isDisabled"
  >
      <div
        ref="refControl"
        :class="[disabledClass, openClass]"
        class="ad-select__control"
        @click="toggleHandler"
      >
          <ADControl>
              <template #arrow>
                  <slot name="arrow" :is-open="isOpen">
                      <i class="ad-select__arrow-icon" />
                  </slot>
              </template>
          </ADControl>
      </div>
      <Teleport to="body">
          <Transition
            name="roll"
            @beforeEnter="updateDropdownStyle"
            @afterEnter="subscribeOutsideClick"
            @beforeLeave="unsubscribeOutsideClick"
          >
            <div
              v-if="isOpen"
              ref="refDropdown"
              :style="dropdownStyle"
              :class="[dropdownClass]"
              class="ad-select__dropdown"
            >
                <ADOptions
                  class="ad-select__dropdown-inner"
                  @@selected="selectHandler"
                />
            </div>
          </Transition>
      </Teleport>
  </ADWrapper>
</template>

<script lang="ts">
import {
    ref,
    computed,
    defineComponent
} from 'vue';

import ADWrapper from '../ad-wrapper';
import ADControl from '../ad-control';
import ADOptions from '../ad-options';

import { componentProps } from '../../constants/global-props-constants';

const MAX_HEIGHT = 200;

export default defineComponent({
    name: 'ADSelect',
    props: {
        isDisabled: componentProps.isDisabled
    },
    components: {
        ADWrapper,
        ADControl,
        ADOptions
    },
    setup(props) {
        const isOpen = ref(false);
        const dropdownStyle = ref({});

        const refControl = ref(null);
        const refDropdown = ref(null);

        const dropdownClass = ref(null);
        const openClass = computed(() => isOpen.value ? 'ad-select--open' : null)
        const disabledClass = computed(() => props.isDisabled ? 'ad-select--disabled' : null)

        function updateDropdownStyle() {
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

            dropdownClass.value = isDownPosition ? 'ad-select--down' : 'ad-select--up';

            dropdownStyle.value =  {
                transform,
                width: `${rect.width}px`,
                maxHeight: `${MAX_HEIGHT}px`
            };
        }

        function toggleHandler() {
            isOpen.value = !isOpen.value;
        }

        function selectHandler() {
            toggleHandler();
        }

        async function outSideClick(event) {
            const targets = [refDropdown.value, refControl.value];
            const isContains = targets.some(item => item && (item === event.target || item.contains(event.target)));

            if (!isContains) {
                toggleHandler();
            }
        }

        function subscribeOutsideClick() {
            document.addEventListener('click', outSideClick);
        }

        function unsubscribeOutsideClick() {
            document.removeEventListener('click', outSideClick);
        }

        return {
            isOpen,
            openClass,
            refControl,
            refDropdown,
            disabledClass,
            dropdownStyle,
            dropdownClass,
            toggleHandler,
            selectHandler,
            subscribeOutsideClick,
            unsubscribeOutsideClick,
            updateDropdownStyle
        };
    }
})
</script>

<style scoped lang="scss" src="./ad-select.scss" />